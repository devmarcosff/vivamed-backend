import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPagination } from 'src/shared/types/pagination.type';
import { DataSource, ILike, Repository } from 'typeorm';
import { CreateFirmDto } from './dto/create-firm.dto';
import { FirmFilterDto } from './dto/filter-firm.dto';
import { FirmDto } from './dto/firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';
import { Firm } from './entities/firm.entity';

@Injectable()
export class FirmService {
    constructor(
        @InjectRepository(Firm)
        private firmRepository: Repository<Firm>,
        private dataSource: DataSource,
    ) { }

    async create(dto: CreateFirmDto): Promise<FirmDto> {
        return this.dataSource.transaction(async (manager) => {
            const firmRepository = manager.getRepository(Firm);

            const existingFirm = await firmRepository.findOneBy({ cnpj: dto.cnpj });

            if (existingFirm) {
                existingFirm.enabled = true;
                await this.firmRepository.update(existingFirm.id, existingFirm);
                throw new BadRequestException('Firm already exists.');
            }

            const newFirm = firmRepository.create({
                businessName: dto.businessName,
                fantasyName: dto.fantasyName,
                cnpj: dto.cnpj,
                phone: dto.phone,
                email: dto.email,
                stateRegistration: dto.stateRegistration,
                municipalRegistration: dto.municipalRegistration,
            });

            const savedFirm = await firmRepository.save(newFirm);

            return savedFirm.toDto();
        });
    }

    async findAll(filter: FirmFilterDto): Promise<IPagination<FirmDto>> {
        const where: any = {};
        const page = filter.page || 1;
        const limit = filter.limit || 10;
        const skip = (page - 1) * limit;

        if (filter.businessName) {
            where.businessName = ILike(`%${filter.businessName}%`);
        }

        if (filter.fantasyName) {
            where.fantasyName = ILike(`%${filter.fantasyName}%`);
        }

        if (filter.cnpj) {
            where.cnpj = ILike(`%${filter.cnpj}%`);
        }

        if (filter.phone) {
            where.phone = ILike(`%${filter.phone}%`);
        }

        if (filter.email) {
            where.email = ILike(`%${filter.email}%`);
        }

        if (filter.stateRegistration) {
            where.stateRegistration = ILike(`%${filter.stateRegistration}%`);
        }

        if (filter.municipalRegistration) {
            where.municipalRegistration = ILike(`%${filter.municipalRegistration}%`);
        }

        where.enabled = true;

        const [items, total] = await this.firmRepository.findAndCount({
            where,
            relations: {
                address: true
            },
            take: limit,
            skip: skip,
            order: {
                businessName: 'ASC',
            },
        });

        const firmDtos = items.map((firm) => firm.toDto());

        return {
            items: firmDtos,
            info: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string): Promise<FirmDto> {
        const firm = await this.firmRepository.findOne({
            where: {
                id,
                enabled: true
            },
            relations: {
                address: true
            },
        });
        if (!firm) {
            throw new NotFoundException(`Firm not found.`);
        }
        return firm.toDto();
    }

    async update(id: string, dto: UpdateFirmDto): Promise<FirmDto> {
        return this.dataSource.transaction(async (manager) => {
            const firmRepository = manager.getRepository(Firm);

            const firmDb = await firmRepository.findOne({
                where: { id, enabled: true },
            });

            if (!firmDb) {
                throw new BadRequestException('Firm not found.');
            }

            Object.assign(firmDb, dto);

            await firmRepository.update(id, firmDb);

            return firmDb.toDto();
        });
    }

    async remove(id: string): Promise<void> {
        const firmDb = await this.firmRepository.findOneBy({ id, enabled: true });
        firmDb.enabled = false;
        await this.firmRepository.update(id, firmDb);
    }
}
