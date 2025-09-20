import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Wishlist } from './entities/wishlists.entities';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entities';
import { User } from '../users/entities/user.entities';
import { CreateWishlistDto } from './dto/create-wishlist-dto';
import { UpdateWishlistDto } from './dto/update-wishlist-dto';
@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    const { itemsId, ...wishlistData } = createWishlistDto;
    const items = itemsId.map((item): Wish | { id: number } => ({
      id: item,
    }));

    const user = await this.userRepository.findOneBy({ id: userId });
    const wishes = await this.wishRepository.find({
      where: items,
    });

    const wishList = this.wishlistRepository.create({
      ...wishlistData,
      owner: user,
      items: wishes,
    });

    return this.wishlistRepository.save(wishList);
  }

  async getAllWishlists(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      relations: {
        items: true,
        owner: true,
      },
    });
  }

  async getWishListById(id: number): Promise<Wishlist> {
    const wishList = await this.wishlistRepository.findOne({
      relations: {
        items: true,
        owner: true,
      },
      where: {
        id,
      },
    });

    if (!wishList) throw new NotFoundException('Wishlist not found');
    return wishList;
  }

  async remove(id: number, userId: number): Promise<void> {
    const wishList = await this.wishlistRepository.findOne({
      relations: {
        owner: true,
      },
      where: {
        id,
        owner: {
          id: userId,
        },
      },
    });

    if (!wishList) throw new NotFoundException('Wishlist not found');

    await this.wishlistRepository.remove(wishList);
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    const { itemsId, ...updateData } = updateWishlistDto;
    const wishList = await this.wishlistRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
    });
    if (!wishList) throw new NotFoundException('Wishlist not found');
    if (wishList.owner.id !== userId) {
      throw new BadRequestException(
        'You cannot modify someone else collection.',
      );
    }

    if (itemsId) {
      const wishes = await this.wishRepository.findBy({
        id: In(itemsId),
      });

      if (wishes.length !== itemsId.length)
        throw new BadRequestException('Some wishes not found');

      wishList.items = wishes;
    }

    Object.assign(wishList, updateData);
    return this.wishlistRepository.save(wishList);
  }
}
