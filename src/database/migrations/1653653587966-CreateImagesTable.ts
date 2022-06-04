import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateImagesTable1653653587966 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name:"images",
                columns:[
                    {
                        name:"id",
                        type:"varchar",
                        isPrimary:true,
                        isGenerated:true,
                        generationStrategy:"uuid"
                    },
                    {
                        name:"characterId",
                        type:"varchar"
                    },
                    {
                        name:"url",
                        type:"varchar"
                    }
                ],
                foreignKeys:[
                    {
                        name:"FKCharacter",
                        columnNames:["characterId"],
                        referencedColumnNames:["id"],
                        referencedTableName:"characters",
                        onDelete:"CASCADE",
                        onUpdate:"CASCADE"
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("characters", "characterId")
        await queryRunner.dropTable("images");
    }
}
