import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import * as XLSX from 'xlsx';
import { Citizen } from './entities/citizen.entity';
import { IImportResult } from './interfaces/citizen.interface';

@Injectable()
export class CitizenService {
    constructor(
        private dataSource: DataSource,
    ) { }

    async importFromXlsx(city: string, district: string, file: Express.Multer.File, userId: string): Promise<IImportResult> {
        return await this.dataSource.transaction(async (manager) => {
            const citizenRepository = manager.getRepository(Citizen);
            try {
                const workbook = XLSX.read(file.buffer, { type: 'buffer' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null, blankrows: false });

                const dataStartIndex = rows.findIndex(row => row[0] === 'Nome' && row[1] === 'CPF');
                if (dataStartIndex === -1) {
                    throw new BadRequestException('Valor "Nome" ou "CPF" não encontrado');
                }

                const dataRows = rows.slice(dataStartIndex + 1).filter(row => row[0] && row[1]);

                const importCpfs = [...new Set(dataRows.map(row => row[1]).filter(Boolean))];

                const existingCitizens = await citizenRepository.find({
                    where: {
                        cpf: In(importCpfs),
                        city: city,
                        district: district
                    },
                    select: ['id', 'cpf']
                });

                const existingCpfs = new Set(existingCitizens.map(c => c.cpf));

                const newCitizens: Citizen[] = [];
                const duplicatedCitizens: Citizen[] = [];

                dataRows.forEach(row => {
                    const name = row[0];
                    const cpf = row[1];

                    if (!name) return;

                    const birthDate = row[3] ? new Date(row[3]) : null;
                    const lastContactDate = row[8] ? new Date(row[8]) : null;

                    const citizenData = {
                        fullName: row[0] || '',
                        cpf: cpf || null,
                        cns: row[2] || '',
                        birthDate: birthDate,
                        gender: row[4] || '',
                        age: row[5] ? Number(row[5]) : null,
                        weighting: row[6] || '',
                        identificationType: row[7] || '',
                        lastContactDate: lastContactDate,
                        totalServices: row[9] ? Number(row[9]) : 0,
                        city: city,
                        district: district,
                        enabled: true,
                        createdAt: new Date(),
                        createdBy: userId,
                        updatedAt: new Date(),
                        updatedBy: userId,
                    } as Citizen;

                    if (existingCpfs.has(cpf)) {
                        duplicatedCitizens.push(citizenData);
                    } else {
                        newCitizens.push(citizenData);
                        existingCpfs.add(cpf);
                    }
                });

                let savedCitizens: Citizen[] = [];
                if (newCitizens.length > 0) {
                    savedCitizens = await citizenRepository.save(newCitizens);
                }

                if (duplicatedCitizens.length > 0) {
                    duplicatedCitizens.forEach(async d => {
                        const citzenDb = existingCitizens.find(f => f.cpf == d.cpf);
                        await citizenRepository.update(citzenDb.id, d);
                    });
                }

                return {
                    message: 'Import completed',
                    totalImported: savedCitizens.length,
                    totalDuplicated: duplicatedCitizens.length,
                    duplicatedCitizens: []
                };

            } catch (error) {
                throw new BadRequestException(error.message || 'Erro ao importar cidadãos');
            }
        });
    }
}