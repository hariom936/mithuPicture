import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Login1717083855052 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
    await queryRunner.createTable(
      new Table({
        name: 'login_user',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',

          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'password',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",

          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
