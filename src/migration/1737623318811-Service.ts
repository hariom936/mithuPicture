import { MigrationInterface, QueryRunner,Table } from "typeorm";

export class Service1737623318811 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: 'services', // Table name
            columns: [
              {
                name: 'id',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment', // Auto-increment the ID
              },
              {
                name: 'type',
                type: 'varchar',
              },
              {
                name: 'description',
                type: 'varchar',
              },
              {
                name: 'internPriceRange',
                type: 'varchar',
              },
              {
                name: 'entryLevelPriceRange',
                type: 'varchar',
              },
              {
                name: 'intermediatePriceRange',
                type: 'varchar',
              },
              {
                name: 'advancedPriceRange',
                type: 'varchar',
              },
              {
                name: 'createdAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP', // Automatically set to the current timestamp when a record is created
              },
              {
                name: 'updatedAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP', // Automatically set to the current timestamp when a record is created
                onUpdate: 'CURRENT_TIMESTAMP', // Automatically update the timestamp when the record is updated
              },
            ],
          })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
