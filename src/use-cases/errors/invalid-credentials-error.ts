export class InvalidCredentialError extends Error{
    constructor() {
        super('Crecenciais inválidas. Por favor, verifique seu nome de usuário e senha.')
    }
}