import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPagination } from 'src/shared/types/pagination.type';
import { DataSource, ILike, Repository } from 'typeorm';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { VendorFilterDto } from './dto/filter-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorDto } from './dto/vendor.dto';
import { Vendor } from './entities/vendor.entity';

@Injectable()
export class VendorService {
    constructor(
        @InjectRepository(Vendor)
        private vendorRepository: Repository<Vendor>,
        private dataSource: DataSource,
    ) { }

    async create(dto: CreateVendorDto): Promise<VendorDto> {
        return this.dataSource.transaction(async (manager) => {
            const vendorRepository = manager.getRepository(Vendor);

            const existingVendor = await vendorRepository.findOneBy({ cnpj: dto.cnpj });

            if (existingVendor) {
                throw new BadRequestException('Vendor already exists.');
            }

            const newVendor = vendorRepository.create({
                businessName: dto.businessName,
                tradeName: dto.tradeName,
                cnpj: dto.cnpj,
                phone: dto.phone,
                email: dto.email,
                stateRegistration: dto.stateRegistration,
                municipalRegistration: dto.municipalRegistration,
            });

            const savedVendor = await vendorRepository.save(newVendor);

            return savedVendor.toDto();
        });
    }

    async findAll(filter: VendorFilterDto): Promise<IPagination<VendorDto>> {
        const where: any = {};
        const page = filter.page || 1;
        const limit = filter.limit || 10;
        const skip = (page - 1) * limit;

        if (filter.businessName) {
            where.businessName = ILike(`%${filter.businessName}%`);
        }

        if (filter.tradeName) {
            where.tradeName = ILike(`%${filter.tradeName}%`);
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

        const [items, total] = await this.vendorRepository.findAndCount({
            where,
            take: limit,
            skip: skip,
            order: {
                businessName: 'ASC',
            },
        });

        const vendorDtos = items.map((vendor) => vendor.toDto());

        return {
            items: vendorDtos,
            info: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string): Promise<VendorDto> {
        const vendor = await this.vendorRepository.findOneBy({ id });
        if (!vendor) {
            throw new NotFoundException(`Vendor not found.`);
        }
        return vendor.toDto();
    }

    async update(id: string, dto: UpdateVendorDto): Promise<VendorDto> {
        return this.dataSource.transaction(async (manager) => {
            const vendorRepository = manager.getRepository(Vendor);

            const vendorDb = await vendorRepository.findOne({
                where: { id },
            });

            if (!vendorDb) {
                throw new BadRequestException('Vendor not found.');
            }

            Object.assign(vendorDb, dto);

            await vendorRepository.update(id, vendorDb);

            return vendorDb.toDto();
        });
    }

    async remove(id: string): Promise<void> {
        const vendorDb = await this.vendorRepository.findOneBy({ id });
        vendorDb.enabled = false;
        await this.vendorRepository.update(id, vendorDb);
    }
}
