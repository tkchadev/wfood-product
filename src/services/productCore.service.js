const productModel = require("../models/productCore.model");
const bcrypt = require("bcryptjs");
const jwt = require("../helper/jwt");
const moment = require("moment");

// Start Unit Product

const createUnitProduct = async (obj) => {
  return await productModel.createUnitProduct(obj);
};
const updateUnitProduct = async (obj) => {
  return await productModel.updateUnitProduct(obj);
};
const deleteUnitProduct = async (obj) => {
  return await productModel.deleteUnitProduct(obj);
};
const selectAllUnitProduct = async (page) => {
  const itemsPerPage = 12;
  if (!page) {
    return { status: false, message: `No Page` };
  }
  let count = await productModel.selectCountUnitProduct();
  let result = await productModel.selectAllUnitProduct(page);
  if (!result.status) {
    return result;
  }
  let pageCount = Math.ceil(parseFloat(count) / itemsPerPage);
  let data = {
    status: result.status,
    message: result.message,
    result: {
      page_count: pageCount,
      page_current: parseInt(page),
      data: result.result,
    },
  };
  return data;
};

const selectUnitProductByID = async (obj) => {
  let res = await productModel.selectUnitProductInfoByID(obj);
  return res;
};

// End Unit Product

// Start Product Core

const selectAllUnitProductForProCore = async () => {
  return await productModel.selectAllUnitProductForProCore();
};

const createProductCore = async (objToken, objCore, objPrice) => {
  const resFindProID = await productModel.findProductCoreID(objCore.procore_id);
  if (!resFindProID.status) {
    return resFindProID;
  }

  objToken.accesstoken =
    objToken.accesstoken && objToken.accesstoken.split(" ")[1];
  const resToken = await productModel.findTokenEmpChange(objToken);

  objCore["ref_emp"] = resToken.result.ref_emp;

  const resCore = await productModel.createProductCore(objCore);
  if (!resCore.status) {
    return resCore;
  }

  // Add Procus
  const resCus = await productModel.selectCusIDInProductCustomer();
  let arr = [];
  let itemsCus = resCus.result;
  if (itemsCus.length > 0) {
    for (let c = 0; c < itemsCus.length; c++) {
      let dataProCus = {
        ref_procore: resCore.result.id,
        ref_cus: itemsCus[c].ref_cus,
        ref_emp: resToken.result.ref_emp,
      };
      arr.push(dataProCus);
    }
    var resProCus = await productModel.createProCusFromProCore(arr);
    if (!resProCus.status) {
      return resProCus;
    }
  }

  let items = JSON.parse(objPrice.list_price)

  let arrUnitCore = [];
  for (let i = 0; i < items.length; i++) {
    let item = {
      procoreunit_name_text: resCore.result.procore_name,
      procoreunit_unit_text: items[i].unit_name,
      procoreunit_price: items[i].price,
      procoreunit_vat: items[i].vat,
      procoreunit_total: items[i].total,
      ref_procore: resCore.result.id,
      ref_unit: items[i].unit_id,
    };
    arrUnitCore.push(item);
  }

  const resList = await productModel.createUnitListProductCore(arrUnitCore);
  if (!resList.status) {
    return resList;
  }

  // Add Procus Unit
  let arrUnitCus = [];
  if (itemsCus.length > 0) {

    let itemsProCus = resProCus.result;
    let itemsUnitCore = resList.result;

    for (let a = 0; a < itemsProCus.length; a++) {
      for (let c = 0; c < itemsCus.length; c++) {
        for (let u = 0; u < itemsUnitCore.length; u++) {
          let dataUnitCus = {
            procusunit_unit_text: itemsUnitCore[u].procoreunit_unit_text,
            procusunit_price: itemsUnitCore[u].procoreunit_price,
            procusunit_vat: itemsUnitCore[u].procoreunit_vat,
            procusunit_total: itemsUnitCore[u].procoreunit_total,
            ref_unit: itemsUnitCore[u].ref_unit,
            ref_procus: itemsProCus[a].id,
            ref_cus: itemsCus[c].ref_cus,
            ref_unitcore: itemsUnitCore[u].id,
          };
          arrUnitCus.push(dataUnitCus);
        }
      }
    }

    const resProCusUnit = await productModel.createUnitListProCusFromProCore(arrUnitCus)
    if (!resProCusUnit.status){
      return resProCusUnit
    }
    return resCore;
  } else {
    return resCore;
  }

  return { status: true };
};

