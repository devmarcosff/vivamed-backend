import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPagination } from 'src/shared/types/pagination.type';
import { DataSource, ILike, In, Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { CitizenDto } from './dto/citizen.dto';
import { CitizenFilterDto } from './dto/filter-citizen.dto';
import { Citizen } from './entities/citizen.entity';
import { IImportResult } from './interfaces/citizen.interface';

@Injectable()
export class CitizenService {
    constructor(
        @InjectRepository(Citizen)
        private citizenRepository: Repository<Citizen>,
        private dataSource: DataSource,
    ) { }

    async findAll(filter: CitizenFilterDto): Promise<IPagination<CitizenDto>> {
        const where: any = {};
        const page = filter.page || 1;
        const limit = filter.limit || 10;
        const skip = (page - 1) * limit;

        if (filter.fullName) {
            where.fullName = ILike(`%${filter.fullName}%`);
        }

        if (filter.cpf) {
            where.cpf = filter.cpf;
        }

        if (filter.cns) {
            where.cns = filter.cns;
        }

        if (filter.birthDate) {
            where.birthDate = filter.birthDate;
        }

        if (filter.gender) {
            where.gender = ILike(`%${filter.gender}%`);
        }

        if (filter.age) {
            where.age = filter.age;
        }

        if (filter.weighting) {
            where.weighting = filter.weighting;
        }

        if (filter.identificationType) {
            where.identificationType = ILike(`%${filter.identificationType}%`);
        }

        if (filter.lastContactDate) {
            where.lastContactDate = filter.lastContactDate;
        }

        if (filter.totalServices) {
            where.totalServices = filter.totalServices;
        }

        if (filter.city) {
            where.city = ILike(`%${filter.city}%`);
        }

        if (filter.district) {
            where.district = ILike(`%${filter.district}%`);
        }

        where.enabled = true;

        const [items, total] = await this.citizenRepository.findAndCount({
            where,
            take: limit,
            skip,
            order: {
                fullName: 'ASC',
            },
        });

        const citizenDtos = items.map((citizen) => citizen.toDto());

        return {
            items: citizenDtos,
            info: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    parseDate = (dateStr: string): Date | null => {
        if (!dateStr) return null;
        const [day, month, year] = dateStr.split('/');
        if (!day || !month || !year) return null;

        const formattedDate = `${year}-${month}-${day}`;
        const date = new Date(formattedDate);
        return isNaN(date.getTime()) ? null : date;
    };

    async importFromXlsx(
        city: string,
        district: string,
        file: Express.Multer.File,
        userId: string,
        updateDuplicates: boolean,
    ): Promise<IImportResult> {
        return await this.dataSource.transaction(async (manager) => {
            const citizenRepository = manager.getRepository(Citizen);

            try {
                const workbook = XLSX.read(file.buffer, { type: 'buffer' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null, blankrows: false });

                const dataStartIndex = rows.findIndex(row => row[0] === 'Nome' && row[2] === 'CNS');
                if (dataStartIndex === -1) {
                    throw new BadRequestException('Coluna "Nome" ou "CNS" não encontrada');
                }

                const dataRows = rows.slice(dataStartIndex + 1).filter(row => row[0] && row[2]);
                const importCns = dataRows.map(row => row[2]);

                const citizensDb = await citizenRepository.find({
                    where: { cns: In(importCns), city, district },
                    select: ['id', 'cns'],
                });

                const cnsCitizensDb = citizensDb.map(c => c.cns);

                const newCitizens: Citizen[] = [];
                const duplicatedCns: Citizen[] = [];

                for (const row of dataRows) {
                    const cns = String(row[2]);
                    const name = row[0];
                    if (!name || !cns) continue;

                    const birthDate = this.parseDate(row[3]);
                    const lastContactDate = this.parseDate(row[8]);

                    const citizenData = {
                        fullName: name,
                        cpf: row[1] || null,
                        cns,
                        birthDate,
                        gender: row[4] || '',
                        age: row[5] ? Number(row[5]) : null,
                        weighting: row[6] || '',
                        identificationType: row[7] || '',
                        lastContactDate,
                        totalServices: row[9] ? Number(row[9]) : 0,
                        city,
                        district,
                        enabled: true,
                        createdAt: new Date(),
                        createdBy: userId,
                        updatedAt: new Date(),
                        updatedBy: userId,
                    } as Citizen;

                    if (cnsCitizensDb.some(s => s == cns)) {
                        duplicatedCns.push(citizenData);
                    } else {
                        newCitizens.push(citizenData);
                        cnsCitizensDb.push(cns);
                    }
                }

                let savedCitizens: Citizen[] = [];
                if (newCitizens.length > 0) {
                    savedCitizens = await citizenRepository.save(newCitizens);
                }

                //atualizar os duplicados
                if (updateDuplicates && duplicatedCns.length > 0) {
                    for (const d of duplicatedCns) {
                        const citzenDb = citizensDb.find(f => f.cns === d.cns);
                        if (citzenDb) {
                            await citizenRepository.update(citzenDb.id, d);
                        }
                    }
                }

                return {
                    message: 'Importação concluída',
                    totalImported: savedCitizens.length,
                    totalDuplicated: duplicatedCns.length,
                    duplicatedCitizens: duplicatedCns.map(m => m.cns),
                };
            } catch (error) {
                throw new BadRequestException(
                    error.message || 'Erro ao importar cidadãos. Verifique o arquivo e tente novamente.'
                );
            }
        });
    }


}