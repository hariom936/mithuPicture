import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterLoginUser1737220187837 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
          'login_user',
          new TableColumn({
            name: 'role',
            type: 'enum',
            enum: ['admin', 'client'],
            default: "'client'",  // Default value can be 'client' if applicable
          })
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('login_user', 'role');
      }

}
