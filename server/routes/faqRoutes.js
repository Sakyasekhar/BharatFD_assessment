const express = require("express");
const controller = require("../controllers/faqControllers")

const router = express.Router();

//routes
router.post("/faq/add",controller.add_faq);
router.delete("/faq/delete/:id",controller.delete_faq);
router.put("/faq/update/:id",controller.update_faq);
router.get("/faqs",controller.view_all_translated_Faqs);


module.exports = router;