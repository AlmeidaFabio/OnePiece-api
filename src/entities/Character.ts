import { Column, Entity, OneToOne, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid'
import { Image } from "./Image";

@Entity('characters')
export class Character {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    denomination: string;

    @Column({ default: "Civil" })
    category: string;

    @Column({ nullable: true })
    devilFruit: string;

    @Column()
    description: string;

    @OneToOne(() => Image, image => image.character)
    image:Image;

    constructor() {
        if(!this.id) {
            this.id = uuid()
        }
    }
}