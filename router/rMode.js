const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const router = express.Router();
const app = express();
const cors = require("cors");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cors());
//app.use(myMiddleware);

const { authentication } = require("./authMiddleware");

// app.get('*', (req, res, next) => {
//   // Assuming `authentication` returns true if authenticated, false otherwise
//   if (!authentication(req)) {
//     // If authentication fails, you may send a response or perform some other action
//     console.log("doaihdihas")
//     return res.status(401).send('Unauthorized');
//   }
//   // If authenticated, continue to the next middleware or route handler
//   next();
// });

//導向童話面作法同於METER
router.get("/mode", (req, res) => {
  // 在這裡修改重定向的方式，可以直接將 URL 修改為 "/mode/sysctrl"
  // 如果需要傳遞額外資訊，可以使用查詢字串或 session 等機制
  res.redirect("/mode/sysctrl");
});

//系統模式控制頁面切換
router.get("/mode/sysctrl", (req, res) => {
  res.render("Mode_SysCtrl", {
    permission: "manager",
    sysAvailability,
    SOC,
    SBSPM,
    sysMode,
    P_Project,
    P_LoadShift,
    statusAllPCS,
    statusAllBMS,
    stopCHGsched,
    Freq_A,
    P_t,
    Freq_B,
    P_u,
    Freq_C,
    P_v,
    Freq_D,
    P_w,
    Freq_E,
    P_x,
    Freq_F,
    P_y,
    //實功基準值
    P_base_SS1,
    P_base_SS2,
    P_base_SS3,
    P_base_SS4,
    //虛功基準值
    Q_base_SS1,
    Q_base_SS2,
    Q_base_SS3,
    Q_base_SS4,
    //子系統運作模式
    AutoMan_SS1,
    AutoMan_SS1_Light,
    AutoMan_SS2,
    AutoMan_SS2_Light,
    AutoMan_SS3,
    AutoMan_SS3_Light,
    AutoMan_SS4,
    AutoMan_SS4_Light,
    //電池與PCS狀態
    BMSPCSstatus_SS1_Light,
    BMSPCSstatus_SS1,
    BMSPCSstatus_SS2_Light,
    BMSPCSstatus_SS2,
    BMSPCSstatus_SS3_Light,
    BMSPCSstatus_SS3,
    BMSPCSstatus_SS4_Light,
    BMSPCSstatus_SS4,
    //子系統可用性
    Avail_SS1_Light,
    Avail_SS1,
    Avail_SS2_Light,
    Avail_SS2,
    Avail_SS3_Light,
    Avail_SS3,
    Avail_SS4_Light,
    Avail_SS4,
    //E-dReg服務狀態
    EdReg_SS1_Light,
    EdReg_SS1,
    EdReg_SS2_Light,
    EdReg_SS2,
    EdReg_SS3_Light,
    EdReg_SS3,
    EdReg_SS4_Light,
    EdReg_SS4,
  });
});

//  排程
router.get("/mode/schedule", (req, res) => {
  res.render("Mode_Schedule", { permission: "manager" });
});

//運轉資訊+單線圖
// router.get("/operateinfo", (req, res) => {
//   // num與fun
//   res.render("Op_Meter_SLD");
// });

module.exports = router;
