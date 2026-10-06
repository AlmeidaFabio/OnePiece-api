import crypto from 'crypto';
import path from 'path';
import { unlink } from 'fs/promises';
import { Request } from 'express';
import sharp from 'sharp';
import { AppError } from '../errors/AppError';

/** Pasta pública onde as imagens dos personagens ficam acessíveis em /images/<arquivo>. */
export const IMAGES_DIR = path.resolve(__dirname, '..', '..', 'public', 'images');

/**
 * Só aceitamos nomes gerados por nós: 32 caracteres hexadecimais + .jpg.
 * Isso impede que uma URL fornecida pelo cliente vire um caminho arbitrário
 * (path traversal) na hora de apagar o arquivo.
 */
const GENERATED_FILENAME = /^[a-f0-9]{32}\.jpg$/;

/**
 * Processa o arquivo recebido em memória e grava a versão final em public/images.
 *
 * Sempre .jpg porque o sharp converte qualquer entrada para JPEG — antes o
 * arquivo mantinha a extensão do mime original (.png) guardando bytes JPEG.
 * Retorna o nome do arquivo gerado (não a URL).
 */
export async function saveCharacterImage(file: Express.Multer.File): Promise<string> {
    if (!file?.buffer?.length) {
        throw new AppError('Arquivo de imagem inválido', 400);
    }

    const filename = `${crypto.randomBytes(16).toString('hex')}.jpg`;

    await sharp(file.buffer)
        .rotate() // respeita a orientação EXIF de fotos de celular
        .resize(300)
        .jpeg({ quality: 82 })
        .toFile(path.join(IMAGES_DIR, filename));

    return filename;
}

/** Monta a URL pública a partir da própria requisição (evita BASE_URL/PORT indefinidos). */
export function buildImageUrl(request: Request, filename: string): string {
    return `${request.protocol}://${request.get('host')}/images/${filename}`;
}

/**
 * Extrai o nome do arquivo apenas quando a URL aponta para uma imagem gerenciada
 * por esta API. URLs externas (ex.: as do seed, que apontam para a wiki) são ignoradas.
 */
export function filenameFromImageUrl(imageUrl?: string | null): string | null {
    if (!imageUrl) return null;

    try {
        const { pathname } = new URL(imageUrl);
        if (!pathname.startsWith('/images/')) return null;

        const filename = pathname.slice('/images/'.length);
        return GENERATED_FILENAME.test(filename) ? filename : null;
    } catch {
        return null;
    }
}

/** Remove o arquivo da imagem, se ele pertencer a esta API. Nunca lança. */
export async function deleteCharacterImage(imageUrl?: string | null): Promise<void> {
    const filename = filenameFromImageUrl(imageUrl);
    if (!filename) return;

    try {
        await unlink(path.join(IMAGES_DIR, filename));
    } catch {
        // arquivo já não existe: nada a fazer
    }
}
