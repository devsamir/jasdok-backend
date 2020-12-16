import { IsDefined } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique("dokter", ["dokterLocal", "dokterIna"])
export default class Dokter {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  @IsDefined()
  dokterLocal: string;
  @Column()
  @IsDefined()
  dokterIna: string;
}
