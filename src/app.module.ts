import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { OffersModule } from './offers/offers.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entities';
import { Offer } from './offers/entities/offer.entities';
import { Wish } from './wishes/entities/wish.entities';
import { Wishlist } from './wishlists/entities/wishlists.entities';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Wish, Wishlist, Offer],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Делает ConfigService доступным по всему приложению без необходимости импорта в каждый модуль
    }),
    UsersModule,
    OffersModule,
    WishesModule,
    WishlistsModule,
    AuthModule,
  ],
=======
import { AppController } from './app.controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [],
>>>>>>> origin/main
})
export class AppModule {}
