const { pgDB } = require("../configs/db.connect");

const findTokenEmp = async (obj) => {
    sql = "SELECT id FROM accesstoken_emp WHERE accesstoken=${accesstoken}";
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

  module.exports = {
    findTokenEmp
  };