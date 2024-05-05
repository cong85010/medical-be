const { Router } = require("express");
const router = Router();

const statisticController = require("../controllers/statistic/statistic.controller");

router.post("/", statisticController.getStatistic);
module.exports = router;
