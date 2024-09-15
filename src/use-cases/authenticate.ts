import { SecUserRepository } from "../repositories/secuser-repository";
import { InvalidCredentialError } from "./errors/invalid-credentials-error";

interface AuthenticateUseCaseRequest {
    secusername: string
    secuserpassword: string
}

export class AuthenticateUseCase {
    constructor(
        private secUserRepository: SecUserRepository
    ){}

    async execute({ secusername, secuserpassword }: AuthenticateUseCaseRequest) {
        const user = await this.secUserRepository.findByUsername(secusername.toUpperCase())

        if(!user) {
            throw new InvalidCredentialError()
        }

        const passwordDecrypted = await this.secUserRepository.decryptPassword(user.secuserpassword!, user.secuserdatacadastro!)

        if(passwordDecrypted !== secuserpassword) {
            throw new InvalidCredentialError()
        }

    }
}