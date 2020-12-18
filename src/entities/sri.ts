import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class Sri {
  @PrimaryColumn()
  sep: string;
  @Column()
  dpjp: string;
  @Column({ type: "double" })
  tarifRs: number;
  @Column({ type: "double" })
  prosedurNonBedah: number;
  @Column({ type: "double" })
  prosedurBedah: number;
  @Column({ type: "double" })
  konsultasi: number;
  @Column({ type: "double" })
  tenagaAhli: number;
  @Column({ type: "double" })
  keperawatan: number;
  @Column({ type: "double" })
  penunjang: number;
  @Column({ type: "double" })
  radiologi: number;
  @Column({ type: "double" })
  laboratorium: number;
  @Column({ type: "double" })
  pelayananDarah: number;
  @Column({ type: "double" })
  rehabilitasi: number;
  @Column({ type: "double" })
  kamarAkomodasi: number;
  @Column({ type: "double" })
  rawatIntensif: number;
  @Column({ type: "double" })
  obat: number;
  @Column({ type: "double" })
  alkes: number;
  @Column({ type: "double" })
  bmhp: number;
  @Column({ type: "double" })
  sewaAlat: number;
  @Column({ type: "double" })
  obatKronis: number;
  @Column({ type: "double" })
  obatKemo: number;
}
