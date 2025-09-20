import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entities';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entities';
import { Wish } from '../wishes/entities/wish.entities';
import { CreateOfferDto } from './dto/create-offer-dto';
@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: number): Promise<Offer> {
    const { itemId, amount } = createOfferDto;

    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    const wish = await this.wishRepository.findOneBy({ id: itemId });

    if (!wish) throw new NotFoundException('Not found this gift');

    if (wish.owner.id === userId)
      throw new BadRequestException(
        'Нельзя внести денежные средства на собственное пожелание',
      );

    const updatedSumm = Number(wish.raised) + amount;
    if (updatedSumm > wish.price) {
      throw new BadRequestException('Cумма превышает необходимую');
    }

    wish.raised = updatedSumm;
    await this.wishRepository.save(wish);

    return this.offerRepository.save({ ...createOfferDto, user, item: wish });
  }

  async getAllOffers(): Promise<Offer[]> {
    return this.offerRepository.find({
      relations: {
        user: true,
        item: true,
      },
    });
  }

  async findOne(id: number): Promise<Offer> {
    return this.offerRepository.findOneBy({ id });
  }
}
