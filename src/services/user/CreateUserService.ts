import prismaClient from '../../prisma'
// Define o tipo enumerado para tipoUsuario
// Defina o ENUM dentro da classe CreateUserService
import nodemailer from 'nodemailer';
import { hash } from 'bcryptjs'

interface UserRequest {
    email: string;
    nomeUsuario: string;
    senha: string;
}
class CreateUserService {
    async execute({ email, nomeUsuario, senha }: UserRequest) {
        // Verifica se o email foi enviado
        this.verifyEmail(email);
        // Verifica se o email já está cadastrado
        const userAlreadyExists = await this.checkIfUserExists(email);
        if (userAlreadyExists) {
            return { user: null, userAlreadyExists: true }; // Retorna informação sobre o usuário já existente

        }
        // Cria o novo usuário
        //fazer a criptografia aqui(hash)
        const senhaHash = await hash(senha, 8)
        const user = await prismaClient.user.create({
            data: {
                userID: email,
                nomeUsuario: nomeUsuario,
                senha: senhaHash
            },
            select: {
                userID: true,
                nomeUsuario: true,

            }
        })
        /*-----------------------------------------------------
        *Neste ponto, grave um BD com os seguintes atributos
        *    email (É o email do usuario que foi enviado o toke)
        *    Token (Token gerado - "codigoGerado")
        *    data/hora da gravação (Para controlar o tempo de espera da confirmação) 
        *--------------------------------------------------------*/
        this.enviaEmail(email)
            .then(codigoGerado => {
                console.log('Código gerado:', codigoGerado);
                // Faça o que precisar com o código gerado
                return { user };
            })
            .catch(error => {
                console.error('Erro ao enviar e-mail:', error);
                // Trate o erro, se necessário
            });
        //----------------------

    }
    private async verifyEmail(email: string) {
        if (!email) {
            throw new Error("Email deve ser informado");
        }
        // Podemos adicionar outras validações de email, se necessário
    }
    private async checkIfUserExists(email: string) {
        const userExists = await prismaClient.user.findFirst({
            where: {
                userID: email
            }
        });
        return userExists !== null;
    }
    //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    private async enviaEmail(emailTO: string): Promise<string> {
        // Gerar código fácil
        const emailFROM = 'seuemail@gmail.com';//Email origem
        const emailUSER = 'seuemail@gmail.com';//Conta do EMAIL
        const gerarCodigoFacil = (length: number) => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let codigo = '';
            for (let i = 0; i < length; i++) {
                codigo += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return codigo;
        };
        const codigoFacil = gerarCodigoFacil(6); // Gerar código de 6 caracteres
        const codigoGerado = codigoFacil;
        // Formatar HTML para o e-mail
        const htmlEmail = `
            <h1>Caro Usuário,</h1>
            <p>Saudações.</p>
            <p>Para liberar seu usuário no sistema, utilize o código: <strong>${codigoGerado}</strong>.</p>
            `;

        // Configurar o transporte de e-mail
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: emailUSER,
                pass: 'xxxx yyyy zzzz kkkk',
            },
        });

        // Definir as informações do e-mail
        const mailOptions = {
            from: emailFROM,
            to: emailTO,
            subject: 'Liberar usuário no sistema',
            html: htmlEmail,
        };
        // Retornar uma promessa que resolve com o código gerado
        return new Promise<string>((resolve, reject) => {
            // Enviar o e-mail
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Erro ao enviar e-mail:', error);
                    reject('Erro ao enviar e-mail');
                } else {
                    console.log('E-mail enviado:', info.response);
                    resolve(codigoGerado); // Resolve com o código gerado
                }
            });
        });
    }
}
export { CreateUserService }
