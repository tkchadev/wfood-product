const { pgDB } = require("../configs/db.connect");
const pgp = require("pg-promise")({
  query(e) {
    // console.log(e.query);
  },
});

// Extra
const findTokenEmpChange = async (obj) => {
  sql = "SELECT ref_emp FROM accesstoken_emp WHERE accesstoken=${accesstoken}";
  try {
    const result = await pgDB.query(sql, obj);
    if (result[0]) {
      data = {
        status: true,
        result: result[0],
      };
    } else {
      data = {
        status: false,
        result: [],
      };
    }

    return data;
  } catch (error) {
    data = {
      status: false,
      result: [],
    };
    return data;
  }
};

// Start Unit Product

const createUnitProduct = async (obj) => {
  sql =
    "INSERT INTO product_unit(${this:name}) VALUES(${this:csv}) RETURNING id";
  try {
    const result = await pgDB.query(sql, obj);
    if (result[0]) {
      data = {
        status: true,
        message: `Create Success`,
        result: [],
      };
    } else {
      data = {
        status: false,
        message: `Unsuccess`,
        result: [],
      };
    }
    return data;
  } catch (error) {
    data = {
      status: false,
      message: `Error ${error}`,
      result: [],
    };
    return data;
  }
};

const updateUnitProduct = async (obj) => {
  sql =
    "UPDATE product_unit SET unit_name=${unit_name},updated_at=${updated_at} WHERE id=${id} RETURNING unit_name";
  try {
    const result = await pgDB.query(sql, obj);
    if (result[0]) {
      data = {
        status: true,
        message: `Update Success`,
        result: [],
      };
    } else {
      data = {
        status: false,
        message: `Unsuccess`,
        result: [],
      };
    }
    return data;
  } catch (error) {
    data = {
      status: false,
      message: `Error ${error}`,
      result: [],
    };
    return data;
  }
};

const deleteUnitProduct = async (obj) => {
  sql =
    "UPDATE product_unit SET updated_at=${updated_at},is_deleted=99 WHERE id=${id} RETURNING id";
  try {
    const result = await pgDB.query(sql, obj);
    if (result[0]) {
      data = {
        status: true,
        message: `Delete Success`,
        result: [],
      };
    } else {
      data = {
        status: false,
        message: `Unsuccess`,
        result: [],
      };
    }
    return data;
  } catch (error) {
    data = {
      status: false,
      message: `Error ${error}`,
      result: [],
    };
    return data;
  }
};

const selectAllUnitProduct = async (page) => {
  const itemsPerPage = 12;
  const offset = (parseInt(page) - 1) * itemsPerPage;
  sql = `SELECT id,unit_name FROM product_unit WHERE is_deleted != 99 ORDER BY unit_name ASC LIMIT ${itemsPerPage} OFFSET ${offset}`;
  try {
    const result = await pgDB.query(sql);
    data = {
      status: true,
      message: `Success`,
      result: result,
    };
    return data;
  } catch (error) {
    data = {
      status: false,
      message: `Error ${error}`,
      result: [],
    };
    return data;
  }
};
const selectCountUnitProduct = async () => {
  sql = `SELECT COUNT(*) FROM product_unit WHERE is_deleted != 99`;
  let count = await pgDB.query(sql);
  return count[0].count;
};

const selectUnitProductInfoByID = async (obj) => {
  sql =
    "SELECT id,unit_name FROM product_unit WHERE id=${id} AND is_deleted != 99";
  try {
    const result = await pgDB.query(sql, obj);
    data = {
      status: true,
      message: `Success`,
      result: result[0],
    };

    return data;
  } catch (error) {
    data = {
      status: false,
      message: `Error ${error}`,
      result: [],
    };
    return data;
  }
};

// End Unit Product

// Start Product Core

const findProductCoreID = async (procore_id) => {
  sql = `SELECT id FROM product_core WHERE procore_id='${procore_id}' AND is_deleted != 99`;
  try {
    const result = await pgDB.query(sql);
    if (result[0]) {
      data = {
        status: false,
        result: [],
        message: "มีรหัสสินค้านี้แล้วในระบบแล้ว",
      };
    } else {
      data = {
        status: true,
        result: [],
      };
    }

    return data;
  } catch (error) {
    data = {
      status: false,
      result: [],
      message: `${error}`,
    };
    return data;
  }
};

// - find cus_id from product_cus
const selectCusIDInProductCustomer = async () => {
  sql = `SELECT DISTINCT ref_cus FROM product_cus WHERE is_deleted != 99 ORDER BY ref_cus ASC`;
  try {
    const result = await pgDB.query(sql);
    data = {
      status: true,
      message: `Success`,
      result: result,
    };
    return data;
  } catch (error) {
    data = {
      status: false,
      message: `Error ${error}`,
      result: [],
    };
    return data;
  }
};

