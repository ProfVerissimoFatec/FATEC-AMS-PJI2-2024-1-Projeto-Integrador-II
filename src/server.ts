import express, { Request, Response, NextFunction, request, response } from 'express';
import 'express-async-errors';  //Deve ser sempre o segundo comando

import cors from 'cors';


import { router } from './router';

const app = express();
app.use(express.json());
app.use(cors())

app.use(router);

//Vamos criar um Middleware para tratamento de erro
//.todas as rotas passam por este Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) { //se for instancia de erro
        return res.status(400).json({
            error: err.message
        })
    }
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    })
})
app.listen(3333, () => console.log('Servidor on-line - porta 3333'))
