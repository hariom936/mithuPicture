import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class tokenSession {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column()
    token: string;

    @Column({ nullable: true, type: 'int' })
    userId: number;

    @Column({ nullable: false, type: 'timestamp' })
    expiredAt: Date;


    @Column()
    userType: string;

    @Column()
    status: boolean;

    @Column({ nullable: false, type: 'timestamp' })
    createdAt: Date;

    @Column({ nullable: false, type: 'timestamp' })
    updatedAt: Date;
}

