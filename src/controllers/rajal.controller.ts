import { NextFunction, Request, Response } from "express";
import { getManager } from "typeorm";
import multer, { DiskStorageOptions, FileFilterCallback } from "multer";
import Excel from "exceljs";
import { v4 } from "uuid";
import { format, parse } from "date-fns";
import catchAsync from "../utils/catchAsync";
import { convertExcelKey } from "../helper/rajal.helper";
import Rajal from "../entities/rajal";
import Dokter from "../entities/dokter";
import Sri from "../entities/sri";
import AppError from "../utils/appError";
import { hitungNonSri, hitungSri } from "../helper/rumusRajal";

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".")[1];
    if (ext === "xlsx" || ext === "xls") {
      cb(null, `rajal-${new Date().getTime()}-${v4()}.${ext}`);
    }
  },
} as DiskStorageOptions);

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const ext = file.originalname.split(".")[1];
  if (ext.startsWith("xls")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const uploadExcelRajal = upload.single("rajal");
const uploadExcelSri = upload.single("sri");
const importDataRajal = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { path } = req.file;
    const manager = getManager();
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(path);
    let data: any = [];
    let keys: string[] = [];
    workbook.worksheets[0].eachRow((row: any, index) => {
      if (index === 1) {
        keys = convertExcelKey(row.values);
      }
      if (index !== 1) {
        const newRajal = manager.create(
          Rajal,
          keys.reduce((acc: any, curr: any, index: any) => {
            acc[curr] = row.values[index];
            return acc;
          }, {} as any)
        );
        data.push(newRajal);
      }
    });
    for (const item of data) {
      item.dischargeDate = format(
        parse(item.dischargeDate, "dd/MM/yyyy", new Date()),
        "yyyy-MM-dd"
      );

      await manager.save(item);
    }

    res.status(200).json(data);
  }
);
const deleteRajal = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { tanggalAwal, tanggalAkhir } = req.body;
    const manager = getManager();
    await manager
      .createQueryBuilder()
      .delete()
      .from(Rajal)
      .where("dischargeDate between :tanggalAwal and :tanggalAkhir", {
        tanggalAwal,
        tanggalAkhir,
      })
      .execute();
    res.status(204).json(null);
  }
);

const kalibrasiDokter = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { tanggalAwal, tanggalAkhir } = req.body;
    const manager = getManager();
    const dokter = await manager
      .createQueryBuilder(Dokter, "d")
      .select("distinct(d.dokterLocal)")
      .getRawMany();
    for (const item of dokter) {
      manager
        .createQueryBuilder()
        .update(Rajal)
        .set({ dpjp: item.dokterLocal })
        .where(
          "dpjp in (select dokterIna from dokter where dokterLocal=:dokterLocal) and dischargeDate between :tanggalAwal and :tanggalAkhir",
          { dokterLocal: item.dokterLocal, tanggalAwal, tanggalAkhir }
        )
        .execute();
      manager
        .createQueryBuilder()
        .update(Sri)
        .set({ dpjp: item.dokterLocal })
        .where(
          "dpjp in (select dokterIna from dokter where dokterLocal=:dokterLocal)",
          { dokterLocal: item.dokterLocal }
        )
        .execute();
    }
    res.status(200).json("Berhasil Kalibrasi Dokter");
  }
);
const importDataSri = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { path } = req.file;
    const manager = getManager();
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(path);
    let data: any = [];
    let keys: string[] = [];
    workbook.worksheets[0].eachRow((row: any, index) => {
      if (index === 1) {
        keys = row.values;
      }
      if (index !== 1) {
        const newSri = manager.create(
          Sri,
          keys.reduce((acc: any, curr: any, index: any) => {
            acc[curr] = row.values[index];
            return acc;
          }, {} as any)
        );
        data.push(newSri);
      }
    });
    for (const item of data) {
      await manager.save(item);
    }

    res.status(200).json(data);
  }
);
const rekapRajal = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { page, limit, sort, search } = req.query;
    const manager = getManager();
    console.log(sort);

    let query = "1";
    let queryCount = "1";
    if (search) {
      const searchFields = [
        "r.sep",
        "r.dischargeDate",
        "r.namaPasien",
        "r.dpjp",
      ];
      query += ` and (${searchFields
        .map((item) => `${item} like '%${search}%'`)
        .join(" or ")})`;
      queryCount += ` and (${searchFields
        .map((item) => `${item} like '%${search}%'`)
        .join(" or ")})`;
    }
    if (sort) {
      query += ` order by ${`${sort}`.split("_")[0]} ${
        `${sort}`.split("_")[1]
      } `;
    }
    if (page && limit) {
      query += ` limit ${limit} offset ${(Number(page) - 1) * Number(limit)}`;
    }
    const reqRajal = manager
      .createQueryBuilder(Rajal, "r")
      .select("sep,dischargeDate,namaPasien,dpjp,tarifIna,tarifRs")
      .where(query)
      .getRawMany();
    const reqCount = manager
      .createQueryBuilder(Rajal, "r")
      .where(queryCount)
      .getCount();
    let [rajal, count] = await Promise.all([reqRajal, reqCount]);
    rajal.forEach((item) => {
      item.dischargeDate = format(new Date(item.dischargeDate), "yyyy-MM-dd");
      item.id = item.sep;
    });
    res.status(200).json({
      result: count,
      data: rajal,
    });
  }
);
const detailRajal = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const manager = getManager();
    const rajal = await manager.findOne(Rajal, { where: { sep: id } });
    if (!rajal) return next(new AppError("SEP Tidak Ditemukan !", 400));
    const sri = await manager.findOne(Sri, { where: { sep: id } });
    let data: any;
    if (sri) {
      data = hitungSri(rajal, sri);
    } else {
      data = hitungNonSri(rajal);
    }
    res.status(200).json(data);
  }
);
export {
  uploadExcelRajal,
  importDataRajal,
  deleteRajal,
  kalibrasiDokter,
  importDataSri,
  uploadExcelSri,
  rekapRajal,
  detailRajal,
};
