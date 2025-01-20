
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { UserRole } from "./Users";

@Entity()
export class LoginUser {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ nullable: true })
    email: string;

    @Column({ type: 'bigint' })  // Change here
    password: number;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CLIENT,  // Default role if not set
      })
      role: UserRole;
    
    
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
