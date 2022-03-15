const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const authenModel = require("../models/authen.model");

const privateKey = fs.readFileSync(
  path.join(__dirname, "../../sck", "private.key")
);
const publicKey = fs.readFileSync(
  path.join(__dirname, "../../sck", "public.key")
);

const signOptions = {
  issuer: "tkchadev",
  audience: "Wfood",
  algorithm: "RS256",
};

const generateToken = (payload) =>
  jwt.sign(payload, privateKey, { ...signOptions, expiresIn: "1d" });

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  const result = await authenModel.findTokenEmp({ accesstoken: token });
  if (!result.status) {
    res.status(401).json({
      status: false,
      message: "Invalid access_token",
    });
    return;
  }

  if (!token) {
    res.status(401).json({
      status: false,
      message: "Invalid access_token",
    });
    return;
  }

  jwt.verify(token, publicKey, signOptions, (err, decode) => {
    if (err) {
      res.status(401).json({
        status: false,
        message: "Invalid access_token (Err SCK)",
      });
      return;
    }
    // req.sub = decode.sub;
    next();
  });
};

module.exports = {
  generateToken,
  verifyToken,
};
