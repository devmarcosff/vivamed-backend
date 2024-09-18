import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AddressModule } from './app/address/address.module';
import { AuthCidadaoModule } from './app/auth-cidadao/auth-cidadao.module';
import { AuthModule } from './app/auth/auth.module';
import { CidadaoModule } from './app/cidadao/cidadao.module';
import { ConsultaModule } from './app/consulta/consulta.module';
import { MedicamentosModule } from './app/medicamentos/medicamentos.module';
import { OrderItemsModule } from './app/order-items/order-items.module';
import { OrderModule } from './app/order/order.module';
import { ProductModule } from './app/product/product.module';
import { StockModule } from './app/stock/stock.module';
import { jwtConstants } from './app/user/jwtConstants';
import { UserModule } from './app/user/user.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '86400s' },
    }),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    AuthCidadaoModule,
    AddressModule,
    StockModule,
    ProductModule,
    OrderModule,
    OrderItemsModule,
    CidadaoModule,
    ConsultaModule,
    MedicamentosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
