import { Body, Controller, Get, Post, Request, UseGuards, Headers, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/guard/local-auth.guard';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMe(@Request() req) {
    return {
      code: 'get_me.success',
      data: req.user
    }
  }

  @Post('/refresh')
  async refresh(@Headers('x-refresh-token') refreshToken: string) {
    const data = await this.authService.refreshToken(refreshToken);
    return {
      code: 'renew.access_token',
      data
    }
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('/logout')
  async logout(@Request() req) {
    console.log(req.user)
    await this.authService.logout(req.user.userId);
    return {
      code: 'logout.success',
    }
  }


 
}
