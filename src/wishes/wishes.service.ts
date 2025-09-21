import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Wish } from './entities/wish.entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish-dto';
import { User } from '../users/entities/user.entities';
import { UpdateWishDto } from './dto/update-wish-dto';
@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createWishDto: CreateWishDto, userId: number): Promise<Wish> {
    const user = await this.userRepository.findOneBy({ id: userId });
    return this.wishRepository.save({
      ...createWishDto,
      owner: user,
    });
  }

  async getPopularWishes(): Promise<Wish[]> {
    return this.wishRepository.find({
      take: 20,
      order: { copied: 'DESC' },
    });
  }

  async getLastWishes(): Promise<Wish[]> {
    return this.wishRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Wish> {
    const wish = this.wishRepository.findOne({
      relations: {
        offers: {
          user: true,
        },
        owner: true,
      },
      where: {
        id,
      },
    });
    if (!wish) throw new NotFoundException('Not found this gift');
    return wish;
  }

  async update(
    id: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      relations: {
        offers: true,
      },
      where: {
        id,
        owner: {
          id: userId,
        },
      },
    });

    if (!wish) throw new NotFoundException('Not found this gift');

    if (wish.offers.length > 0)
      throw new BadRequestException(
        'It is not possible to change a gift with deposited funds',
      );

    await this.wishRepository.update(id, updateWishDto);
    return this.findOne(id);
  }

  async remove(id: number, userId: number): Promise<void> {
    const wish = await this.wishRepository.findOne({
      relations: {
        offers: true,
      },
      where: {
        id,
        owner: {
          id: userId,
        },
      },
    });

    if (!wish) throw new NotFoundException('Not found this gift');

    try {
      await this.wishRepository.remove(wish);
    } catch (err) {
      throw new BadRequestException(
        'It is not possible to delete a gift with deposited funds',
      );
    }
  }

  async copy(id: number, userId: number): Promise<Wish> {
    const wish = await this.wishRepository.findOneBy({ id });
    if (!wish) throw new NotFoundException('Not found this gift');

    const user = await this.userRepository.findOneBy({ id: userId });

    const newWish = this.wishRepository.create({
      ...wish,
      copied: 0,
      raised: 0,
      owner: user,
    });

    wish.copied += 1;
    await this.wishRepository.save(wish);
    await this.wishRepository.insert(newWish);

    return newWish;
  }
}
