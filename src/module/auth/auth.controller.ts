import { Body, Controller, Delete, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { signUpDto } from './dto/sign-up.dto';
import { loginDto } from './dto/login-dto';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Public()
  @Post('/signup')
  @ApiResponse({ status: 200, description: 'Sign up successfully' })
  async signup(@Body() signUpDto: signUpDto) {
    await this.authService.signUp(signUpDto);
    return {
      code: 'signup.success',
    };
  }

  @Public()
  @Post('/login')
  @ApiResponse({ status: 200, description: 'Login successfully' })
  async login(@Body() loginDto: loginDto) {
    const data = await this.authService.login(loginDto);
    return {
      code: 'login.success',
      data
    }
  }

  @ApiBearerAuth()
  @Get('/profile')
  @ApiResponse({ status: 200, description: 'Get profile successfully' })
  async getProfile(@Req() req) {
    const data = req.user;
    return {
      code: 'get_profile.success',
      data: {
        id: data.user.id,
        username: data.user.username,
        role: data.role,
        permission: data.permission
      }
    };
  }

  @ApiBearerAuth()
  @Delete('/logout')
  @ApiResponse({ status: 200, description: 'Logou successfully' })
  async logout(@Req() req) {
    await this.authService.logout(req.user.tokenId);
    return {
      code: 'logout.success',
    }
  }
}
