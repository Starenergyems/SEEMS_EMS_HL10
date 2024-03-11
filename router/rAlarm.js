// testforalarm.js
const express = require("express");
const path = require("path");
const config = require("./config");
const couchdbConfig = config.database;
const nano = require("nano")(
  `http://${couchdbConfig.username}:${couchdbConfig.password}@${couchdbConfig.host}:${couchdbConfig.port}`
);
const methodOverride = require("method-override");
const router = express.Router();
const app = express();
const cors = require("cors");

const {
  LC_error_result_gen,
  DC_error_result_gen,
  Other_error_result_gen,
  alarm_processor,
} = require("./alarmFunctions");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cors());
//************************************************************* */
const lc1nanoDb = nano.use("lc1_rf10");
const lc2nanoDb = nano.use("lc2_rf10");
const lc3nanoDb = nano.use("lc3_rf10");
const lc4nanoDb = nano.use("lc4_rf10");
const dcnanoDb = nano.use("dc_rf10");
const gcnanoDb = nano.use("gc_rf10"); //新增
const otherrf01nanoDb = nano.use("other_rf01");
const otherrf10nanoDb = nano.use("other_rf10");
const alarmnanoDb = nano.use("alarm");
const hisalarmnanoDb = nano.use("hisalarm");

let alarm_db_event_lock = false;
// const alarm_test_nanoDb = nano.use("alarm_test");

const indexDef_time = {
  index: { fields: ["time"] },
  ddoc: "time_index",
};
[
  lc1nanoDb,
  lc2nanoDb,
  lc3nanoDb,
  lc4nanoDb,
  dcnanoDb,
  gcnanoDb,
  otherrf10nanoDb,
].forEach((element) => element.createIndex(indexDef_time));

const indexDef_read = {
  index: { fields: ["read"] },
  ddoc: "rAlarm_ddoc",
  name: "read_index"
};
alarmnanoDb.createIndex(indexDef_read);

const indexDef_db_name_recover = {
  index: { fields: ["db_name"] },
  ddoc: "rAlarm_ddoc",
  name: "db_name_recover_index"
};
alarmnanoDb.createIndex(indexDef_db_name_recover);

const indexDef_occurrence_time = {
  index: { fields: ["occurrence_time"] },
  ddoc: "rAlarm_ddoc",
  name: "occurrence_time_index"
};
alarmnanoDb.createIndex(indexDef_occurrence_time);
hisalarmnanoDb.createIndex(indexDef_occurrence_time);
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

//////////////////////////////////////
//告警紀錄
router.get("/alarm", (req, res) => {
  res.render("Alm_RealTime");
});

router.get("/alarm/realtime", (req, res) => {
  // num與fun
  res.render("Alm_RealTime");
});

