// app.js

const express = require("express");
const app = express();
const rAccountRoutes = require("./path/to/rAccount"); // 替換成你的實際路徑

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// 使用引入的路由
app.use("/", rAccountRoutes);

const port = 3000;
app.listen(port, () => {
  console.log("伺服器正在聆聽 port " + port + "...");
});
