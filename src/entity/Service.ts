import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Services {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  description: string;

  @Column()
  internPriceRange: string;

  @Column()
  entryLevelPriceRange: string;

  @Column()
  intermediatePriceRange: string;

  @Column()
  advancedPriceRange: string;
}
