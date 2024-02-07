import { Controller, Get, Post, Body,Request, UseGuards } from '@nestjs/common';
import { LoginDto, RegisterUserDto } from './dto/create-auth.dto';

import { Auth } from './decorators/auth.decorator';
import { AuthGuard } from './guards/auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginResponse } from './interfaces/login-response';
import { ROLES } from '../constants/opcions';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Post('register')
  async register( @Body() registerDto: RegisterUserDto ) {
    return await this.authService.register( registerDto );
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

  // @Get('private')
  // @Roles(ROLES.USER)
  // @UseGuards( AuthGuard, RolesGuard )
  // testing( 
  //   @GetUser() user: User
  // ){
  //   return {
  //     ok: true,
  //     message: 'Hola mUndo Private',
  //     user,
  //   }
  // }

  @Get('private')
  @Auth(ROLES.USUARIO)
  testing( 
    @GetUser() user: User
  ){
    return {
      ok: true,
      message: 'Hola mUndo Private',
      user,
    }
  }
  

  
}
