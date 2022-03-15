const router = require("express").Router();
const productCoreController = require("../controllers/productCore.controller");
const productCusController = require("../controllers/productCus.controller");
const jwt = require("../helper/jwt");

// router.post("/create", jwt.verifyToken, riderController.postRiderUser);

// Unit Product
router.post("/unit/create", jwt.verifyToken, productCoreController.postUnitProduct);
router.put("/unit/update", jwt.verifyToken, productCoreController.putUnitProduct);
router.delete("/unit/delete/:id", jwt.verifyToken, productCoreController.delUnitProduct);
router.delete("/unit/delete/:id", jwt.verifyToken, productCoreController.delUnitProduct);
router.get("/unit/list", jwt.verifyToken, productCoreController.getAllUnitProduct);
router.get("/unit/info/:id", jwt.verifyToken, productCoreController.getInfoUnitProductByID);

// Product Core
router.get("/procore/unit", jwt.verifyToken, productCoreController.getUnitProductForProCore);
router.post("/procore/create", jwt.verifyToken, productCoreController.postProductCore);
router.put("/procore/update", jwt.verifyToken, productCoreController.putProductCore);
router.delete("/procore/delete/:id", jwt.verifyToken, productCoreController.delProductCore);
router.get("/procore/list", jwt.verifyToken, productCoreController.getAllProductCore);
router.get("/procore/info/:id", jwt.verifyToken, productCoreController.getInfoProductCoreByID);

// Product Customer
router.get("/procus/find/:uuid", jwt.verifyToken, productCusController.getFindCustomerInProCus);
router.get("/procus/info/:id", jwt.verifyToken, productCusController.getProductCustomerById);
router.post("/procus/create", jwt.verifyToken, productCusController.postProductCustomer);
router.put("/procus/update", jwt.verifyToken, productCusController.putProductCustomer);

module.exports = router;
