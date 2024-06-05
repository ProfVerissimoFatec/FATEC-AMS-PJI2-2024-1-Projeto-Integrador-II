import { Request, response, Response } from "express";
import { CreateUserService } from '../../src/services/user/CreateUserService'
class CreateUserController {
    async handle(req: Request, res: Response) {
        const { email, nomeUsuario, senha } = req.body
        const createUserService = new CreateUserService();
        const user = await createUserService.execute({
            email,
            nomeUsuario,
            senha
        });
        return res.json(user);
    }
}
export { CreateUserController }
