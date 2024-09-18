import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Prefeitura Municipal de Bom Jesus do Itabapoana - Rio de Janeiro';
  }
}
