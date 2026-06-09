import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    async signup(signUpDto: SignUpDto) {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(signUpDto.password, salt);

        const payload = {
            username: signUpDto.username,
            password: password
        }

        const data = await this.prismaService.user.create({
            data: payload
        })

        return data;
    }

    async validateUser(username, password) {
        // check user exist
        const user = await this.prismaService.user.findFirst({
            where: {
                username: username
            }
        })
        if (!user) {
            throw new UnauthorizedException("User is invalid or not found.");
        }
        
        // check password 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException("username or password is incorrect.");
        }

        const { password: _, ...result } = user;
        
        return result;
    }


    async login(user: any) {
        const payload = {
            sub: user.id,
            username: user.username
        }

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: 'nest',
            expiresIn: '15m',
        })

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: 'nest2',
            expiresIn: '7d',
        })

        const hashRefreshToken = await bcrypt.hash(refreshToken, 10);

        await this.prismaService.user.update({
            where: {
                id: user.id
            },
            data: {
                refreshToken: hashRefreshToken
            }
        })

        return {
            accessToken,
            refreshToken,
        }
    }

    async refreshToken(token: string) {
        const payload = await this.jwtService.verifyAsync(token, {
            secret: 'nest2'
        })

        const user = await this.prismaService.user.findUnique({
            where: { id: payload.sub }
        })
        if (!user || !user.refreshToken) {
            throw new UnauthorizedException();
        }

        const valid = await bcrypt.compare(
            token,
            user.refreshToken
        )
        if (!valid) {
            throw new UnauthorizedException();
        } 

        const accessToken = await this.jwtService.signAsync(
            { 
                sub: user.id, 
                username: user.username
            }, {
                secret: 'nest',
                expiresIn: '15m',
            },
        );

        return {
            accessToken
        }
    }

    async logout(userId: number) {
        await this.prismaService.user.update({
            where: { id: userId },
            data: { 
                refreshToken: null
            }
        })
    }
}