const selectAllProductCore = async (page) => {
  const itemsPerPage = 20;
  if (!page) {
    return { status: false, message: `No Page` };
  }
  let count = await productModel.selectCountProductCore();
  let result = await productModel.selectAllProductCore(page);
  if (!result.status) {
    return result;
  }
  let pageCount = Math.ceil(parseFloat(count) / itemsPerPage);
  let data = {
    status: result.status,
    message: result.message,
    result: {
      page_count: pageCount,
      page_current: parseInt(page),
      data: result.result,
    },
  };
  return data;
};

const selectProductCoreInfoByID = async (obj) => {
  let resProCore = await productModel.selectProductCoreInfoByID(obj);
  if (!resProCore.status) {
    return resProCore;
  }

  let resListUnit = await productModel.selectProductCoreListUnitByID(
    resProCore.result.id
  );
  if (!resListUnit.status) {
    return resListUnit;
  }

  let items = resListUnit.result;
  for (let i = 0; i < items.length; i++) {
    items[i]["unit_obj"] = {
      unit_id: items[i].ref_unit,
      unit_name: items[i].procoreunit_unit_text,
    };
  }
  resProCore.result["list_price"] = items;

  return resProCore;
};

const updateProductCore = async (objToken, objCore, objPrice) => {
  objToken.accesstoken =
    objToken.accesstoken && objToken.accesstoken.split(" ")[1];
  const resToken = await productModel.findTokenEmpChange(objToken);

  objCore["ref_emp"] = resToken.result.ref_emp;

  const resCore = await productModel.updateProductCore(objCore);
  if (!resCore.status) {
    return resCore;
  }

  // test
  let items = JSON.parse(objPrice.list_price);
  for (let i = 0; i < items.length; i++) {
    if (parseInt(items[i].id) == 0) {
      let item = {
        procoreunit_name_text: resCore.result.procore_name,
        procoreunit_unit_text: items[i].procoreunit_unit_text,
        procoreunit_price: items[i].procoreunit_price,
        procoreunit_vat: items[i].procoreunit_vat,
        procoreunit_total: items[i].procoreunit_vat,
        ref_procore: resCore.result.id,
        ref_unit: items[i].ref_unit,
      };
      const resList = await productModel.createUnitListProductCore(item);
      if (!resList.status) {
        return resList;
      }
    } else {
      let item = {
        id: items[i].id,
        procoreunit_name_text: resCore.result.procore_name,
        procoreunit_unit_text: items[i].procoreunit_unit_text,
        procoreunit_price: items[i].procoreunit_price,
        procoreunit_vat: items[i].procoreunit_vat,
        procoreunit_total: items[i].procoreunit_total,
        ref_unit: items[i].ref_unit,
        is_deleted: items[i].is_deleted,
        updated_at: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      };
      const resList = await productModel.updateUnitListProductCore(item);
      if (!resList.status) {
        return resList;
      }
    }
  }

  return resCore;
};

const deleteProductCore = async (obj) => {
  let resCore = await productModel.deleteProductCore(obj);
  if (!resCore.status) {
    return resCore;
  }

  let dataList = {
    ref_procore: resCore.result.id,
    updated_at: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
  };
  let resList = await productModel.deleteUnitListProductCore(dataList);
  if (!resList.status) {
    return resList;
  }
  data = {
    status: true,
    message: `Delete Success`,
    result: [],
  };
  return data;
};

// End Product Core

module.exports = {
  createUnitProduct,
  updateUnitProduct,
  deleteUnitProduct,
  selectAllUnitProduct,
  selectUnitProductByID,
  selectAllUnitProductForProCore,
  createProductCore,
  selectAllProductCore,
  selectProductCoreInfoByID,
  updateProductCore,
  deleteProductCore,
};
