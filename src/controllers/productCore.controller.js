const productServies = require("../services/productCore.service");
const moment = require("moment");
const fs = require("fs");
const multer = require("multer");
const multerConfig = require("../helper/multer");
const upload = multer(multerConfig.configMulter).fields([
  {
    name: "procore_photo",
    maxCount: 1,
  },
]);

// Start Unit Product

const postUnitProduct = async (req, res) => {
  const obj = {
    unit_name: req.body.unit_name,
  };
  const result = await productServies.createUnitProduct(obj);
  if (result.status) {
    res.status(200).json(result);
  } else {
    res.status(400).json({});
  }
};

const putUnitProduct = async (req, res) => {
  const obj = {
    id: req.body.unit_id,
    unit_name: req.body.unit_name,
    updated_at: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
  };
  const result = await productServies.updateUnitProduct(obj);
  if (result.status) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
};

const delUnitProduct = async (req, res) => {
  const obj = {
    id: req.params.id,
    updated_at: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
  };
  const result = await productServies.deleteUnitProduct(obj);
  if (result.status) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
};

const getAllUnitProduct = async (req, res) => {
  const page = req.query.page;
  const result = await productServies.selectAllUnitProduct(page);
  if (result.status) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
};

const getInfoUnitProductByID = async (req, res) => {
  const obj = {
    id: req.params.id,
  };
  const result = await productServies.selectUnitProductByID(obj);
  if (result.status) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
};

// End Unit Product

// Start Product Core

const getUnitProductForProCore = async (req, res) => {
  const result = await productServies.selectAllUnitProductForProCore();
  if (result.status) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
};

const postProductCore = async (req, res) => {
  upload(req, res, async (error) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    const objCore = {
      procore_id: req.body.procore_id,
      procore_name: req.body.procore_name,
      procore_detail: req.body.procore_detail,
      procore_photo: req.files.procore_photo
        ? req.files.procore_photo[0].path
        : null,
    };
    const objToken = {
      accesstoken: req.headers["authorization"],
    };

    const objPrice = {
      list_price: req.body.list_price,
    };

    const result = await productServies.createProductCore(
      objToken,
      objCore,
      objPrice
    );
    if (!result.status) {
      if (req.files.procore_photo) {
        const path = req.files.procore_photo[0].path;
        fs.unlinkSync(path);
      }
      res.status(400).json(result);
      return;
    }

    if (result.status) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  });
};

const getAllProductCore = async (req, res) => {
  const page = req.query.page;
  const result = await productServies.selectAllProductCore(page);
  if (result.status) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
};

const getInfoProductCoreByID = async (req, res) => {
  let obj = {
    id: req.params.id,
  };
  const result = await productServies.selectProductCoreInfoByID(obj);
  if (result.status) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
};

const putProductCore = async (req, res) => {
  upload(req, res, async (error) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    const objCore = {
      id: req.body.id,
      procore_name: req.body.procore_name,
      procore_detail: req.body.procore_detail,
      procore_photo: req.files.procore_photo
        ? req.files.procore_photo[0].path
        : null,
      updated_at: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    };

    const objToken = {
      accesstoken: req.headers["authorization"],
    };

    const objPrice = {
      list_price: req.body.list_price,
    };

    const result = await productServies.updateProductCore(
      objToken,
      objCore,
      objPrice
    );
    if (!result.status) {
      if (req.files.procore_photo) {
        const path = req.files.procore_photo[0].path;
        fs.unlinkSync(path);
      }
      res.status(400).json(result);
      return;
    }

    if (result.status) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  });
};

const delProductCore = async (req, res) => {
  const obj = {
    id: req.params.id,
    updated_at: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
  };
  const result = await productServies.deleteProductCore(obj)
  if (result.status) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
};

// End Product Core

module.exports = {
  postUnitProduct,
  putUnitProduct,
  delUnitProduct,
  getAllUnitProduct,
  getInfoUnitProductByID,
  getUnitProductForProCore,
  postProductCore,
  getAllProductCore,
  getInfoProductCoreByID,
  putProductCore,
  delProductCore
};
