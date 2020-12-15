import { Router } from "express";
import {
  importDataRajal,
  uploadExcelRajal,
  deleteRajal,
} from "../controllers/rajal.controller";
const router = Router();

router.delete("/", deleteRajal);
router.post("/import", uploadExcelRajal, importDataRajal);

export default router;
