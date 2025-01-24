const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) {
        return res.status(403).json({
          status: false,
          message: "Invalid token",
        });
      }

      req.user = user;
      req.user.id = user.id || user._id;
      next();
    });
  } else {
    res.status(401).json({
      status: false,
      message: "Authorization token required",
    });
  }
};

const verifyAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (
      req.user.userType === "Clinet" ||
      req.user.userType === "Vendor" ||
      req.user.userType === "Driver"
    ) {
      next();
    } else {
      res.status(403).json({
        status: false,
        message: "Unauthorized access",
      });
    }
  });
};

const verifyVendor = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.userType === "Vendor" || req.user.userType === "Admin") {
      next();
    } else {
      res.status(403).json({
        status: false,
        message: "Unauthorized access",
      });
    }
  });
};

const verifyDriver = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.userType === "Driver" || req.user.userType === "Admin") {
      next();
    } else {
      res.status(403).json({
        status: false,
        message: "Unauthorized access",
      });
    }
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.userType === "Admin") {
      next();
    } else {
      res.status(403).json({
        status: false,
        message: "Unauthorized access",
      });
    }
  });
};

module.exports = {
  verifyToken,
  verifyAndAuthorization,
  verifyVendor,
  verifyAdmin,
  verifyDriver,
};
