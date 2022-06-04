import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from 'uuid'

@Entity('admins')
export class Admin {
    @PrimaryColumn()
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    constructor() {
        if(!this.id) {
            this.id = uuid()
        }
    }
}