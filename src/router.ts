import {Router, Request, Response} from 'express';

import {CreateUserController} from './controllers/CreateUserController'

const router = Router();


router.post('/teste', new CreateUserController().handle)


export {router};
