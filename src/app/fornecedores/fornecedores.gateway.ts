import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { FornecedoresService } from './fornecedores.service';
import { CreateFornecedoreDto } from './dto/create-fornecedore.dto';
import { UpdateFornecedoreDto } from './dto/update-fornecedore.dto';

@WebSocketGateway()
export class FornecedoresGateway {
  constructor(private readonly fornecedoresService: FornecedoresService) {}

  @SubscribeMessage('createFornecedore')
  create(@MessageBody() createFornecedoreDto: CreateFornecedoreDto) {
    return this.fornecedoresService.create(createFornecedoreDto);
  }

  @SubscribeMessage('findAllFornecedores')
  findAll() {
    return this.fornecedoresService.findAll();
  }

  @SubscribeMessage('findOneFornecedore')
  findOne(@MessageBody() id: number) {
    return this.fornecedoresService.findOne(id);
  }

  @SubscribeMessage('updateFornecedore')
  update(@MessageBody() updateFornecedoreDto: UpdateFornecedoreDto) {
    return this.fornecedoresService.update(updateFornecedoreDto.id, updateFornecedoreDto);
  }

  @SubscribeMessage('removeFornecedore')
  remove(@MessageBody() id: number) {
    return this.fornecedoresService.remove(id);
  }
}
