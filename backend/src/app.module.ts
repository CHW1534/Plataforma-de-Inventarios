import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductosModule } from './productos/productos.module';
import { AlmacenesModule } from './almacenes/almacenes.module';
import { MovimientosModule } from './movimientos/movimientos.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api*'],
    }),
    ProductosModule, 
    AlmacenesModule, 
    MovimientosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
