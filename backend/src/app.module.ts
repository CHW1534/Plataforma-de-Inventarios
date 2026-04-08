import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductosModule } from './productos/productos.module';
import { AlmacenesModule } from './almacenes/almacenes.module';
import { MovimientosModule } from './movimientos/movimientos.module';

@Module({
  imports: [ProductosModule, AlmacenesModule, MovimientosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
