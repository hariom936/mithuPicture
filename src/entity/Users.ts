import { IsDate } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"


// Define role types
export enum UserRole {
  ADMIN = "admin",
  CLIENT = "client",
}

@Entity()
export class Users {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ nullable: true })
    first_name: string;

    @Column({ nullable: true })
    last_name: string;

    @Column({ nullable: true })
    email: string;

    @Column({ type: 'bigint' })  // Change here
    phone: number;
   

    @Column({ type: 'bigint' })  // Change here
    password: number;

    @Column({
      type: 'enum',
      enum: UserRole, // Use the enum values defined above
      default: UserRole.CLIENT, // Set default value to 'client'
    })
    role: UserRole; // Column is of type UserRole

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  static id: any;
}
