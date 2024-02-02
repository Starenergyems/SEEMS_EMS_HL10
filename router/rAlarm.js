const port = 3001;

// testforalarm.js
const express = require("express");
const path = require("path");
const nano = require("nano")("http://admin:ems45877096@192.168.8.101:5984");
const methodOverride = require("method-override");
const router = express.Router();
const app = express();
const cors = require("cors");
const axios = require("axios");
const {
  LC_error_result_gen,
  DC_error_result_gen,
  Other_error_result_gen,
  compare_trigger_alarms,
  update_trigger_alarms_batch,
  alarm_processor,
} = require("./alarmFunctions");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cors());

app.use(cors());

//************************************************************* */
const lc1nanoDb = nano.use("lc1_rf10");
// console.log(lc1nanoDb["config"]["db"])
const lc2nanoDb = nano.use("lc2_rf10");
const lc3nanoDb = nano.use("lc3_rf10");
const lc4nanoDb = nano.use("lc4_rf10");
const dcnanoDb = nano.use("dc_rf10");
const gcnanoDb = nano.use("gc_rf10"); //新增
const otherrf01nanoDb = nano.use("other_rf01");
const otherrf10nanoDb = nano.use("other_rf10");
const alarmnanoDb = nano.use("alarm");
const hisalarmnanoDb = nano.use("hisalarm");
const alarm_test_nanoDb = nano.use("alarm_test");

const indexDef_time = {
  index: { fields: ["time"] },
  name: "time_index",
};
[
  lc1nanoDb,
  lc2nanoDb,
  lc3nanoDb,
  lc4nanoDb,
  dcnanoDb,
  gcnanoDb,
  otherrf10nanoDb,
  alarm_test_nanoDb,
].forEach((element) => element.createIndex(indexDef_time));

const alarmDB_db_name_index = {
  index: { fields: ["db_name", "time", "read", "recover",] },
  name: "alarmDB_db_name_index",
};
alarm_test_nanoDb.createIndex(alarmDB_db_name_index);

// alarm_test_nanoDb.fetch({keys: []}).then((resp)=>console.log(resp))
// alarm_test_nanoDb.find({ selector: {} }).then((resp)=>console.log(resp))

// const alarmDB_trigger_index = {
//   index: { fields: ["trigger"] },
//   name: "alarmDB_trigger_index",
// };
// alarm_test_nanoDb.createIndex(alarmDB_trigger_index);

// // Check if the initialization flag document exists
// alarm_test_nanoDb
//   .get("init_flag")
//   .then((initFlag) => {
//     // Initialization flag document exists, do not reinitialize
//     if (initFlag.initialized) {
//       console.log("Database already initialized. Skipping initialization.");
//     } else {
//       init_Alarm_DB(alarm_test_nanoDb);
//     }
//   })
//   .catch((err) => {
//     if (err.statusCode === 404) {
//       // Initialization flag document does not exist, proceed with initialization
//       init_Alarm_DB(alarm_test_nanoDb);
//     } else {
//       // Handle other errors
//       console.error("Error checking initialization flag:", err);
//     }
//   });
//************************************************************* */

//set
app.set("view engine", "ejs");
// 設定視圖目錄為 C:\Test\SEEMS_EMS\views
app.set("views", path.join(__dirname, "../views"));
//use
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));

//告警紀錄
app.get("/alarm", (req, res) => {
  res.render("Alm_RealTime");
});

// router.get("/alarm/re", async (req, res) => {
//   try {
//     // 從資料庫中獲取資料
//     const sourceData = await SourceData.find();
//     // 處理資料，這裡假設有一個處理函式 processData
//     const processedData = processData(sourceData);
//     // 將處理完的資料儲存到新的collection中
//     await ProcessedData.create(processedData);
//     // 回傳處理完的資料給前端
//     res.json(processedData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

app.get("/alarm/realtime", (req, res) => {
  // num與fun
  res.render("Alm_RealTime");
});

