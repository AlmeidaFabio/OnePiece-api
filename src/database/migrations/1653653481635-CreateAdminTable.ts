import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateAdminTable1653653481635 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "admins",
                columns:[
                    {
                        name:"id",
                        type:"varchar",
                        isPrimary:true,
                        isGenerated:true,
                        generationStrategy:"uuid"
                    },
                    {
                        name:"email",
                        type:"varchar"
                    },
                    {
                        name:"password",
                        type:"varchar"
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('admins')
    }

}
