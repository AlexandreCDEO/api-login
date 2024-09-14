import { describe, expect, it } from 'vitest'
import { PrismaSecUserRepository } from '../repositories/prisma/prisma-secuser-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialError } from './errors/invalid-credentials-error'

describe('Authenticate Use Case', () => {
    it('should be able to authenticate', async() => {
        const secUserRepository = new PrismaSecUserRepository()
        const sut = new AuthenticateUseCase(secUserRepository)

        const { user } = await sut.execute({
            secusername: 'JHONDOE',
            secuserpassword: 'password'
        })

        expect(user.secuserid).toEqual(expect.any(Number))
    })

    it('should not be able to authenticate with wrong secusername', async() => {
        const secUserRepository = new PrismaSecUserRepository()
        const sut = new AuthenticateUseCase(secUserRepository)

        expect(() => sut.execute({
            secusername: 'JHONDOE01',
            secuserpassword: 'password'
        })).rejects.toBeInstanceOf(InvalidCredentialError)

    })

    it('should not be able to authenticate with wrong password', async() => {
        const secUserRepository = new PrismaSecUserRepository()
        const sut = new AuthenticateUseCase(secUserRepository)

        expect(() => sut.execute({
            secusername: 'JHONDOE',
            secuserpassword: 'password01'
        })).rejects.toBeInstanceOf(InvalidCredentialError)

    })
})