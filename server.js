const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const port = 6002;

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const restaurantRouter = require("./routes/restaurant");
const categoryRouter = require("./routes/category");
const recipeRoutes = require("./routes/recipeRoutes");
const foodRouter = require("./routes/food");
const cartRouter = require("./routes/cart");
const addressRouter = require("./routes/address");
const orderRouter = require("./routes/order");
const driverRouter = require("./routes/driver");
const healthInfoRouter = require("./routes/healthInfo");
const dietInfoRouter = require("./routes/dietInfo");
const favoriteRoutes = require("./routes/favoriteRoutes");

dotenv.config();
const admin = require("firebase-admin");

const serviceAccount = require("./ServicesAccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("db connection established"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", authRouter);
app.use("/api/users", userRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/category", categoryRouter);
app.use("/api/recipes", recipeRoutes);
app.use("/api/foods", foodRouter);
app.use("/api/cart", cartRouter);
app.use("/api/Address", addressRouter);
app.use("/api/Order", orderRouter);
app.use("/api/driver", driverRouter);
app.use("/api/healthInfo", healthInfoRouter);
app.use("/api/dietInfo", dietInfoRouter);
app.use("/api/favorites", favoriteRoutes);

app.listen(process.env.PORT || port, () =>
  console.log(`Listening on port ${process.env.PORT || port}`)
);
