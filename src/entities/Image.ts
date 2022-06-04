import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid'
import { Character } from "./Character";

@Entity("images")
export class Image {
    @PrimaryColumn()
    id:string;

    @Column()
    characterId:string;

    @OneToOne(() => Character, character => character.image)
    @JoinColumn({name:"characterId"})
    character:Character;

    @Column()
    url:string;

    constructor () {
        if(!this.id) {
            this.id = uuid()
        }
    }
}