const jwt = require("jsonwebtoken");

const tokenBlacklist = new Set(); // Store blacklisted tokens in-memory

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    // Check if token is blacklisted (logged out)
    if (tokenBlacklist.has(token)) {
      return res.status(403).json({
        status: false,
        message: "Invalid token (logged out)",
      });
    }

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

const logoutUser = (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    tokenBlacklist.add(token); // Add token to blacklist
    return res.status(200).json({
      status: true,
      message: "User logged out successfully",
    });
  } else {
    return res.status(400).json({
      status: false,
      message: "No token provided",
    });
  }
};

const verifyAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (
      req.user.userType === "Client" ||
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
  logoutUser,
};
