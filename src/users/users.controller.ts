import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entities';
import { UpdateUserDto } from './dto/update-user-dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('me')
  async getUser(@Req() req): Promise<User> {
    return this.usersService.findOne(req.user.id);
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.getUserByUsername(username);
  }

  @Get(':username/wishes')
  async getWishesByUsername(@Param('username') username: string) {
    return this.usersService.getWishesByUsername(username);
  }

  @Get('me/wishes')
  async getWishes(@Req() req) {
    return this.usersService.getWishes(req.user.id);
  }

  @Post('find')
  async findMany(@Body('query') query: string): Promise<User[]> {
    return this.usersService.findMany(query);
  }

  @Patch('me')
  async updateUserProfile(
    @Req() req,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(req.user.id, body);
  }
}
