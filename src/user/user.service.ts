import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { genSalt, genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    save(user: Partial<User>) {
        const hashedPassword = this.hashPassword(user.password)
        return this,this.prismaService.user.create({
            data: {
                email: user.email,
                password: hashedPassword,
                roles: ['USER']
            }
        })
    }

    findOne(idOrEmail: string) {
        return this.prismaService.user.findFirst({where: {
            OR: [
                {id: idOrEmail},
                {email: idOrEmail}
            ]
        }})
    }

    delete(id) {
        return this.prismaService.user.delete({where: {id}})
    }

    private hashPassword(password: string) {
        return hashSync(password, genSaltSync(10))
    }
}
