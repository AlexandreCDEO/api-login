import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from "zod"
import { PrismaSecUserRepository } from '../../repositories/prisma/prisma-secuser-repository'
import { UserAlreadyExists } from '../../use-cases/errors/user-already-exists-error'
import { RegisterUseCase } from '../../use-cases/register'

export async function register (request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        secusername: z.string(),
        secuserpassword: z.string().min(1),
        secusernamecomp: z.string().min(1),
        secuseremail: z.string().email(),
    })

    const { secusernamecomp, secuseremail, secusername, secuserpassword } = registerBodySchema.parse(request.body)

    try {
        const prismaSecUserRepository = new PrismaSecUserRepository()
        const registerUseCase = new RegisterUseCase(prismaSecUserRepository)

        registerUseCase.execute({
            secusernamecomp, 
            email: secuseremail, 
            secusername, 
            secuserpassword
        })
        
    } catch (err) {
        if(err instanceof UserAlreadyExists) {
            return reply.status(409).send()
        }

        throw err
    }

    return reply.status(201).send()
    
}