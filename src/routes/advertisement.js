const express = require("express");
const router = express.Router();
const adController = require("../controllers/adController")

router.get("/advertisement", adController.index);
router.get("/advertisement/new", adController.new);
router.post("/advertisement/create", adController.create);

module.exports = router;