app.post("/alarm/realtime/edit", (req, res) => {
  try {
    const { ID, Checked } = req.body;
    console.log("Received ID:", ID);
    console.log("read:", Checked);

    const read = Checked === "true";
    // console.log(read)

    let promise = true;
    if (ID === "all") {
      promise = alarm_test_nanoDb.list()
        .then((body) => {
          return alarm_test_nanoDb.find({ selector: { read: { $exists: true, $eq: false }, }, limit: body.total_rows })
        })
        .then((resp) => {
          // console.log(resp.docs);
          let docs_batch = resp.docs.map((element) => {
            element.read = read;
            if (element.recover && element.read) {
              element._deleted = true;
            }
            return element;
          });
          return alarm_test_nanoDb.bulk({docs: docs_batch});
        })
        .catch(err => {
          if (err.statusCode === 404) {
              console.error('Data not found in update_trigger_alarms:', err.request.data);
          } else if (err.statusCode === 409) {
              console.error('Error update conflict update_trigger_alarms flag:', err.request.data)
          } else {
              console.error('Error checking update_trigger_alarms flag:', err.request.data);
          }
        })
    } else {
      promise = alarm_test_nanoDb.get(ID)
        .then((resp) => {
          resp.read = read;
          // console.log(resp);
          if (resp.recover && resp.read) {
            return alarm_test_nanoDb.destroy(resp._id, resp._rev);
          } else {
            // console.log(resp);
            return alarm_test_nanoDb.insert(resp);
          }
        })
        .catch(err => {
          if (err.statusCode === 404) {
              console.error('Data not found in /alarm/realtime/edit:', err.request.data);
          } else {
              console.error('Error checking /alarm/realtime/edit:', err);
          }
        })
    }

    console.log(promise);
    promise
      .then(() => {
        res.status(200).send("資料庫已更新"); //資料庫修改刪除完後再執行這行
      })
      .catch((error) => {
        console.error('Promise rejected:', error.message);
      });
  } catch (error) {
    console.error(error);
    res.status(500).send("伺服器錯誤");
  }
  //res.render("Alm_RealTime");
});

//傳數值到前端的表格中
app.get("/alarm/realtime/edit", (req, res) => {
  Promise.resolve('Init')
    .then(() => {
      alarm_test_nanoDb.list()
        .then((body) => {
          // console.log(body);
          return alarm_test_nanoDb.find({
            selector: {
              time: { $exists: true },
              $or: [
                { read: { $exists: true, $eq: false } },
                { recover: { $exists: true, $eq: false } }
              ]
            },
            fields: ["_id", "time", "location", "device", "level", "content", "value", "read", "recover", "recover_time", "occurrence_time"],
            sort: [{ time: "desc" }],
            limit: body.total_rows,
          })
        })
        .then((resp) => {
          const alarm_db_array = [];
          for (const item of resp.docs) {
            // console.log(item);
            // ["_rev", "time", "db_name", "value"].forEach((key) => {
            //   delete item[key];
            // });
            item["index"] = "";
            alarm_db_array.push(item);
          }
          // console.log(alarm_db_array);
          res.send(alarm_db_array);
        })
    })
    .catch(err => {
      if (err.statusCode === 404) {
          console.error('Data not found in /alarm/realtime/edit:', err.request.data);
      } else {
          console.error('Error checking /alarm/realtime/edit:', err);
      }
    })
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).send("Internal Server Error");
  // }
  });

app.get("/alarm/history", (req, res) => {
  // num與fun
  res.render("Alm_History");
});

function alarm_processor_call() {
  const mangoQuery_latest_rawdata = {
    selector: {
      time: { $exists: true },
    },
    sort: [{ time: "desc" }],
    limit: 1,
  };

  const lc_alarm_promise = alarm_processor(lc1nanoDb, mangoQuery_latest_rawdata, LC_error_result_gen, alarm_test_nanoDb, hisalarmnanoDb);
  
  // console.log(lc_alarm_promise)
  // Promise.race([lc_alarm_promise]).then(() => {
  //   console.log(lc_alarm_promise)
  //   console.log("done");
  //   })

  const dc_alarm_promise = alarm_processor(dcnanoDb, mangoQuery_latest_rawdata, DC_error_result_gen, alarm_test_nanoDb, hisalarmnanoDb);
  const other_alarm_promise = alarm_processor(otherrf10nanoDb, mangoQuery_latest_rawdata, Other_error_result_gen, alarm_test_nanoDb, hisalarmnanoDb);
  
  Promise.all([lc_alarm_promise, dc_alarm_promise, other_alarm_promise])
  .then(() => {
    console.log("All alarm_processor: Suc!");
  })
}
const interval = 10000; // 1s
// Make the initial API call
alarm_processor_call();
// Set up the interval to make the API call regularly
setInterval(alarm_processor_call, interval);

module.exports = router;

app.listen(port, () => {
  console.log(`應用程式正在監聽端口 ${port}`);
});

//************************************* */