const createProCusFromProCore = async (obj) => {
  try {
    // Create Multi One Query
    const cs = new pgp.helpers.ColumnSet(
      ["ref_procore", "ref_cus", "ref_emp"],
      { table: "product_cus" }
    );
    const query = pgp.helpers.insert(obj, cs) + " RETURNING id";
    const result = await pgDB.many(query);
    // const result = await pgDB.query('INSERT INTO product_cus(ref_procore,ref_cus) VALUES $1',Inserts('${ref_procore}, ${ref_cus}', obj));
    data = {
      status: true,
      message: `Create Success`,
      result: result,
    };
    return data;
  } catch (error) {
    data = {
      status: false,
      message: `Error ${error}`,
      result: [],
    };
    return data;
  }
};

const createUnitListProCusFromProCore = async (obj) => {
  let arr = [
    "procusunit_unit_text",
    "procusunit_price",
    "procusunit_vat",
    "procusunit_total",
    "ref_unit",
    "ref_procus",
    "ref_cus",
    "ref_unitcore",
  ];
  try {
    // Create Multi One Query
    const cs = new pgp.helpers.ColumnSet(arr, {
      table: "product_cus_listunit",
    });
    const query = pgp.helpers.insert(obj, cs) + " RETURNING id";
    const result = await pgDB.many(query);
    // const result = await pgDB.query('INSERT INTO product_cus(ref_procore,ref_cus) VALUES $1',Inserts('${ref_procore}, ${ref_cus}', obj));
    data = {
      status: true,
      message: `Create Success`,
      result: result,
    };
    return data;
  } catch (error) {
    data = {
      status: false,
      message: `Error ${error}`,
      result: [],
    };
    return data;
  }
};

// - ***

const selectAllUnitProductForProCore = async () => {
  sql = `SELECT id,unit_name FROM product_unit WHERE is_deleted != 99 ORDER BY unit_name ASC`;
  try {
    const result = await pgDB.query(sql);
    data = {
      status: true,
      message: `Success`,
      result: result,
    };
    return data;
  } catch (error) {
    data = {
      status: false,
      message: `Error ${error}`,
      result: [],
    };
    return data;
  }
};

const createProductCore = async (obj) => {
  sql =
    "INSERT INTO product_core(${this:name}) VALUES(${this:csv}) RETURNING id,procore_name";
  try {
    const result = await pgDB.query(sql, obj);
    if (result[0]) {
      data = {
        status: true,
        message: `Create Success`,
        result: result[0],
      };
    } else {
      data = {
        status: false,
        message: `Unsuccess`,
        result: [],
      };
    }
    return data;
  } catch (error) {
    data = {
      status: false,
      message: `Error ${error}`,
      result: [],
    };
    return data;
  }
};

const createUnitListProductCore = async (obj) => {
  let arr = [
    "procoreunit_name_text",
    "procoreunit_unit_text",
    "procoreunit_price",
    "procoreunit_vat",
    "procoreunit_total",
    "ref_procore",
    "ref_unit",
  ];
  try {
    // Create Multi One Query
    const cs = new pgp.helpers.ColumnSet(arr, {
      table: "product_core_listunit",
    });
    const query = pgp.helpers.insert(obj, cs) + " RETURNING *";
    const result = await pgDB.many(query);
    // const result = await pgDB.query('INSERT INTO product_cus(ref_procore,ref_cus) VALUES $1',Inserts('${ref_procore}, ${ref_cus}', obj));
    data = {
      status: true,
      message: `Create Success`,
      result: result,
    };
    return data;
  } catch (error) {
    data = {
      status: false,
      message: `Error ${error}`,
      result: [],
    };
    return data;
  }
};

// const createUnitListProductCore = async (obj) => {
//   sql =
//     "INSERT INTO product_core_listunit(${this:name}) VALUES(${this:csv}) RETURNING id";
//   try {
//     const result = await pgDB.query(sql, obj);
//     if (result[0]) {
//       data = {
//         status: true,
//         message: `Create Success`,
//         result: result[0],
//       };
//     } else {
//       data = {
//         status: false,
//         message: `Unsuccess List`,
//         result: [],
//       };
//     }
//     return data;
//   } catch (error) {
//     data = {
//       status: false,
//       message: `Error ${error}`,
//       result: [],
//     };
//     return data;
//   }
// };

const selectAllProductCore = async (page) => {
  const itemsPerPage = 20;
  const offset = (parseInt(page) - 1) * itemsPerPage;
  sql = `SELECT id,procore_id,procore_name,procore_photo FROM product_core WHERE is_deleted != 99 ORDER BY procore_id ASC LIMIT ${itemsPerPage} OFFSET ${offset}`;
  try {
    const result = await pgDB.query(sql);
    data = {
      status: true,
      message: `Success`,
      result: result,
    };
    return data;
  } catch (error) {
    data = {
      status: false,
      message: `Error ${error}`,
      result: [],
    };
    return data;
  }
};

