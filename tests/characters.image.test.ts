import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { api, bearer, disconnect, loginAsAdmin, resetDatabase } from './helpers';

const IMAGES_DIR = path.resolve('public', 'images');

const imagemPng = (tamanho = 20, cor = '#c00') =>
    sharp({ create: { width: tamanho, height: tamanho, channels: 3, background: cor } })
        .png()
        .toBuffer();

const arquivosDeImagem = (): string[] => fs.readdirSync(IMAGES_DIR).filter((arquivo) => arquivo !== '.gitkeep');

/** Nome do arquivo que a API gerou, extraído da URL pública. */
const arquivoDaUrl = (url: string): string => path.basename(new URL(url).pathname);

let arquivosAntes: string[] = [];
/**
 * Um único login por arquivo: o rate limit do login é de 10 tentativas e esta
 * suíte fazia 11, o que a fazia falhar por 429 em vez do erro esperado.
 */
let token: string;

describe('pipeline de imagens de personagem', () => {
    beforeAll(async () => {
        arquivosAntes = arquivosDeImagem();
        token = await loginAsAdmin();
    });

    beforeEach(async () => {
        await resetDatabase();
    });

    afterAll(async () => {
        // Remove apenas o que os testes criaram, para não tocar em uploads reais.
        for (const arquivo of arquivosDeImagem()) {
            if (!arquivosAntes.includes(arquivo)) {
                fs.unlinkSync(path.join(IMAGES_DIR, arquivo));
            }
        }

        await disconnect();
    });

    const criarComImagem = async (nome: string) => {
        return api()
            .post('/api/characters')
            .set(bearer(token))
            .field('name', nome)
            .field('description', 'Personagem de teste do pipeline de imagens')
            .field('bounty', '1000')
            .attach('image', await imagemPng(), 'teste.png');
    };

    it('grava a imagem processada e a serve como JPEG', async () => {
        const response = await criarComImagem('Com Imagem');

        expect(response.status).toBe(201);

        const url: string = response.body.data.image;
        const arquivo = arquivoDaUrl(url);

        // Sempre .jpg: o sharp converte qualquer entrada para JPEG.
        expect(arquivo).toMatch(/^[a-f0-9]{32}\.jpg$/);
        expect(fs.existsSync(path.join(IMAGES_DIR, arquivo))).toBe(true);

        const servida = await api().get(new URL(url).pathname);
        expect(servida.status).toBe(200);
        expect(servida.headers['content-type']).toContain('image/jpeg');
    });

    it('não deixa diretório temporário para trás', async () => {
        await criarComImagem('Sem Temporario');

        expect(fs.existsSync(path.resolve('tmp'))).toBe(false);
    });

    it('apaga a imagem anterior ao trocar por outra', async () => {
        const criado = await criarComImagem('Troca De Imagem');
        const id = criado.body.data.id;
        const arquivoAntigo = arquivoDaUrl(criado.body.data.image);

        const atualizado = await api()
            .put(`/api/characters/${id}`)
            .set(bearer(token))
            .attach('image', await imagemPng(40, '#00c'), 'nova.png');

        expect(atualizado.status).toBe(200);

        const arquivoNovo = arquivoDaUrl(atualizado.body.data.image);
        expect(arquivoNovo).not.toBe(arquivoAntigo);
        expect(fs.existsSync(path.join(IMAGES_DIR, arquivoAntigo))).toBe(false);
        expect(fs.existsSync(path.join(IMAGES_DIR, arquivoNovo))).toBe(true);
    });

    it('não deixa arquivo órfão quando a validação rejeita a requisição', async () => {
        const antes = arquivosDeImagem().length;

        const response = await api()
            .post('/api/characters')
            .set(bearer(token))
            .field('name', 'Inválido')
            .field('description', 'curta')
            .attach('image', await imagemPng(), 'teste.png');

        expect(response.status).toBe(400);
        expect(arquivosDeImagem()).toHaveLength(antes);
    });

    it('não deixa arquivo órfão quando o nome já existe', async () => {
        await criarComImagem('Nome Duplicado');
        const antes = arquivosDeImagem().length;

        const response = await criarComImagem('Nome Duplicado');

        expect(response.status).toBe(409);
        expect(arquivosDeImagem()).toHaveLength(antes);
    });

    it('remove o arquivo quando o personagem é excluído', async () => {
        const criado = await criarComImagem('Vai Sair');
        const arquivo = arquivoDaUrl(criado.body.data.image);

        const exclusao = await api().delete(`/api/characters/${criado.body.data.id}`).set(bearer(token));

        expect(exclusao.status).toBe(200);
        expect(fs.existsSync(path.join(IMAGES_DIR, arquivo))).toBe(false);
    });

    it('recusa imagem acima de 2MB com mensagem clara', async () => {
        const grande = Buffer.alloc(3 * 1024 * 1024, 1);

        const response = await api()
            .post('/api/characters')
            .set(bearer(token))
            .field('name', 'Imagem Grande')
            .field('description', 'Personagem de teste com arquivo grande')
            .attach('image', grande, 'grande.png');

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('2MB');
    });

    it('recusa arquivo que não é imagem', async () => {
        const token = await loginAsAdmin();

        const response = await api()
            .post('/api/characters')
            .set(bearer(token))
            .field('name', 'Arquivo Errado')
            .field('description', 'Personagem de teste com arquivo inválido')
            .attach('image', Buffer.from('isto nao e uma imagem'), 'arquivo.txt');

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Tipo de arquivo inválido');
    });
});
