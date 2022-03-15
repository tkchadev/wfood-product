const productServies = require("../services/productCus.service");
const moment = require("moment");
const fs = require("fs");

const getFindCustomerInProCus = async (req, res) => {

  const obj = {
    cus_uuid: req.params.uuid,
  };
  const result = await productServies.findCustomerInProCus(obj);
  if (result.status) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
};

const getProductCustomerById = async (req, res) => {
  const result = await productServies.selectProductCustomerByID(req.params.id);
  if (result.status) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
};

const postProductCustomer = async (req, res) => {
  const objToken = {
    accesstoken: req.headers["authorization"],
  };
  const objCus = {
    cus_uuid: req.body.cus_uuid,
  };
  const result = await productServies.createProductCustomer(objToken, objCus);
  if (result.status) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
};

const putProductCustomer = async (req, res) => {
  const obj = {
    list_unit: req.body.list_unit
  };
  const result = await productServies.updateProductCustomer(obj);
  if (result.status) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
};

module.exports = {
  getFindCustomerInProCus,
  postProductCustomer,
  getProductCustomerById,
  putProductCustomer
};
