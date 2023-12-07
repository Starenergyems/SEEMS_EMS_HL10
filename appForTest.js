const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Schema = require("./models/schema");
const methodOverride = require("method-override");
const port = 3000;
mongoose
  .connect("mongodb://localhost:27017/ems")
  .then(() => {
    console.log("成功連結mongoDB....");
  })
  .catch((e) => {
    console.log(e);
  });

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// 創建一個Mongoose模型
const DataModel = mongoose.model("Data", Schema, "lc01");

app.get("/all", async (req, res) => {
  try {
    let data = await DataModel.find({}).exec();
    console.log(data);
    // return res.send(studentData);
    return res.render("test", { data });
  } catch (e) {
    return res.status(500).send("尋找資料時發生錯誤。。。");
  }
});

app.listen(port, () => {
  console.log("伺服器正在聆聽 port " + port + "...");
});
