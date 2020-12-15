import { NextFunction, Request, Response } from "express";
import { getManager } from "typeorm";
import multer, { DiskStorageOptions, FileFilterCallback } from "multer";
import Excel from "exceljs";
import { v4 } from "uuid";
import { format, parse } from "date-fns";
import catchAsync from "../utils/catchAsync";
import { convertExcelKey } from "../helper/rajal.helper";
import Rajal from "../entities/rajal";

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
export { uploadExcelRajal, importDataRajal, deleteRajal };
