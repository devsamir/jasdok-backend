import { NextFunction, Request, Response } from "express";
import { getManager } from "typeorm";
import catchAsync from "../utils/catchAsync";
import Dokter from "../entities/dokter";
import { validate } from "class-validator";
import AppError from "../utils/appError";

const getAllDokter = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const manager = getManager();
    const dokter = await manager
      .createQueryBuilder(Dokter, "d")
      .select("distinct(d.dokterLocal)")
      .getRawMany();
    const finalDokter = dokter.map((item, index) => ({ ...item, id: index }));

    res.status(200).json(finalDokter);
  }
);
const createDokter = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { dokterLocal, dokterIna: dokterInaArr } = req.body;
    const manager = getManager();
    const newDokter = dokterInaArr.map(async (dokterIna: string) => {
      const dokter = manager.create(Dokter, { dokterLocal, dokterIna });
      const errors = await validate(dokter);
      if (errors.length > 0) return errors;
      return manager.save(dokter);
    });
    res.status(201).json(newDokter);
  }
);
const getOneDokter = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { dokterLocal } = req.params;
    const manager = getManager();
    const dokter = await manager.find(Dokter, { where: { dokterLocal } });
    if (dokter.length < 1)
      return next(new AppError("Data Dokter Tidak Ditemukan !", 400));
    const finalDokter = {
      dokterLocal,
      dokterIna: dokter.map((item) => item.dokterIna),
    };
    res.status(200).json(finalDokter);
  }
);
const updateDokter = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { dokterLocal: id } = req.params;
    const { dokterLocal, dokterIna: dokterInaArr } = req.body;
    const manager = getManager();
    await manager.delete(Dokter, { dokterLocal: id });
    const updatedDokter = dokterInaArr.map(async (dokterIna: string) => {
      const dokter = manager.create(Dokter, { dokterLocal, dokterIna });
      const errors = await validate(dokter);
      if (errors.length > 0) return errors;
      return manager.save(dokter);
    });
    res.status(201).json(updatedDokter);
  }
);
const deleteDokter = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { dokterLocal } = req.params;
    const manager = getManager();
    await manager.delete(Dokter, { dokterLocal });
    res.status(204).json(null);
  }
);
export { getAllDokter, createDokter, getOneDokter, updateDokter, deleteDokter };
