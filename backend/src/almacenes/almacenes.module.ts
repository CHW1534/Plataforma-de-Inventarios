import { Module } from '@nestjs/common';
import { AlmacenesService } from './almacenes.service';
import { AlmacenesController } from './almacenes.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AlmacenesController],
  providers: [AlmacenesService, PrismaService],
})
export class AlmacenesModule {}
