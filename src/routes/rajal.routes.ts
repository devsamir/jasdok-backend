import { Router } from "express";
import {
  importDataRajal,
  uploadExcelRajal,
  deleteRajal,
  kalibrasiDokter,
  importDataSri,
  uploadExcelSri,
  rekapRajal,
  detailRajal,
} from "../controllers/rajal.controller";
const router = Router();

router.get("/", rekapRajal);

router.get("/:id", detailRajal);

router.delete("/", deleteRajal);
router.post("/import", uploadExcelRajal, importDataRajal);
router.post("/import/sri", uploadExcelSri, importDataSri);

router.post("/kalibrasi", kalibrasiDokter);

export default router;
