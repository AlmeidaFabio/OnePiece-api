import * as multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import { Request } from 'express';
import env from "../utils/env";

const uploadFolder = (fieldname:string) => {
    return path.resolve(__dirname, '..', '..', 'tmp', `${fieldname}s`);
}

type StorageType = 'local';

const storageTypes: Record<StorageType, multer.StorageEngine> = {
    local: multer.diskStorage({
        destination:(req:Request, file:Express.Multer.File, cb) => {
            cb(null, uploadFolder(file.fieldname))
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if(err) cb(null, err.message)

                file.filename = `${hash.toString('hex')}${file.mimetype.replace('image/', '.')}`

                cb(null, file.filename)
            })
        }
    })
}

export default {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'images'),
    storage: storageTypes[env.requireEnv('STORAGE') as StorageType],
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req:Request, file:Express.Multer.File, cb:multer.FileFilterCallback) => {
        const allowedMimes = [
            "image/jpeg",
            "image/jpg",
            "image/png"
        ]
        if(allowedMimes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error("invalid file type."))
        }
    }
}