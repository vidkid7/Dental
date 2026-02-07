import { DataSource } from 'typeorm';
export declare class AppController {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    getRoot(): {
        name: string;
        version: string;
        status: string;
        docs: string;
        api: string;
    };
    getHealth(): Promise<{
        status: string;
        database: string;
        timestamp: string;
    }>;
    private checkDatabase;
}
