import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterUser1737703477565 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'users',
            new TableColumn({
                name: 'token',
                type: 'text', // Change 'string' to 'text'
                isNullable: true, // Make it nullable if you don't want it to be mandatory
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // If you want to roll back this migration, you can remove the token column
        await queryRunner.dropColumn('users', 'token');
    }
}
