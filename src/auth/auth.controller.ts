import { Controller, Get, Post, Body,Request, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/create-auth.dto';

import { AuthGuard } from './guards/auth.guard';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginResponse } from './interfaces/login-response';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Autenticacion')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @UseGuards(AuthGuard)
  @Get('check-token')
  checkToken( @Request() req: Request ): LoginResponse {
    const user = req['user'] as User;
    return {
      token: this.authService.getJwtToken({ id: user.id }),
      user,
    }
  }
  
}
