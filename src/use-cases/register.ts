import { SecUser } from '@prisma/client'
import { SecUserRepository } from '../repositories/secuser-repository'
import { UserAlreadyExists } from './errors/user-already-exists-error'

interface RegisterUseCaseRequest {
  secusernamecomp: string
  email: string
  secusername: string
  secuserpassword: string
}

interface RegisterUseCaseResponse {
  user: SecUser
}

export class RegisterUseCase {
  constructor(private repository: SecUserRepository) {}

  async execute({
    secusernamecomp,
    email,
    secusername,
    secuserpassword,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.repository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExists()
    }

    const now = new Date()

    const encryptedPassword = await this.repository.encryptPassword(
      secuserpassword,
      now,
    )

    const user = await this.repository.create({
      secusername: secusername.toUpperCase(),
      secuserpassword: encryptedPassword,
      secuseractive: true,
      secuserbloqueado: false,
      secuserdatacadastro: now,
      secusersenhaprovisoria: false,
      secuserstatus: 'S',
      secusernamecomp,
      secuseremail: email,
    })

    return {
      user,
    }
  }
}
