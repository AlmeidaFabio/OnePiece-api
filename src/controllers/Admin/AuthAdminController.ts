import { Request, Response } from 'express';
import { AdminsRepository } from '../../repositories/implementations/AdminsRepository';
import { JWT_ALGORITHM, JWT_EXPIRES_IN, JWT_SECRET } from '../../config/auth';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthAdminController {
    constructor(private adminsRepository: AdminsRepository) {
        this.handle = this.handle.bind(this);
    }

    async handle(request: Request, response: Response) {
        try {
            const { email, password } = request.body;

            const admin = await this.adminsRepository.findByEmail(email);

            if (!admin) {
                return response.status(401).json({ error: 'Invalid credentials' });
            }

            const passwordMatch = await bcrypt.compare(password, admin.password);

            if (!passwordMatch) {
                return response.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, {
                expiresIn: JWT_EXPIRES_IN,
                algorithm: JWT_ALGORITHM
            });

            return response.json({
                admin: {
                    id: admin.id,
                    email: admin.email
                },
                token
            });
        } catch (error) {
            if (error instanceof Error) {
                return response.status(400).json({ error: error.message });
            }
            return response.status(400).json({ error: 'Unknown error' });
        }
    }
}
