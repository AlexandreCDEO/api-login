export class UserAlreadyExists extends Error {
  constructor() {
    super('Já existe um usuário com este email. Por favor verifique!')
  }
}
