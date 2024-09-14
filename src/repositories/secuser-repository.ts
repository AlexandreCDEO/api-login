import { Prisma, SecUser } from "@prisma/client"

export interface SecUserRepository {
    create(data: Prisma.SecUserCreateInput): Promise<SecUser>
    findByUsername(username: string): Promise<SecUser | null>
    findByEmail(email: string): Promise<SecUser | null>
    encryptPassword(password: string, registrationDate: Date): Promise<string | null>
    decryptPassword(password: string, registrationDate: Date): Promise<string | null>
}