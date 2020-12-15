interface KeysInterface {
  database: string;
  excel: string;
}
const convertKeys: KeysInterface[] = [
  { database: "sep", excel: "SEP" },
  { database: "dischargeDate", excel: "DISCHARGE_DATE" },
  { database: "diaglist", excel: "DIAGLIST" },
  { database: "deskripsiInacbg", excel: "DESKRIPSI_INACBG" },
  { database: "namaPasien", excel: "NAMA_PASIEN" },
  { database: "dpjp", excel: "DPJP" },
  { database: "nokartu", excel: "NOKARTU" },
  { database: "tarifIna", excel: "TOTAL_TARIF" },
  { database: "tarifRs", excel: "TARIF_RS" },
  { database: "prosedurNonBedah", excel: "PROSEDUR_NON_BEDAH" },
  { database: "prosedurBedah", excel: "PROSEDUR_BEDAH" },
  { database: "konsultasi", excel: "KONSULTASI" },
  { database: "tenagaAhli", excel: "TENAGA_AHLI" },
  { database: "keperawatan", excel: "KEPERAWATAN" },
  { database: "penunjang", excel: "PENUNJANG" },
  { database: "radiologi", excel: "RADIOLOGI" },
  { database: "laboratorium", excel: "LABORATORIUM" },
  { database: "pelayananDarah", excel: "PELAYANAN_DARAH" },
  { database: "rehabilitasi", excel: "REHABILITASI" },
  { database: "kamarAkomodasi", excel: "KAMAR_AKOMODASI" },
  { database: "rawatIntensif", excel: "RAWAT_INTENSIF" },
  { database: "obat", excel: "OBAT" },
  { database: "alkes", excel: "ALKES" },
  { database: "bmhp", excel: "BMHP" },
  { database: "sewaAlat", excel: "SEWA_ALAT" },
  { database: "obatKronis", excel: "OBAT_KRONIS" },
  { database: "obatKemo", excel: "OBAT_KEMO" },
];

const convertExcelKey = (keys: any): string[] => {
  return keys.map((item: string) => {
    const include = convertKeys.find((key) => key.excel === item);
    if (include) {
      return include.database;
    }
    return item;
  });
};
interface RajalData {
  sep: string;
  dischargeDate: string;
  diaglist: string;
  deskripsiInacbg: string;
  namaPasien: string;
  dpjp: string;
  nokartu: string;
  tarifIna: number;
  tarifRs: number;
  prosedurNonBedah: number;
  prosedurBedah: number;
  konsultasi: number;
  tenagaAhli: number;
  keperawatan: number;
  penunjang: number;
  radiologi: number;
  laboratorium: number;
  pelayananDarah: number;
  rehabilitasi: number;
  kamarAkomodasi: number;
  rawatIntensif: number;
  obat: number;
  alkes: number;
  bmhp: number;
  sewaAlat: number;
  obatKronis: number;
  obatKemo: number;
}
export { convertExcelKey, KeysInterface, RajalData };
