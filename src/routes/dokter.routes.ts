import { Router } from "express";
import {
  createDokter,
  deleteDokter,
  getAllDokter,
  getOneDokter,
  updateDokter,
} from "../controllers/dokter.controller";

const router = Router();

router.route("/").get(getAllDokter).post(createDokter);
router
  .route("/:dokterLocal")
  .get(getOneDokter)
  .put(updateDokter)
  .delete(deleteDokter);

export default router;
