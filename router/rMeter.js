const express = require("express");
const path = require("path");
const nano = require("nano")("http://admin:ems45877096@192.168.1.12:5984");
const other_rf01 = "other_rf01";
const other_rf10 = "other_rf10";
const rf01Db = nano.use(other_rf01); // 請注意這裡使用 nano.use() 來設定數據庫
const rf10Db = nano.use(other_rf10); // 請注意這裡使用 nano.use() 來設定數據庫
const { scaleProcess, Calculate_CPM10_energy } = require("./function");
const methodOverride = require("method-override");
const router = express.Router();
const app = express();
const cors = require("cors");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cors());

router.get("/operateinfo", (req, res) => {
  // num與fun
  res.redirect("/operateinfo/singlelinediagram");
});

router.get("/operateinfo/singlelinediagram", async (req, res) => {
  // num與fun
  const mangoQuery = {
    selector: {
      time: { $exists: true },
    },
    sort: [{ time: "desc" }],
    limit: 1,
  };
  rf10Db.find(mangoQuery, async (err, body) => {
    try {
      const indexDef = {
        index: { fields: ["time"] },
        name: "time_index",
      };

      await rf10Db.createIndex(indexDef);

      const mangoQuery = {
        selector: {
          time: { $exists: true },
        },
        sort: [{ time: "desc" }],
        limit: 1,
      };

      rf10Db.find(mangoQuery, async (err, body) => {
        if (err) {
          console.error("Error:", err);
          res.status(500).send("Internal Server Error");
          return;
        }

        const other10Data = body.docs[0]; // 取得數據的第一個元素

        res.render("Op_Meter_SLD", {
          //layout: false,
          permission: "manager",
          MVCB: other10Data.VCBStatus1[408205] || 0,
          VCB_1: other10Data.VCBStatus2[408205] || 0,
          VCB_2: other10Data.VCBStatus3[408205] || 0,
          VCB_3: other10Data.VCBStatus4[408205] || 0,
          VCB_4: other10Data.VCBStatus5[408205] || 0,

          ACB_1_1: other10Data.ACBStatus1[408206] || 0,
          ACB_1_2: other10Data.ACBStatus1[408206] || 0,
          ACB_1_3: other10Data.ACBStatus1[408206] || 0,
          ACB_2_1: other10Data.ACBStatus2[408206] || 0,
          ACB_2_2: other10Data.ACBStatus2[408206] || 0,
          ACB_2_3: other10Data.ACBStatus2[408206] || 0,
          ACB_3_1: other10Data.ACBStatus3[408206] || 0,
          ACB_3_2: other10Data.ACBStatus3[408206] || 0,
          ACB_3_3: other10Data.ACBStatus3[408206] || 0,
          ACB_4_1: other10Data.ACBStatus4[408206] || 0,

          ACB_1_1v: other10Data.ACBStatus1[408206] || 0,
          ACB_1_2v: other10Data.ACBStatus1[408206] || 0,
          ACB_1_3v: other10Data.ACBStatus1[408206] || 0,
          ACB_2_1v: other10Data.ACBStatus2[408206] || 0,
          ACB_2_2v: other10Data.ACBStatus2[408206] || 0,
          ACB_2_3v: other10Data.ACBStatus2[408206] || 0,
          ACB_3_1v: other10Data.ACBStatus3[408206] || 0,
          ACB_3_2v: other10Data.ACBStatus3[408206] || 0,
          ACB_3_3v: other10Data.ACBStatus3[408206] || 0,
          ACB_4_1v: other10Data.ACBStatus4[408206] || 0,

          //VCB_aux,
          // Rly_MVCB: scaleProcess(other10Data.RelayMVCB[408181], 0.1, 1) || 0,
          // Recloser_MVCB:
          //   scaleProcess(other10Data.Recloser[408210], 0.1, 1) || 0,
          // Rly_VCB_1: other10Data.RelayVCB1[408203] || 0,
          // Rly_VCB_2: other10Data.RelayVCB2[408203] || 0,
          // Rly_VCB_3: other10Data.RelayVCB3[408203] || 0,
          // Rly_VCB_4: other10Data.RelayVCB4[408203] || 0,
          // Rly_VCB_aux: other10Data.RelayVCB5[408203] || 0,

          temp_TR1: scaleProcess(other10Data.TR1[408181], 0.1, 1) || 0,
          temp_TR2: scaleProcess(other10Data.TR2[408181], 0.1, 1) || 0,
          temp_TR3: scaleProcess(other10Data.TR3[408181], 0.1, 1) || 0,
          temp_TR4: scaleProcess(other10Data.TR4[408181], 0.1, 1) || 0,
          temp_TR_aux: scaleProcess(other10Data.TR5[408181], 0.1, 1) || 0,

          // thermoBot_TR1: other10Data.TR3[408181] || 0,
          // thermoBot_TR2: other10Data.TR3[408181] || 0,
          // thermoBot_TR3: other10Data.TR3[408181] || 0,
          // thermoBot_TR4: other10Data.TR3[408181] || 0,
          // thermoBot_TR_aux: other10Data.TR3[408181] || 0,
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
});

router.get("/operateinfo/mainmeter", async (req, res) => {
  try {
    const indexDef = {
      index: { fields: ["time"] },
      name: "time_index",
    };
    await rf01Db.createIndex(indexDef);

    const mangoQuery = {
      selector: {
        time: { $exists: true },
      },
      sort: [{ time: "desc" }],
      limit: 1,
    };

    rf01Db.find(mangoQuery, async (err, body) => {
      if (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      const other1Data = body.docs[0]; // 取得數據的第一個元素
      //console.log("AA----------------------------------------------AA");
      //console.log(other1Data);

      const scaleAndPointMapping = {
        408001: { scale: 0.1, point: 1 },
        408003: { scale: 0.1, point: 1 },
        408005: { scale: 0.1, point: 1 },
        408007: { scale: 0.1, point: 2 },
        408009: { scale: 0.1, point: 2 },
        408011: { scale: 0.1, point: 2 },
        408013: { scale: 0.1, point: 2 },
        408015: { scale: 0.1, point: 2 },
        408017: { scale: 0.1, point: 2 },
        408019: { scale: 0.1, point: 2 },
        408021: { scale: 0.1, point: 2 },
        408023: { scale: 0.1, point: 2 },
        408025: { scale: 0.1, point: 2 },
        408026: { scale: 0.1, point: 2 },
        408028: { scale: 0.1, point: 2 },
        408030: { scale: 0.1, point: 2 },
        408032: { scale: 0.1, point: 2 },
        408034: { scale: 0.1, point: 2 },
      };

      const data = {};

      Object.entries(scaleAndPointMapping).forEach(
        ([property, { scale, point }]) => {
          const originalValue = other1Data.Freq[property];
          const scaledValue = scaleProcess(originalValue, scale, point);
          data[property] = scaledValue;
          // console.log("屬性", property);
          // console.log("原始數值", originalValue);
          // console.log("轉換後數值", scaledValue);
        }
      );
      //因為都是 Freq  所以直接利用迴圈先跑
      res.render("Op_Meter_MainMeter", {
        volt_ab: data["408001"],
        volt_bc: data["408003"],
        volt_ca: data["408005"],
        volt_avg: data["408007"],
        curr_a: data["408009"],
        curr_b: data["408011"],
        curr_c: data["408013"],
        curr_n: data["408015"],
        curr_avg: data["408017"],
        activePower: data["408019"],
        reactivePower: data["408021"],
        apparentPower: data["408023"],
        powerFactor: data["408025"],
        Freq: data["408026"],
        kwh_imp: data["408028"],
        kwh_exp: data["408030"],
        kvarh_imp: data["408032"],
        kvarh_exp: data["408034"],
        other1Data, // 確保 other1Data 也被傳遞
        permission: "manager",
        // ... 其他屬性的渲染可以類似地添加
        //permission: "manager",
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/operateinfo/auxmeter", async (req, res) => {
  try {
    const indexDef = {
      index: { fields: ["time"] },
      name: "time_index",
    };
    await rf10Db.createIndex(indexDef);

    const mangoQuery = {
      selector: {
        time: { $exists: true },
      },
      sort: [{ time: "desc" }],
      limit: 1,
    };

    rf10Db.find(mangoQuery, async (err, body) => {
      if (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      const other10Data = body.docs[0]; // 取得數據的第一個元素

      res.render("Op_Meter_AuxMeter", {
        permission: "manager",
        //MVCB = AuxM2
        V_Aux_HV: scaleProcess(other10Data.AuxM2[408077], 0.1, 1) || 0,
        I_Aux_HV: scaleProcess(other10Data.AuxM2[408078], 0.01, 2) || 0,
        P_Aux_HV: scaleProcess(other10Data.AuxM2[408079], 0.1, 1) || 0,
        E_Aux_HV:
          Calculate_CPM10_energy(
            other10Data.AuxM2[408080],
            other10Data.AuxM2[408081],
            other10Data.AuxM2[408082]
          ) || 0,

        V_Aux_ESS1_1: scaleProcess(other10Data.AuxM3[408077], 0.1, 1) || 0,
        I_Aux_ESS1_1: scaleProcess(other10Data.AuxM3[408078], 0.01, 2) || 0,
        P_Aux_ESS1_1: scaleProcess(other10Data.AuxM3[408079], 0.1, 1) || 0,
        E_Aux_ESS1_1:
          Calculate_CPM10_energy(
            other10Data.AuxM3[408080],
            other10Data.AuxM3[408081],
            other10Data.AuxM3[408082]
          ) || 0,

        V_Aux_ESS2_1: scaleProcess(other10Data.AuxM5[408077], 0.1, 1),
        I_Aux_ESS2_1: scaleProcess(other10Data.AuxM5[408078], 0.01, 2),
        P_Aux_ESS2_1: scaleProcess(other10Data.AuxM5[408079], 0.1, 1),
        E_Aux_ESS2_1: Calculate_CPM10_energy(
          other10Data.AuxM5[408080],
          other10Data.AuxM5[408081],
          other10Data.AuxM5[408082]
        ),

        V_Aux_ESS3_1: scaleProcess(other10Data.AuxM7[408077], 0.1, 1),
        I_Aux_ESS3_1: scaleProcess(other10Data.AuxM7[408078], 0.01, 2),
        P_Aux_ESS3_1: scaleProcess(other10Data.AuxM7[408079], 0.1, 1),
        E_Aux_ESS3_1: Calculate_CPM10_energy(
          other10Data.AuxM7[408080],
          other10Data.AuxM7[408081],
          other10Data.AuxM7[408082]
        ),

        V_Aux_ESS4: scaleProcess(other10Data.AuxM9[408077], 0.1, 1),
        I_Aux_ESS4: scaleProcess(other10Data.AuxM9[408078], 0.01, 2),
        P_Aux_ESS4: scaleProcess(other10Data.AuxM9[408079], 0.1, 1),
        E_Aux_ESS4: Calculate_CPM10_energy(
          other10Data.AuxM9[408080],
          other10Data.AuxM9[408081],
          other10Data.AuxM9[408082]
        ),

        V_Aux_total: scaleProcess(other10Data.AuxMtot1[408069], 0.1, 1),
        I_Aux_total: scaleProcess(other10Data.AuxMtot1[408071], 0.001, 2),
        P_Aux_total: scaleProcess(other10Data.AuxMtot1[408073], 0.001, 1),
        E_Aux_total: scaleProcess(other10Data.AuxMtot1[408075], 0.1, 1),

        V_Aux_ESS1_2: scaleProcess(other10Data.AuxM4[408077], 0.1, 1),
        I_Aux_ESS1_2: scaleProcess(other10Data.AuxM4[408078], 0.01, 2),
        P_Aux_ESS1_2: scaleProcess(other10Data.AuxM4[408079], 0.1, 1),
        E_Aux_ESS1_2: Calculate_CPM10_energy(
          other10Data.AuxM4[408080],
          other10Data.AuxM4[408081],
          other10Data.AuxM4[408082]
        ),

        V_Aux_ESS2_2: scaleProcess(other10Data.AuxM6[408077], 0.1, 1),
        I_Aux_ESS2_2: scaleProcess(other10Data.AuxM6[408078], 0.01, 2),
        P_Aux_ESS2_2: scaleProcess(other10Data.AuxM6[408079], 0.1, 1),
        E_Aux_ESS2_2: Calculate_CPM10_energy(
          other10Data.AuxM6[408080],
          other10Data.AuxM6[408081],
          other10Data.AuxM6[408082]
        ),

        V_Aux_ESS3_2: scaleProcess(other10Data.AuxM8[408077], 0.1, 1),
        I_Aux_ESS3_2: scaleProcess(other10Data.AuxM8[408078], 0.01, 2),
        P_Aux_ESS3_2: scaleProcess(other10Data.AuxM8[408079], 0.1, 1),
        E_Aux_ESS3_2: Calculate_CPM10_energy(
          other10Data.AuxM8[408080],
          other10Data.AuxM8[408081],
          other10Data.AuxM8[408082]
        ),

        V_Aux_CtrlRoom: scaleProcess(other10Data.AuxM1[408077], 0.1, 1),
        I_Aux_CtrlRoom: scaleProcess(other10Data.AuxM1[408078], 0.01, 2),
        P_Aux_CtrlRoom: scaleProcess(other10Data.AuxM1[408079], 0.1, 1),
        E_Aux_CtrlRoom: Calculate_CPM10_energy(
          other10Data.AuxM1[408080],
          other10Data.AuxM1[408081],
          other10Data.AuxM1[408082]
        ),
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
