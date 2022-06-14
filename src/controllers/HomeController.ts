import { Request, Response } from "express";

export class HomeController {
    async home(request:Request, response:Response) {
        let baseUrl = process.env.BASE_URL
        let port = process.env.PORT

        response.render('home', {
            baseUrl,
            port
        }) 
    }
}