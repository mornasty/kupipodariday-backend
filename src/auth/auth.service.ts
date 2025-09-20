import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { HashGenerator } from '../utilities/hash.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashGenerator: HashGenerator,
    private readonly jwtService: JwtService,
  ) {}

  auth(user: User) {
    const payload = { subject: user.id };
    return { access_token: this.jwtService.sign(payload, { expiresIn: '7d' }) };
  }

  async validatePassword(
    username: string,
    password: string,
  ): Promise<User | null> {
    const userWithHash = await this.usersService.getUserByUsername(
      username,
      true,
    );
    if (!userWithHash) return null;

    const isMatch = await this.hashGenerator.compare(
      password,
      userWithHash.password,
    );
    if (!isMatch) return null;

    return this.usersService.getUserByUsername(username);
  }
}
