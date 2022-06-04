import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateCharactersTable1653653519086 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name:"characters",
                columns:[
                    {
                        name:"id",
                        type:"varchar",
                        isPrimary:true,
                        isGenerated:true,
                        generationStrategy:"uuid"
                    },
                    {
                        name:"name",
                        type:"varchar"
                    },
                    {
                        name:"denomination",
                        type:"varchar",
                        isNullable:true
                    },
                    {
                        name:"category",
                        type:"varchar",
                        default: "Civil"
                    },
                    {
                        name:"description",
                        type:"text"
                    },
                    {
                        name:"devilFruit",
                        type:"varchar",
                        isNullable:true
                    },
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('characters')
    }
}
