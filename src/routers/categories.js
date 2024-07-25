const express = require("express");
const { authAdmin } = require("../middlewares/auth");
const { categoryCtrl } = require("../controllers/categoryCtrl");
const router = express.Router();

router.get("/", categoryCtrl.getCategorylist);
router.post("/", authAdmin, categoryCtrl.addCategory);
router.put("/:idEdit", authAdmin, categoryCtrl.editCategory);
router.delete("/:idDel", authAdmin, categoryCtrl.deleteCategory);
router.get("/count", categoryCtrl.count);
router.get("/search", authAdmin, categoryCtrl.search);

module.exports = router;
