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
        // create jwt token
        return {
            access_token: this.jwtService.sign({
                sub: user.id,
                username: user.username
            })
        }
    }
}
