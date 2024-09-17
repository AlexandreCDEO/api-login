import { describe, expect, it } from 'vitest'
import { PrismaSecUserRepository } from '../repositories/prisma/prisma-secuser-repository'
import { RegisterUseCase } from './register'

describe('Register Use Case', () => {
  it('should has user password upon registration', async () => {
    const repository = new PrismaSecUserRepository()
    const sut = new RegisterUseCase(repository)

    const password = '123456'

    const user = await sut.execute({
      email: 'jhondoe02@mail.com',
      secusernamecomp: 'Jhon Doe',
      secusername: 'jhondoe001',
      secuserpassword: password,
    })

    const passwordDecripted = await repository.decryptPassword(
      user.user.secuserpassword!,
      user.user.secuserdatacadastro!,
    )

    expect(passwordDecripted).toEqual(password)
  })
})
