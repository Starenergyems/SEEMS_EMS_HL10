const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const router = express.Router();
const app = express();
const cors = require("cors");
const nano = require("nano")("http://admin:ems45877096@192.168.8.101:5984");
const port = 3005;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(cors());
const {
  scaleProcess,
  mapSysMode,
  mapStatusAllBMS,
  mapStatusAllPCS,
  mapSysAvailability,
  mapStopCHGsched,
  mapAutoMan,
  mapBMSPCSstatus,
  mapAvail_SS,
  mapEdReg_SS,
} = require("./function");

// const otherrf01nanoDb = nano.use("other_rf01");
// const otherrf10nanoDb = nano.use("other_rf10");
const GCnanoDb = nano.use("gc_rf10");

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
// });

//app=router要記得改
//導向童話面作法同於METER
var sysctrl_variables;
async function query_Syscrtl_variables(){
  const indexDef = {
    index: { fields: ["time"] },
    name: "time_index",
  };
  await GCnanoDb.createIndex(indexDef);

  const mangoQuery = {
    selector: {
      time: { $exists: true },
    },
    sort: [{ time: "desc" }],
    limit: 1,
  };

  GCnanoDb.find(mangoQuery, async (err, body) => {
    if (err) {
      console.error("Error:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const GCData = body.docs[0]; // 取得數據的第一個元素

    sysctrl_variables = {
      permission: "manager",
      sysAvailability: mapSysAvailability(GCData.System[400078]), //15
      SOC: scaleProcess(GCData.System[400036], 0.1, 1),
      SBSPM: scaleProcess(GCData.System[400037], 0.01, 1),
      sysMode: mapSysMode(
        GCData.System[400078] //15
      ),

      P_Project: scaleProcess(GCData.System[400001], 0.01, 1),
      P_LoadShift: scaleProcess(GCData.System[400002], 0.01, 1),
      statusAllPCS: mapStatusAllPCS(
        GCData.System[400078], //bit2
        GCData.System[400079], //bit2
        GCData.System[400080], //bit2
        GCData.System[400081] //bit2
      ),
      statusAllBMS: mapStatusAllBMS(
        GCData.System[400078], //BIT0、BIT1
        GCData.System[400079], //BIT0、BIT1
        GCData.System[400080], //BIT0、BIT1
        GCData.System[400081] //BIT0、BIT1
      ),

      stopCHGsched: mapStopCHGsched(GCData.System[400078]), //bit 14: Force P_LS to 0 ( 0: No, 1: Yes )
      Freq_A: scaleProcess(GCData.System[400016], 0.01, 2),
      Freq_B: scaleProcess(GCData.System[400017], 0.01, 2),
      Freq_C: scaleProcess(GCData.System[400018], 0.01, 2),
      Freq_D: scaleProcess(GCData.System[400019], 0.01, 2),
      Freq_E: scaleProcess(GCData.System[400020], 0.01, 2),
      Freq_F: scaleProcess(GCData.System[400021], 0.01, 2),

      P_t: scaleProcess(GCData.System[400022], 0.1, 1),
      P_u: scaleProcess(GCData.System[400023], 0.1, 1),
      P_v: scaleProcess(GCData.System[400024], 0.1, 1),
      P_w: scaleProcess(GCData.System[400025], 0.1, 1),
      P_x: scaleProcess(GCData.System[400026], 0.1, 1),
      P_y: scaleProcess(GCData.System[400027], 0.1, 1),

      //實功基準值
      P_base_SS1: GCData.System[400028],
      P_base_SS2: GCData.System[400029],
      P_base_SS3: GCData.System[400030],
      P_base_SS4: GCData.System[400031],

      //虛功基準值
      Q_base_SS1: GCData.System[400056],
      Q_base_SS2: GCData.System[400057],
      Q_base_SS3: GCData.System[400058],
      Q_base_SS4: GCData.System[400059],

      //子系統運作模式
      AutoMan_SS1: mapAutoMan(GCData.System[400076], 1), //bit 1
      AutoMan_SS1_Light: mapAutoMan(GCData.System[400076], 1),
      AutoMan_SS2: mapAutoMan(GCData.System[400076], 2),
      AutoMan_SS2_Light: mapAutoMan(GCData.System[400076], 2),
      AutoMan_SS3: mapAutoMan(GCData.System[400076], 3), //bit 3
      AutoMan_SS3_Light: mapAutoMan(GCData.System[400076], 3),
      AutoMan_SS4: mapAutoMan(GCData.System[400076], 4), //bit 4
      AutoMan_SS4_Light: mapAutoMan(GCData.System[400076], 4),

      //電池與PCS狀態
      BMSPCSstatus_SS1_Light: mapBMSPCSstatus(GCData.System[400078]), //bit3
      BMSPCSstatus_SS1: mapBMSPCSstatus(GCData.System[400078]),
      BMSPCSstatus_SS2_Light: mapBMSPCSstatus(GCData.System[400079]), //bit3
      BMSPCSstatus_SS2: mapBMSPCSstatus(GCData.System[400079]),
      BMSPCSstatus_SS3_Light: mapBMSPCSstatus(GCData.System[400080]), //bit3
      BMSPCSstatus_SS3: mapBMSPCSstatus(GCData.System[400080]), //bit3
      BMSPCSstatus_SS4_Light: mapBMSPCSstatus(GCData.System[400081]), //bit3
      BMSPCSstatus_SS4: mapBMSPCSstatus(GCData.System[400081]),

      //子系統可用性
      Avail_SS1_Light: mapAvail_SS(GCData.System[400078]), //bit4
      Avail_SS1: mapAvail_SS(GCData.System[400078]),
      Avail_SS2_Light: mapAvail_SS(GCData.System[400079]), //bit4
      Avail_SS2: mapAvail_SS(GCData.System[400079]),
      Avail_SS3_Light: mapAvail_SS(GCData.System[400080]), //bit4
      Avail_SS3: mapAvail_SS(GCData.System[400080]),
      Avail_SS4_Light: mapAvail_SS(GCData.System[400081]), //bit4
      Avail_SS4: mapAvail_SS(GCData.System[400081]),

      //E-dReg服務狀態
      EdReg_SS1_Light: mapEdReg_SS(GCData.System[400078]), //bit5
      EdReg_SS1: mapEdReg_SS(GCData.System[400078]), //bit5
      EdReg_SS2_Light: mapEdReg_SS(GCData.System[400079]), //bit5
      EdReg_SS2: mapEdReg_SS(GCData.System[400079]), //bit5
      EdReg_SS3_Light: mapEdReg_SS(GCData.System[400080]), //bit5
      EdReg_SS3: mapEdReg_SS(GCData.System[400080]), //bit5
      EdReg_SS4_Light: mapEdReg_SS(GCData.System[400081]), //bit5
      EdReg_SS4: mapEdReg_SS(GCData.System[400081]), //bit5
    };
  });
}


app.get("/mode", (req, res) => {
// 在這裡修改重定向的方式，可以直接將 URL 修改為 "/mode/sysctrl"
// 如果需要傳遞額外資訊，可以使用查詢字串或 session 等機制
res.redirect("/mode/sysctrl");
});

//系統模式控制頁面切換
app.get("/mode/sysctrl", async (req, res) => {
  await query_Syscrtl_variables();
  res.render("Mode_SysCtrl", sysctrl_variables);
});

app.get("/mode/sysctrl/:data", async (req, res) => {
  await query_Syscrtl_variables();
  res.json(sysctrl_variables);
});

/******排程**************************************************************/
app.get("/mode/schedule", (req, res) => {
  res.render("Mode_Schedule", { permission: "manager" });
});

//運轉資訊+單線圖
// router.get("/operateinfo", (req, res) => {
//   // num與fun
//   res.render("Op_Meter_SLD");
// });

module.exports = router;
app.listen(port, () => {
  console.log(`mode.js 應用程式正在監聽端口 ${port}`);
});
