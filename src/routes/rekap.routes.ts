import { Router } from "express";
import { getRekapDokter } from "../controllers/rekap.controller";

const router = Router();

router.post("/dokter", getRekapDokter);

export default router;
