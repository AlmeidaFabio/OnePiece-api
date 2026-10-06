import { Request, Response } from 'express';

export class HomeController {
    async home(request: Request, response: Response) {
        const baseUrl = process.env.BASE_URL;
        const port = process.env.PORT;

        response.render('home', {
            baseUrl,
            port
        });
    }
}
