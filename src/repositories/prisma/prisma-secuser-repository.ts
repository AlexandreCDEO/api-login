import { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { SecUserRepository } from '../secuser-repository'

export class PrismaSecUserRepository implements SecUserRepository {
  async encryptPassword(
    password: string,
    registrationDate: Date,
  ): Promise<string | null> {
    try {
      const result: [{ encrypted_password: string }] = await prisma.$queryRaw`
            select u_snd_cripstr(${password}, ${registrationDate.toISOString().replace('T', ' ').replace('Z', '')}::timestamp without time zone, ${'E'}::char) as encrypted_password
        `
      console.log('result', result)
      return result[0]?.encrypted_password || null
    } catch (error) {
      console.error('Erro ao criptografar a senha:', error)
      throw new Error('Erro ao criptografar a senha')
    }
  }

  async decryptPassword(
    password: string,
    registrationDate: Date,
  ): Promise<string | null> {
    try {
      const result: [{ decrypted_password: string }] = await prisma.$queryRaw`
            select u_snd_cripstr(${password}, ${registrationDate.toISOString().replace('T', ' ').replace('Z', '')}::timestamp without time zone, ${'D'}::char) as decrypted_password
        `
      console.log('result', result)
      return result[0]?.decrypted_password || null
    } catch (error) {
      console.error('Erro ao descriptografar a senha:', error)
      throw new Error('Erro ao descriptografar a senha')
    }
  }

  async findByUsername(username: string) {
    const user = await prisma.secUser.findFirst({
      where: {
        secusername: username,
      },
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.secUser.findFirst({
      where: {
        secuseremail: email,
      },
    })

    return user
  }

  async create(data: Prisma.SecUserCreateInput) {
    const user = await prisma.secUser.create({
      data,
    })

    return user
  }
}
