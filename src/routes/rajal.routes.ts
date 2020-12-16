import { Router } from "express";
import {
  importDataRajal,
  uploadExcelRajal,
  deleteRajal,
  kalibrasiDokter,
} from "../controllers/rajal.controller";
const router = Router();

router.delete("/", deleteRajal);
router.post("/import", uploadExcelRajal, importDataRajal);

router.post("/kalibrasi", kalibrasiDokter);

export default router;
