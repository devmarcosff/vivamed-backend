import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { DataSource, Repository } from 'typeorm';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { ReceiptDto } from './dto/receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { Receipt } from './entities/receipt.entity';

@Injectable()
export class ReceiptService {
    constructor(
        @InjectRepository(Receipt)
        private readonly receiptRepository: Repository<Receipt>,
        private readonly dataSource: DataSource,
    ) { }

    async create(dto: CreateReceiptDto): Promise<ReceiptDto> {
        return this.dataSource.transaction(async (manager) => {
            const receiptRepository = manager.getRepository(Receipt);

            const newReceipt = receiptRepository.create({
                ...dto,
                issueDateTime: new Date(dto.issueDateTime),
                nfeAuthDateTime: dto.nfeAuthDateTime ? new Date(dto.nfeAuthDateTime) : null,
            });

            const receipt = await receiptRepository.save(newReceipt);
            return plainToClass(ReceiptDto, receipt);
        });
    }

    async findOne(id: string): Promise<ReceiptDto> {
        const receipt = await this.receiptRepository.findOne({ where: { id } });

        if (!receipt) {
            throw new NotFoundException('Receipt not found');
        }

        return plainToClass(ReceiptDto, receipt);
    }

    async update(id: string, dto: UpdateReceiptDto): Promise<ReceiptDto> {
        return this.dataSource.transaction(async (manager) => {
            const receiptRepository = manager.getRepository(Receipt);

            const receipt = await receiptRepository.findOne({ where: { id }, lock: { mode: 'pessimistic_write' } });

            if (!receipt) {
                throw new NotFoundException('Receipt not found');
            }

            Object.assign(receipt, {
                ...dto,
                issueDateTime: dto.issueDateTime ? new Date(dto.issueDateTime) : receipt.issueDateTime,
                nfeAuthDateTime: dto.nfeAuthDateTime ? new Date(dto.nfeAuthDateTime) : receipt.nfeAuthDateTime,
            });

            await receiptRepository.save(receipt);
            return plainToClass(ReceiptDto, receipt);
        });
    }

    async remove(id: string): Promise<void> {
        const receipt = await this.receiptRepository.findOne({ where: { id } });

        if (!receipt) {
            throw new NotFoundException('Receipt not found');
        }

        await this.receiptRepository.remove(receipt);
    }
}