router.post("/alarm/realtime/edit", (req, res) => {
  alarm_db_event_lock = true;

  let promise = true;
  try {
    const { ID, Checked } = req.body;
    // console.log("Received ID:", ID);
    // console.log("read:", Checked);

    const read = Checked === "true";
    // console.log(read)

    if (ID === "all") {
      promise = alarmnanoDb
        .list()
        .then((body) => {
          return alarmnanoDb.find({
            selector: { read: { $exists: true, $eq: false } },
            limit: body.total_rows,
            use_index: ["rAlarm_ddoc", "read_index"],
          });
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
          return alarmnanoDb.bulk({ docs: docs_batch });
        })
        .catch((err) => {
          if (err.statusCode === 404) {
            console.error(
              "Data not found in update_trigger_alarms:",
              err.request.data
            );
          } else if (err.statusCode === 409) {
            console.error(
              "Error update conflict update_trigger_alarms flag:",
              err.request.data
            );
          } else {
            console.error("Error checking update_trigger_alarms flag:", err);
          }
        });
    } else {
      promise = alarmnanoDb
        .get(ID)
        .then((resp) => {
          resp.read = read;
          // console.log(resp);
          if (resp.recover && resp.read) {
            return alarmnanoDb.destroy(resp._id, resp._rev);
          } else {
            // console.log(resp);
            return alarmnanoDb.insert(resp);
          }
        })
        .catch((err) => {
          if (err.statusCode === 404) {
            console.error(
              "Data not found in /alarm/realtime/edit:",
              err.request.data
            );
          } else {
            console.error("Error checking /alarm/realtime/edit:", err);
          }
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("伺服器錯誤");
  } finally {
    // console.log(promise);
    promise
      .then(() => {
        alarm_db_event_lock = false;
        // setTimeout(() => {
        //   alarm_db_event_lock = false;
        // }, 1000);
        console.log("/alarm/realtime/edit post: Suc!");
        res.status(200).send("資料庫已更新"); //資料庫修改刪除完後再執行這行
      })
      .catch((error) => {
        console.error("Promise rejected:", error);
      });
  }
});

//傳數值到前端的表格中
router.get("/alarm/realtime/edit", (req, res) => {
  Promise.resolve("Init")
    .then(() => {
      alarmnanoDb
        .list()
        .then((body) => {
          // console.log(body);
          return alarmnanoDb.find({
            selector: {
              occurrence_time: { $exists: true },
              $or: [
                { read: { $exists: true, $eq: false } },
                { recover: { $exists: true, $eq: false } },
              ],
            },
            fields: [
              "_id",
              "time",
              "location",
              "device",
              "level",
              "content",
              "value",
              "read",
              "recover",
              "recover_time",
              "occurrence_time",
            ],
            sort: [{ occurrence_time: "desc" }],
            limit: body.total_rows,
            use_index: ["rAlarm_ddoc", "occurrence_time_index"],
          });
        })
        .then((resp) => {
          let alarm_db_array = [];
          let alarm_db_array_read = [];

          for (const item of resp.docs) {
            // console.log(item);
            // ["_rev", "time", "db_name", "value"].forEach((key) => {
            //   delete item[key];
            // });
            item["index"] = "";
            if (item.read) {
              alarm_db_array_read.push(item);
            } else {
              alarm_db_array.push(item);
            }
          }
          // console.log("alarm_db_array");
          // console.log(alarm_db_array);
          res.send([...alarm_db_array, ...alarm_db_array_read]);
        });
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        console.error(
          "Data not found in /alarm/realtime/edit:",
          err.request.data
        );
      } else {
        console.error("Error checking /alarm/realtime/edit:", err);
      }
    });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).send("Internal Server Error");
  // }
});

router.get("/alarm/history", (req, res) => {
  // num與fun
  res.render("Alm_History");
});

router.get("/alarm/history/edit", (req, res) => {
  const From_date = "2024-02-22";
  const From_time = "00:00:00";
  const To_date = "2024-03-07";
  const To_time = "23:59:59";
  const From_datetime = From_date + "T" + From_time + "+08:00";
  const To_datetime = To_date + "T" + To_time + "+08:00";

  Promise.resolve("Init")
    .then(() => {
      return alarmnanoDb.find({
        selector: {
          occurrence_time: {
            $exists: true,
            $gte: From_datetime,
            $lte: To_datetime,
          },
        },
        fields: [
          "location",
          "device",
          "level",
          "content",
          "value",
          "read",
          "recover",
          "recover_time",
          "occurrence_time",
        ],
        sort: [{ occurrence_time: "desc" }],
        limit: 1000,
        use_index: ["rAlarm_ddoc", "occurrence_time_index"],
      });
    })
    .then((resp) => {
      // console.log(resp);
      let hisalarm_db_array = [];

      for (const item of resp.docs) {
        item["index"] = "";
        hisalarm_db_array.push(item);
      }
      // console.log("alarm_db_array");
      console.log(hisalarm_db_array);
      res.send(hisalarm_db_array);
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        console.error(
          "Data not found in /alarm/history/edit:",
          err.request.data
        );
      } else {
        console.error("Error checking /alarm/history/edit:", err);
      }
    });
});

function alarm_processor_call() {
  // alarm_db_event_lock = true;
  // while (alarm_db_event_lock) {
  //   // console.log("a")
  //   setTimeout(()=>{console.log("Hi")}, 3000);
  //   // console.log("b")
  //   console.log('a')
  //   // await new Promise(resolve => setTimeout(resolve, 3000));  // Wait for a short time
  //   // console.log('b')
  // }
  // console.log("alarm_processor_call", alarm_db_event_lock)

  if (!alarm_db_event_lock) {
    const mangoQuery_latest_rawdata = {
      selector: {
        time: { $exists: true },
      },
      sort: [{ time: "desc" }],
      limit: 1,
      // use_index: "time_index",
    };

    const lc1_alarm_promise = alarm_processor(
      lc1nanoDb,
      mangoQuery_latest_rawdata,
      LC_error_result_gen,
      alarmnanoDb,
      hisalarmnanoDb
    );
    const lc2_alarm_promise = alarm_processor(
      lc2nanoDb,
      mangoQuery_latest_rawdata,
      LC_error_result_gen,
      alarmnanoDb,
      hisalarmnanoDb
    );
    const lc3_alarm_promise = alarm_processor(
      lc3nanoDb,
      mangoQuery_latest_rawdata,
      LC_error_result_gen,
      alarmnanoDb,
      hisalarmnanoDb
    );
    const lc4_alarm_promise = alarm_processor(
      lc4nanoDb,
      mangoQuery_latest_rawdata,
      LC_error_result_gen,
      alarmnanoDb,
      hisalarmnanoDb
    );

    // console.log(lc_alarm_promise)
    // Promise.race([lc_alarm_promise]).then(() => {
    //   console.log(lc_alarm_promise)
    //   console.log("done");
    //   })

    const dc_alarm_promise = alarm_processor(
      dcnanoDb,
      mangoQuery_latest_rawdata,
      DC_error_result_gen,
      alarmnanoDb,
      hisalarmnanoDb
    );
    const other_alarm_promise = alarm_processor(otherrf10nanoDb, mangoQuery_latest_rawdata, Other_error_result_gen, alarmnanoDb, hisalarmnanoDb);

    Promise.all([
      lc1_alarm_promise,
      lc2_alarm_promise,
      lc3_alarm_promise,
      lc4_alarm_promise,
      dc_alarm_promise,
      other_alarm_promise
    ])
      .then(() => {
        console.log("All alarm_processor: Suc!");
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
// Set up the interval to make the API call regularly
setInterval(alarm_processor_call, 3000);

module.exports = router;

// app.listen(port, () => {
//   console.log(`應用程式正在監聽端口 ${port}`);
// });

//************************************* */
