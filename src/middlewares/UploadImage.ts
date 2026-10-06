import multer from 'multer';
import { AppError } from '../errors/AppError';

const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];

export default {
    /**
     * memoryStorage: o arquivo fica em buffer e só é gravado em public/images
     * depois da validação, já processado pelo sharp.
     *
     * Antes o multer gravava em tmp/<campo>s/, o que causava três problemas:
     * a pasta tmp/ não existia (todo upload dava ENOENT/500), o arquivo ficava
     * órfão quando a validação rejeitava a requisição, e o nome do arquivo
     * temporário não correspondia ao formato final.
     */
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new AppError('Tipo de arquivo inválido: envie JPEG ou PNG', 400));
        }
    }
};
