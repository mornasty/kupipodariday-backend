import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entities';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { Wish } from '../wishes/entities/wish.entities';
import { plainToInstance } from 'class-transformer';
import { HashGenerator } from '../utilities/hash.service';
import { UpdateUserDto } from './dto/update-user-dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private hashGenerator: HashGenerator,
  ) {}
  async create(dto: CreateUserDto): Promise<User> {
    const hash = await this.hashGenerator.getHash(dto.password);

    try {
      const newUser = await this.userRepository.save({
        ...dto,
        password: hash,
      });

      return plainToInstance(User, newUser);
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Username or email already exist');
      }
    }
  }

  async getUserByUsername(
    username: string,
    withPassword = false,
  ): Promise<User> {
    const options = withPassword
      ? {
          where: { username },
          select: {
            id: true,
            username: true,
            email: true,
            about: true,
            avatar: true,
            password: true,
          },
        }
      : { where: { username } };

    const user = await this.userRepository.findOne(options);

    return withPassword ? user : plainToInstance(User, user);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    return plainToInstance(User, user);
  }

  async findMany(queryStr: string): Promise<User[]> {
    const users = await this.userRepository.find({
      where: [
        { username: Like(`%${queryStr}%`) },
        { email: Like(`%${queryStr}%`) },
      ],
    });
    return users.map((user) => plainToInstance(User, user));
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    if (dto.password) {
      dto.password = await this.hashGenerator.getHash(dto.password);
    }

    const { affected } = await this.userRepository.update(id, dto);
    if (affected === 0) throw new NotFoundException('User not found');

    const updated = await this.userRepository.findOne({ where: { id } });
    return plainToInstance(User, updated);
  }

  async getWishes(id: number): Promise<Wish[]> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['wishes'],
    });
    return user?.wishes || [];
  }

  async getWishesByUsername(username: string): Promise<Wish[]> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['wishes'],
    });
    return user?.wishes || [];
  }
}
