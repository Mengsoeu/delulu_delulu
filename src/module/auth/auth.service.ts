import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { signUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { promises } from 'dns';
import { loginDto } from './dto/login-dto';
import { generateRandomString } from 'src/common/util/func.util';

@Injectable()
export class AuthService {
    constructor (private readonly prismaService: PrismaService) {}

    async signUp(dto: signUpDto): Promise<void> {
        const hashPassword = await bcrypt.hash(dto.password, 10);
        const payload = {
            username: dto.username,
            password: hashPassword
        }
        await this.prismaService.user.create({
            data: payload
        })
    }

    async login(dto: loginDto) {
        const user = await this.prismaService.user.findUnique({
            where: {
                username: dto.username
            }
        })
        if (!user) {
            throw new UnauthorizedException();
        }

        // verify password
        const isValid = await bcrypt.compare(dto.password, user.password);
        if (!isValid) {
            throw new UnauthorizedException();
        }
        
        // create session
        const token = generateRandomString();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        const session = await this.prismaService.session.create({
            data: {
                token,
                device: 'window10',
                ip: '127.0.0.1',
                userAgent: 'Chrome',
                expiresAt,
                userId: user.id
            }
        })

        return {
            token: session.token
        }
    }

    async logout(tokenId: number): Promise<void> {
        await this.prismaService.session.delete({
            where: {
                id: tokenId
            }
        })
    }
}
