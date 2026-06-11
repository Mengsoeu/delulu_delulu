import { Body, Controller, Delete, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { signUpDto } from './dto/sign-up.dto';
import { loginDto } from './dto/login-dto';
import { AuthGuard } from 'src/guard/auth/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiResponse({ status: 200, description: 'Sign up successfully' })
  async signup(@Body() signUpDto: signUpDto) {
    await this.authService.signUp(signUpDto);
    return {
      code: 'signup.success',
    };
  }

  @Post('/login')
  @ApiResponse({ status: 200, description: 'Login successfully' })
  async login(@Body() loginDto: loginDto) {
    const data = await this.authService.login(loginDto);
    return {
      code: 'login.success',
      data
    }
  }

  @Get('/profile')
  @ApiBearerAuth()
  @ApiSecurity('api-key')
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: 'Get profile successfully' })
  async getProfile(@Req() req) {
    const data = req.user;
    return {
      code: 'get_profile.success',
      data: {
        id: data.user.id,
        username: data.user.username
      }
    };
  }

  @Delete('/logout')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: 'Logou successfully' })
  async logout(@Req() req) {
    await this.authService.logout(req.user.tokenId);
    return {
      code: 'logout.success',
    }
  }
}
