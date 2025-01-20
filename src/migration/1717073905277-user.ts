import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUser1634342094502 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users', // Table name
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment', // Auto-increment the ID
          },
          {
            name: 'first_name',
            type: 'varchar',
            isNullable: true, // Nullable field
          },
          {
            name: 'last_name',
            type: 'varchar',
            isNullable: true, // Nullable field
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: true, // Nullable field
          },
          {
            name: 'phone',
            type: 'bigint', // Define as bigint
          },
          {
            name: 'password',
            type: 'bigint', // Define as bigint
          },
          {
            name: 'role',
            type: 'enum',
            enum: ['admin', 'client'], // Enum type with values 'admin' and 'client'
            default: `'client'`, // Set default value to 'client'
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
    await queryRunner.dropTable('users');
  }
}
