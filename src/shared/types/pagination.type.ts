import { ApiProperty } from "@nestjs/swagger";

export abstract class IPagination<T> {
    @ApiProperty({ description: 'List of items' })
    items: T[];

    @ApiProperty({
        description: 'Pagination info',
        type: () => ({
            total: { type: 'number', description: 'Total number of items' },
            page: { type: 'number', description: 'Current page' },
            limit: { type: 'number', description: 'Items per page' },
            totalPages: { type: 'number', description: 'Total number of pages' },
        }),
    })
    info: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}