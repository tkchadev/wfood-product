const productCusModel = require("../models/productCus.model");
const productCoreModel = require("../models/productCore.model");
const bcrypt = require("bcryptjs");
const jwt = require("../helper/jwt");
const moment = require("moment");

const findCustomerInProCus = async (obj) => {
  let resCus = await productCusModel.selectCustomerIdByUUID(obj);
  if (!resCus.status) {
    return resCus;
  }
  let resFind = await productCusModel.findCustomerInProCus(resCus.result.id);

  //   if TRUE Select All ProCus
  if (resFind.result) {
    let resProCus = await productCusModel.selectAllProductCus(resCus.result.id);
    return resProCus;
  } else {
    data = {
      status: true,
      result: [],
      message: `No Data`,
    };
    return data;
  }
};

const selectProductCustomerByID = async (id) => {
  const resProCus = await productCusModel.selectProductCusByID(id);
  if (!resProCus.status) {
    resProCus.status = true;
    return resProCus;
  }
  let items = resProCus.result;
  let resUnit = await productCusModel.selectUnitProductCus(items.id);
  let unit = resUnit.result;
  for (let u = 0; u < unit.length; u++) {
    unit[u]["unit_obj"] = {
      unit_id: unit[u].ref_unit,
      unit_name: unit[u].procusunit_unit_text,
    };
  }
  resProCus.result["list_unit"] = unit;
  return resProCus;
};

const createProductCustomer = async (objToken, objCus) => {
  try {
    objToken.accesstoken =
      objToken.accesstoken && objToken.accesstoken.split(" ")[1];
    const resToken = await productCoreModel.findTokenEmpChange(objToken);

    let resCus = await productCusModel.selectCustomerIdByUUID(objCus);
    if (!resCus.status) {
      return resCus;
    }

    // Check Product Core In ProCus ??
    let resFind = await productCusModel.findCustomerInProCus(resCus.result.id);

    if (resFind.result) {
      return {
        status: false,
        message: "ไม่สามารถจัดการสินค้าได้ เนื่องจากผู้ใช้นี้ถูกสร้างไปแล้ว",
        result: [],
      };
    }

    let resProCore = await productCusModel.selectAllProductCore();
    if (!resProCore.status) {
      return resProCore;
    }

    let items = resProCore.result;
    var arr = [];
    for (let i = 0; i < items.length; i++) {
      let nData = {
        ref_procore: items[i].id,
        ref_cus: resCus.result.id,
        ref_emp: resToken.result.ref_emp,
      };
      arr.push(nData);
    }
    let resProCus = await productCusModel.createProductCustomer(arr);
    if (!resProCus.status) {
      return resProCus;
    }


    // create procus list unit
    let arrUnit = [];
    let itemsUnit = resProCus.result;

    for (let i = 0; i < itemsUnit.length; i++) {
      itemUnitID = await productCusModel.selectUnitProductCoreByID(
        itemsUnit[i].ref_procore
      );

      let itemU = itemUnitID.result;
      for (let u = 0; u < itemU.length; u++) {
  
        let nData = {
          procusunit_unit_text: itemU[u].procoreunit_unit_text,
          procusunit_price: itemU[u].procoreunit_price,
          procusunit_vat: itemU[u].procoreunit_vat,
          procusunit_total: itemU[u].procoreunit_total,
          ref_unit: itemU[u].ref_unit,
          ref_procus: itemsUnit[i].id,
          ref_cus: resCus.result.id,
          ref_unitcore: itemU[u].id,
        };
        arrUnit.push(nData);
      }
    }

    if (arrUnit.length > 0) {
      let resUnit = await productCusModel.createUnitListProductCustomer(
        arrUnit
      );
      if (!resUnit.status) {
        return resUnit;
      }
      let data = {
        status: true,
        result: [],
        message: "Create Success",
      };
      return data;
    } else {
      let data = {
        status: false,
        result: [],
        message: "Unsuccess",
      };
      return data;
    }
  } catch (error) {
    return {
      status: false,
      message: `Error ${error}`,
      result: [],
    };
  }
};

const updateProductCustomer = async (obj) => {
  let items = obj.list_unit;
  for (let i = 0; i < items.length; i++) {
    let dataUnit = {
      id: items[i].id,
      procusunit_price: items[i].procusunit_price,
      procusunit_vat: items[i].procusunit_vat,
      procusunit_total: items[i].procusunit_total,
      ref_unit: items[i].ref_unit,
      procusunit_unit_text: items[i].procusunit_unit_text,
      updated_at: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    };
    let resUnit = await productCusModel.updateProductCustomer(dataUnit);
    if (!resUnit.status) {
      return resUnit;
    }
  }

  let data = {
    status: true,
    message: `Success`,
    result: [],
  };

  return data;
};

module.exports = {
  findCustomerInProCus,
  createProductCustomer,
  selectProductCustomerByID,
  updateProductCustomer,
};
