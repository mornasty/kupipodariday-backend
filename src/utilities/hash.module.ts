import { Module } from '@nestjs/common';
import { HashGenerator } from './hash.service';

@Module({
  providers: [HashGenerator],
  exports: [HashGenerator],
})
export class HashModule {}
