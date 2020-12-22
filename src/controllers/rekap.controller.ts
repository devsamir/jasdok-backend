import { NextFunction, Request, Response } from "express";
import { getManager } from "typeorm";
import catchAsync from "../utils/catchAsync";
import Rajal from "../entities/rajal";
import Sri from "../entities/sri";

import {
  hitungRekapNonSri,
  hitungRekapSri,
  hitungDetailNonSri,
} from "../helper/rumusRekap";

const getRekapDokter = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { tanggalAwal, tanggalAkhir } = req.body;
    const manager = getManager();
    const rajal = await manager
      .createQueryBuilder(Rajal, "r")
      .select("*")
      .where("r.dischargeDate between :tanggalAwal and :tanggalAkhir", {
        tanggalAwal,
        tanggalAkhir,
      })
      .getRawMany();
    const sri = await manager
      .createQueryBuilder(Sri, "s")
      .select("*")
      .where(
        "sep in (select sep from rajal where dischargeDate between :tanggalAwal and :tanggalAkhir)",
        {
          tanggalAwal,
          tanggalAkhir,
        }
      )
      .getRawMany();
    const dokter = rajal.reduce((acc, curr) => {
      if (acc[curr.dpjp]) {
        acc[curr.dpjp] = [...acc[curr.dpjp], curr];
      } else {
        acc[curr.dpjp] = [curr];
      }
      return acc;
    }, {});
    const rekapNonSri = Object.keys(dokter).map((key) => {
      return dokter[key].reduce(
        (acc: any, curr: Rajal) => {
          if (!acc.dpjp) acc.dpjp = curr.dpjp;
          const cekSri = sri.find((s) => s.sep === curr.sep);
          if (!cekSri) {
            acc = hitungRekapNonSri(acc, curr);
          }
          return acc;
        },
        { dpjp: "", totalRs: 0, totalIna: 0, jasaRs: 0, jasaIna: 0 }
      );
    });
    sri.forEach(async (item) => {
      const tarifRajal = rajal.find((r) => r.sep === item.sep);

      if (tarifRajal) {
        const tarifSri = hitungRekapSri(tarifRajal, item);
        Object.keys(tarifSri).forEach((x: any) => {
          rekapNonSri.forEach((data) => {
            if (data.dpjp === x) {
              data.totalRs += tarifSri[x].totalRs;
              data.totalIna += tarifSri[x].totalIna;
              data.jasaRs += tarifSri[x].jasaRs;
              data.jasaIna += tarifSri[x].jasaIna;
            }
          });
        });
      }
    });
    const finalData = rekapNonSri.map((item, index) => {
      const selisih = item.jasaIna - item.jasaRs;
      return { ...item, id: index, selisih };
    });
    res.status(200).json(finalData);
  }
);
const getRekapOneDokter = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { dpjp, tanggalAwal, tanggalAkhir } = req.body;
    const manager = getManager();
    const initialRajal = await manager
      .createQueryBuilder(Rajal, "r")
      .select("*")
      .where(
        "r.dpjp = :dpjp and r.dischargeDate between :tanggalAwal and :tanggalAkhir and r.sep not in (select sep from sri)",
        { dpjp, tanggalAwal, tanggalAkhir }
      )
      .getRawMany();
    const initialSri = await manager
      .createQueryBuilder(Rajal, "r")
      .select("*")
      .where(
        "r.dpjp = :dpjp and r.dischargeDate between :tanggalAwal and :tanggalAkhir and r.sep in (select sep from sri)",
        { dpjp, tanggalAwal, tanggalAkhir }
      )
      .getRawMany();
    const rajalNonSri = hitungDetailNonSri(initialRajal);
  }
);
export { getRekapDokter };
