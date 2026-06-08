import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { ApiBody, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/singup')
  @ApiResponse({ status: 201, description: 'Signup user successfully' })
  async signup(@Body() signUpDto: SignUpDto) {
    const data = await this.authService.signup(signUpDto);
    return {
      code: 'Signup user success',
      data
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({
    type: SignUpDto
  })
  @ApiResponse({ status: 201, description: 'Login user successfully' })
  async login(@Request() req) {
    const data = await this.authService.login(req.user);
    return {
      code: 'Login user success',
      data
    }
  }

}
