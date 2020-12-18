const normal = [
  "keperawatan",
  "penunjang",
  "radiologi",
  "laboratorium",
  "pelayananDarah",
  "rehabilitasi",
  "kamarAkomodasi",
  "rawatIntensif",
  "obat",
  "alkes",
  "bmhp",
  "sewaAlat",
  "obatKronis",
  "obatKemo",
];
const special = [
  "prosedurNonBedah",
  "prosedurBedah",
  "konsultasi",
  "tenagaAhli",
];
const hitungSri = (rajal: any, sri: any) => {
  const tarifNormal = normal.reduce((acc: any, curr: string) => {
    const tarif_rs = rajal[curr] - sri[curr];
    acc[curr] = {
      rajal: {
        tarif_rs,
        persen: Math.round((tarif_rs / rajal.tarifRs) * 10000) / 100,
        tarif_ina: Math.round((rajal.tarifIna * rajal[curr]) / rajal.tarifRs),
      },
      sri: {
        tarif_rs: sri[curr],
        persen: Math.round((sri[curr] / rajal.tarifRs) * 10000) / 100,
        tarif_ina: Math.round((rajal.tarifIna * sri[curr]) / sri.tarifRs),
      },
    };
    return acc;
  }, {});
  const tarifSpecial = special.reduce((acc: any, curr: string) => {
    const tarif_rs = rajal[curr] - sri[curr];
    const tarif_sarana = Math.round((tarif_rs * 30) / 100);
    const tarif_pelayanan = Math.round((tarif_rs * 70) / 100);
    const sri_sarana = Math.round((sri[curr] * 30) / 100);
    const sri_pelayanan = Math.round((sri[curr] * 70) / 100);
    acc[curr] = {
      rajal: {
        sarana: {
          tarif_rs: tarif_sarana,
          persen: Math.round((tarif_sarana / rajal.tarifRs) * 10000) / 100,
          tarif_ina: Math.round(
            (rajal.tarifIna * tarif_sarana) / rajal.tarifRs
          ),
        },
        pelayanan: {
          tarif_rs: tarif_pelayanan,
          persen: Math.round((tarif_pelayanan / rajal.tarifRs) * 10000) / 100,
          tarif_ina: Math.round(
            (rajal.tarifIna * tarif_pelayanan) / rajal.tarifRs
          ),
        },
      },
      sri: {
        sarana: {
          tarif_rs: sri_sarana,
          persen: Math.round((sri_sarana / rajal.tarifRs) * 10000) / 100,
          tarif_ina: Math.round((rajal.tarifIna * sri_sarana) / rajal.tarifRs),
        },
        pelayanan: {
          tarif_rs: sri_pelayanan,
          persen: Math.round((sri_pelayanan / rajal.tarifRs) * 10000) / 100,
          tarif_ina: Math.round(
            (rajal.tarifIna * sri_pelayanan) / rajal.tarifRs
          ),
        },
      },
    };
    return acc;
  }, {});
  return { tarifSpecial, tarifNormal, rajal, sri };
};

const hitungNonSri = (rajal: any) => {
  const tarifNormal = normal.reduce((acc: any, curr: string) => {
    acc[curr] = {
      tarif_rs: rajal[curr],
      persen: Math.round((rajal[curr] / rajal.tarifRs) * 10000) / 100,
      tarif_ina: Math.round((rajal.tarifIna * rajal[curr]) / rajal.tarifRs),
    };
    return acc;
  }, {});
  const tarifSpecial = special.reduce((acc: any, curr: string) => {
    const tarif_sarana = Math.round((rajal[curr] * 30) / 100);
    const tarif_pelayanan = Math.round((rajal[curr] * 70) / 100);
    acc[curr] = {
      sarana: {
        tarif_rs: tarif_sarana,
        persen: Math.round((tarif_sarana / rajal.tarifRs) * 10000) / 100,
        tarif_ina: Math.round((rajal.tarifIna * tarif_sarana) / rajal.tarifRs),
      },
      pelayanan: {
        tarif_rs: tarif_pelayanan,
        persen: Math.round((tarif_pelayanan / rajal.tarifRs) * 10000) / 100,
        tarif_ina: Math.round(
          (rajal.tarifIna * tarif_pelayanan) / rajal.tarifRs
        ),
      },
    };
    return acc;
  }, {});
  return { tarifSpecial, tarifNormal, rajal };
};

export { hitungSri, hitungNonSri };
