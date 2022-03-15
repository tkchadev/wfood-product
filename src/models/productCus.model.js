const { pgDB } = require("../configs/db.connect");
const pgp = require("pg-promise")({
  query(e) {
    // console.log(e.query);
  },
});

const selectAllProductCore = async () => {
  sql = "SELECT * FROM product_core WHERE is_deleted != 99";
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

const selectUnitProductCoreByID = async (ref_procore) => {
  sql = `SELECT id,procoreunit_unit_text,procoreunit_price,procoreunit_vat,procoreunit_total,ref_unit 
  FROM product_core_listunit WHERE ref_procore=${ref_procore} AND is_deleted != 99`;
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

const selectCustomerIdByUUID = async (obj) => {
  sql = "SELECT id FROM user_customer WHERE cus_uuid=${cus_uuid}";
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

const findCustomerInProCus = async (id) => {
  sql = `SELECT EXISTS(SELECT id FROM product_cus WHERE ref_cus = ${id})`;
  try {
    const result = await pgDB.query(sql);
    data = {
      status: true,
      result: result[0].exists,
    };

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

const createProductCustomer = async (obj) => {
  try {
    // Create Multi One Query
    const cs = new pgp.helpers.ColumnSet(
      ["ref_procore", "ref_cus", "ref_emp"],
      { table: "product_cus" }
    );
    const query = pgp.helpers.insert(obj, cs) + " RETURNING id,ref_procore";
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

const createUnitListProductCustomer = async (obj) => {
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

const selectAllProductCus = async (id) => {
  sql = `SELECT procore_id,procore_name,procore_detail,procore_photo,product_cus.id 
  FROM product_cus INNER JOIN product_core ON product_cus.ref_procore = product_core.id 
  WHERE product_cus.ref_cus = ${id} AND product_cus.is_deleted != 99 AND  product_core.is_deleted != 99`;
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

const selectProductCusByID = async (id) => {
  sql = `SELECT procore_id,procore_name,procore_detail,procore_photo,product_cus.id 
  FROM product_cus INNER JOIN product_core ON product_cus.ref_procore = product_core.id 
  WHERE product_core.procore_id = '${id}' AND product_cus.is_deleted != 99 AND product_core.is_deleted != 99`;
  try {
    const result = await pgDB.query(sql);
    if (result[0]) {
      data = {
        status: true,
        message: `Success`,
        result: result[0],
      };
    } else {
      data = {
        status: false,
        message: `Not Found Item`,
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

const selectUnitProductCus = async (id) => {
  sql = `SELECT product_cus_listunit.id,procusunit_price,procoreunit_price,procusunit_vat,procoreunit_vat,procusunit_total,procoreunit_total,product_cus_listunit.ref_unit,procusunit_unit_text 
  FROM product_cus_listunit INNER JOIN product_core_listunit ON product_cus_listunit.ref_unitcore = product_core_listunit.id 
  WHERE product_cus_listunit.ref_procus = ${id} AND product_cus_listunit.is_deleted != 99 AND product_core_listunit.is_deleted != 99`;
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

// Update Only unit_list
const updateProductCustomer = async (obj) => {
  sql =
    "UPDATE product_cus_listunit SET " +
    "procusunit_unit_text=${procusunit_unit_text}," +
    "procusunit_price=${procusunit_price}," +
    "procusunit_vat=${procusunit_vat}," +
    "procusunit_total=${procusunit_total}," +
    "ref_unit=${ref_unit}," +
    "updated_at=${updated_at} "+
    "WHERE id = ${id} RETURNING id";
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
        message: `Unsuccess (No Data)`,
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

module.exports = {
  selectCustomerIdByUUID,
  findCustomerInProCus,
  createProductCustomer,
  selectAllProductCore,
  selectUnitProductCoreByID,
  createUnitListProductCustomer,
  selectAllProductCus,
  selectProductCusByID,
  selectUnitProductCus,
  updateProductCustomer
};
