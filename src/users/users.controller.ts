import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto, RegisterUserDto, UpdateUserDto, UserDto } from './dto/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './guards/auth.guard';
import { LoginResponse } from './interfaces/login-response';
import { User } from './entities/user.entity';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async create(@Body() body: UserDto) {
    return await this.usersService.createUser(body);
  }
  
  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.usersService.login(body);
  }

  @Post('register')
  async register( @Body() registerDto: RegisterUserDto ) {
    return await this.usersService.register( registerDto );
  }

  @UseGuards(AuthGuard)
  @Get('all')
  async findAll(@Request() req: Request) {    
    return await this.usersService.findAllUsers();
  }


  @UseGuards( AuthGuard )
  @Get('check-token')
  checkToken( @Request() req: Request ): LoginResponse {
    const user = req['user'] as User;

    return {
      user,
      token: this.usersService.getJwtToken({ id: user.id })
    }
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usersService.findOneUser(id);
  }

  @Patch('edit/:id')
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: UpdateUserDto) {
    return await this.usersService.updateUser(id, body);
  }

  @Delete('delete/:id')
  async remove(@Param('id', new ParseUUIDPipe()) id: number) {
    return await this.usersService.removeUser(id);
  }
}
