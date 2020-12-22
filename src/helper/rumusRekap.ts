import { getManager } from "typeorm";
import Rajal from "../entities/rajal";
import Sri from "../entities/sri";

const special = [
  "prosedurNonBedah",
  "prosedurBedah",
  "konsultasi",
  "tenagaAhli",
];
const hitungRekapSri = (rajal: any, sri: any) => {
  const jasaPelayanan = special.reduce((total, item) => {
    const jasa = Math.round((rajal[item] * 70) / 100);
    total += jasa;
    return total;
  }, 0);
  const persentasePelayanan =
    Math.round((jasaPelayanan / rajal.tarifRs) * 10000) / 10000;
  const jasaIna = Math.round(persentasePelayanan * rajal.tarifIna);
  const rajalPure = special.reduce((acc, curr) => {
    const jasa = Math.round(((rajal[curr] - sri[curr]) * 70) / 100);
    acc += jasa;
    return acc;
  }, 0);
  const sriPure = special.reduce((acc, curr) => {
    const jasaSri = Math.round((sri[curr] * 70) / 100);
    acc += jasaSri;
    return acc;
  }, 0);
  const rajalPersen =
    Math.round((rajalPure / (rajal.tarifRs - sri.tarifRs)) * 10000) / 10000;
  const sriPersen = Math.round((sriPure / sri.tarifRs) * 10000) / 10000;
  const totalPersen = rajalPersen + sriPersen;
  const jasaRajalFinal = Math.round((rajalPersen / totalPersen) * jasaIna);
  const jasaSriFinal = Math.round((sriPersen / totalPersen) * jasaIna);
  return {
    [rajal.dpjp]: {
      totalRs: rajal.tarifRs - sri.tarifRs,
      totalIna: rajal.tarifIna,
      jasaRs: rajalPure,
      jasaIna: jasaRajalFinal,
    },
    [sri.dpjp]: {
      totalRs: sri.tarifRs,
      totalIna: rajal.tarifIna,
      jasaRs: sriPure,
      jasaIna: jasaSriFinal,
    },
  };
};

const hitungRekapNonSri = (acc: any, curr: any) => {
  if (curr.tarifRs) {
    const totalPelayanan = special.reduce((total, item) => {
      const jasa = Math.round((curr[item] * 70) / 100);
      total += jasa;
      return total;
    }, 0);
    const persentase = totalPelayanan / curr.tarifRs;
    const totalIna = Math.round(persentase * curr.tarifIna);
    acc.totalRs += curr.tarifRs;
    acc.totalIna += curr.tarifIna;
    acc.jasaRs += totalPelayanan;
    acc.jasaIna += totalIna;
  }
  return acc;
};

const hitungDetailNonSri = (data: Rajal[]) => {
  return data.map((rajal: any) => {
    const totalPelayanan = special.reduce((acc: number, curr: any) => {
      const jasa = Math.round((rajal[curr] * 70) / 100);
      acc += jasa;
      return acc;
    }, 0);
    const persen = Math.round((totalPelayanan / rajal.tarifRs) * 10000) / 10000;
    const totalIna = persen * rajal.tarifIna;
    return {
      dpjp: rajal.dpjp,
      dischargeDate: rajal.dischargeDate,
      totalRs: rajal.tarifRs,
      totalIna: rajal.tarifIna,
      jasaRs: totalPelayanan,
      jasaIna: totalIna,
    };
  });
};

export { hitungRekapSri, hitungRekapNonSri, hitungDetailNonSri };
