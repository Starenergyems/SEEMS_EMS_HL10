const port = 3001;

// testforalarm.js
const express = require("express");
const path = require("path");
const nano = require("nano")("http://admin:ems45877096@192.168.8.101:5984");
const methodOverride = require("method-override");
const router = express.Router();
const app = express();
const cors = require("cors");
const {
  LC_error_result_gen,
  DC_error_result_gen,
  Other_error_result_gen,
  compare_trigger_alarms,
  update_trigger_alarms_batch,
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
  const mangoQuery_latest_rawdata = {
    selector: {
      time: { $exists: true },
    },
    sort: [{ time: "desc" }],
    limit: 1,
  };

  const lc_alarm_promise = new Promise((resolve, reject) => {
    lc1nanoDb.find(mangoQuery_latest_rawdata)
      .then((response) => {
        const db_name = lc1nanoDb["config"]["db"];
        const item = response.docs[0];
        // console.log(item);
        const error_result = LC_error_result_gen(item, db_name);
        // console.log(error_result);
  
        alarm_test_nanoDb.list()
          .then((body) => {
            return alarm_test_nanoDb.find({ selector: {db_name: db_name, recover: { $exists: true, $eq: false }, }, limit: body.total_rows })
          })
          .then((response) => {

            const compare_result = compare_trigger_alarms(error_result, response);
            console.log(compare_result);
            const alarm_db_promise = update_trigger_alarms_batch(error_result, compare_result, alarm_test_nanoDb, line_flag=false);
            
            const hisAlarm_batch = Object.values(error_result).map(obj => {
              // Create a shallow copy of the object and modify the copy
              const newObj = { ...obj };
              delete newObj["_id"];
              return newObj;
            });
            const hisalarm_db_promise = hisalarmnanoDb.bulk({docs: hisAlarm_batch})
            
            console.log([alarm_db_promise, hisalarm_db_promise]);
            Promise.all([alarm_db_promise, hisalarm_db_promise])
              .then(() => {
                  console.log("alarm_db_promise and hisalarm_db_promise: Suc!");
              })
              .catch(err => {
                  console.error('Error in alarm_db_promise and hisalarm_db_promise:', err);
              });
          })
        })
      .catch(err => {
        if (err.statusCode === 404) {
            console.error('Data not found in alarm_promise:', err.request.data);
        } else if (err.statusCode === 409) {
            console.error('Error update conflict alarm_promise:', err.request.data)
        } else {
            console.error('Error checking alarm_promise:', err.request.data);
        }
      })
  })
  
  dcnanoDb
    .find(mangoQuery_latest_rawdata)
    .then((response) => {
      const db_name = dcnanoDb["config"]["db"];
      const item = response.docs[0];
      // console.log(item);
      const error_result = DC_error_result_gen(item, db_name);
      // console.log(error_result);

      alarm_test_nanoDb.list()
        .then((body) => {
          return alarm_test_nanoDb.find({ selector: {db_name: db_name, recover: { $exists: true, $eq: false }, }, limit: body.total_rows })
        })
        .then((response) => {
          const compare_result = compare_trigger_alarms(error_result, response);
          console.log(compare_result);
          update_trigger_alarms_batch(error_result, compare_result, alarm_test_nanoDb, line_flag=false);
          
          const hisAlarm_batch = Object.values(error_result).map(obj => {
            // Create a shallow copy of the object and modify the copy
            const newObj = { ...obj };
            delete newObj["_id"];
            return newObj;
          });
          hisalarmnanoDb.bulk({docs: hisAlarm_batch})
          .catch(err => {
            if (err.statusCode === 404) {
                console.error('Data not found in update_trigger_alarms:', err.request.data);
            } else if (err.statusCode === 409) {
                console.error('Error update conflict update_trigger_alarms flag:', err.request.data)
            } else {
                console.error('Error checking update_trigger_alarms flag:', err.request.data);
            }
          })
        })
        .catch((err) => {
            console.error("Error with mangoQuery_latest_rawdata:", err);        
        });
    })
    .catch((err) => {
        console.error("Error with mangoQuery_latest_rawdata:", err);
    });
  
  otherrf10nanoDb
    .find(mangoQuery_latest_rawdata)
    .then((response) => {
      const db_name = otherrf10nanoDb["config"]["db"];
      const item = response.docs[0];
      // console.log(item);
      const error_result = Other_error_result_gen(item, db_name);
      // console.log(error_result);

      alarm_test_nanoDb.list()
        .then((body) => {
          return alarm_test_nanoDb.find({ selector: {db_name: db_name, recover: { $exists: true, $eq: false }, }, limit: body.total_rows })
        })
        .then((response) => {
          const compare_result = compare_trigger_alarms(error_result, response);
          console.log(compare_result);
          update_trigger_alarms_batch(error_result, compare_result, alarm_test_nanoDb, line_flag=false);
          
          const hisAlarm_batch = Object.values(error_result).map(obj => {
            // Create a shallow copy of the object and modify the copy
            const newObj = { ...obj };
            delete newObj["_id"];
            return newObj;
          });
          hisalarmnanoDb.bulk({docs: hisAlarm_batch})
          .catch(err => {
            if (err.statusCode === 404) {
                console.error('Data not found in update_trigger_alarms:', err.request.data);
            } else if (err.statusCode === 409) {
                console.error('Error update conflict update_trigger_alarms flag:', err.request.data)
            } else {
                console.error('Error checking update_trigger_alarms flag:', err.request.data);
            }
          })
        })
        .catch((err) => {
            console.error("Error with mangoQuery_latest_rawdata:", err);        
        });
    })
    .catch((err) => {
        console.error("Error with mangoQuery_latest_rawdata:", err);
    });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).send("Internal Server Error");
  // }
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
    .catch(err => {
      if (err.statusCode === 404) {
          console.error('Data not found in /alarm/realtime/edit:', err.request.data);
      } else {
          console.error('Error checking /alarm/realtime/edit:', err);
      }
    })
  });

app.get("/alarm/history", (req, res) => {
  // num與fun
  res.render("Alm_History");
});

module.exports = router;

app.listen(port, () => {
  console.log(`應用程式正在監聽端口 ${port}`);
});

//************************************* */