const selectCountProductCore = async () => {
  sql = `SELECT COUNT(*) FROM product_core WHERE is_deleted != 99`;
  let count = await pgDB.query(sql);
  return count[0].count;
};

const selectProductCoreInfoByID = async (obj) => {
  sql =
    "SELECT id,procore_id,procore_name,procore_detail,procore_photo FROM product_core WHERE id=${id} AND is_deleted != 99";
  try {
    const result = await pgDB.query(sql, obj);
    data = {
      status: true,
      message: `Success`,
      result: result[0],
    };

    return data;
  } catch (error) {
    data = {
      status: false,
      message: `Error ${error}`,
      result: [],
    };
    return data;
  }
};

const selectProductCoreListUnitByID = async (id) => {
  sql = `SELECT * FROM product_core_listunit WHERE ref_procore=${id} AND is_deleted != 99`;
  try {
    const result = await pgDB.query(sql);
    data = {
      status: true,
      message: `Success`,
      result: result,
    };

    return data;
  } catch (error) {
    data = {
      status: false,
      message: `Error ${error}`,
      result: [],
    };
    return data;
  }
};

const updateProductCore = async (obj) => {
  if (obj.procore_photo != null) {
    var photo = "procore_photo=${procore_photo},";
  } else {
    var photo = "";
  }
  sql =
    "UPDATE product_core SET " +
    "procore_name=${procore_name}," +
    "procore_detail=${procore_detail}," +
    "ref_emp=${ref_emp}," +
    photo +
    "updated_at=${updated_at} " +
    "WHERE id=${id} RETURNING id,procore_name";
  try {
    const result = await pgDB.query(sql, obj);
    if (result[0]) {
      data = {
        status: true,
        message: `Update Success`,
        result: result[0],
      };
    } else {
      data = {
        status: false,
        message: `Unsuccess`,
        result: [],
      };
    }
    return data;
  } catch (error) {
    data = {
      status: false,
      message: `${error}`,
      result: [],
    };
    return data;
  }
};

const updateUnitListProductCore = async (obj) => {
  sql =
    "UPDATE product_core_listunit SET " +
    "procoreunit_name_text=${procoreunit_name_text}," +
    "procoreunit_unit_text=${procoreunit_unit_text}," +
    "procoreunit_price=${procoreunit_price}," +
    "procoreunit_vat=${procoreunit_vat}," +
    "procoreunit_total=${procoreunit_total}," +
    "ref_unit=${ref_unit}," +
    "is_deleted=${is_deleted}," +
    "updated_at=${updated_at} " +
    "WHERE id=${id} RETURNING id";
  try {
    const result = await pgDB.query(sql, obj);
    if (result[0]) {
      data = {
        status: true,
        message: `Update Success`,
        result: result[0],
      };
    } else {
      data = {
        status: false,
        message: `Unsuccess`,
        result: [],
      };
    }
    return data;
  } catch (error) {
    data = {
      status: false,
      message: `${error}`,
      result: [],
    };
    return data;
  }
};

const deleteProductCore = async (obj) => {
  sql =
    "UPDATE product_core SET updated_at=${updated_at},is_deleted=99 WHERE id=${id} RETURNING id";
  try {
    const result = await pgDB.query(sql, obj);
    if (result[0]) {
      data = {
        status: true,
        message: `Delete Success`,
        result: result[0],
      };
    } else {
      data = {
        status: false,
        message: `Unsuccess`,
        result: [],
      };
    }
    return data;
  } catch (error) {
    data = {
      status: false,
      message: `Error ${error}`,
      result: [],
    };
    return data;
  }
};

const deleteUnitListProductCore = async (obj) => {
  sql =
    "UPDATE product_core_listunit SET updated_at=${updated_at},is_deleted=99 WHERE ref_procore=${ref_procore} RETURNING id";
  try {
    const result = await pgDB.query(sql, obj);
    data = {
      status: true,
      message: `Delete Success`,
      result: [],
    };
    return data;
  } catch (error) {
    data = {
      status: false,
      message: `Error ${error}`,
      result: [],
    };
    return data;
  }
};

// End Product Core

module.exports = {
  findTokenEmpChange,
  findProductCoreID,
  createUnitProduct,
  updateUnitProduct,
  deleteUnitProduct,
  selectAllUnitProduct,
  selectCountUnitProduct,
  selectUnitProductInfoByID,
  selectAllUnitProductForProCore,
  createProductCore,
  createUnitListProductCore,
  selectAllProductCore,
  selectCountProductCore,
  selectProductCoreInfoByID,
  selectProductCoreListUnitByID,
  updateProductCore,
  updateUnitListProductCore,
  deleteProductCore,
  deleteUnitListProductCore,
  selectCusIDInProductCustomer,
  createProCusFromProCore,
  createUnitListProCusFromProCore
};
