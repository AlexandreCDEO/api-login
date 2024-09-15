import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from "zod"
import { PrismaSecUserRepository } from '../../repositories/prisma/prisma-secuser-repository'
import { AuthenticateUseCase } from '../../use-cases/authenticate'
import { InvalidCredentialError } from '../../use-cases/errors/invalid-credentials-error'

export async function authenticate (request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        secusername: z.string(),
        secuserpassword: z.string().min(1)
    })

    const { secusername, secuserpassword } = authenticateBodySchema.parse(request.body)

    try {
        const prismaSecUserRepository = new PrismaSecUserRepository()
        const authenticateUseCase = new AuthenticateUseCase(prismaSecUserRepository)

        await authenticateUseCase.execute({ secusername, secuserpassword})
        
        return reply.status(200).send({success: true, message: 'Autenticado com sucesso!'})

    } catch (err) {
        if(err instanceof(InvalidCredentialError)) {
            return reply.status(400).send({message: err.message})
        }

        throw err
    } 
}