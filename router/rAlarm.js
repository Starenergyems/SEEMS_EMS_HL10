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
const moment = require("moment");
// const {
//   LC_error_result_gen,
//   DC_error_result_gen,
//   Other_error_result_gen,
//   GC_error_result_gen,
//   alarm_processor,
// } = require("./alarmFunctions");
//const { rejects } = require("assert");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cors());
//************************************************************* */
// const lc1nanoDb = nano.use("lc1_rf10");
// const lc2nanoDb = nano.use("lc2_rf10");
// const lc3nanoDb = nano.use("lc3_rf10");
// const lc4nanoDb = nano.use("lc4_rf10");
// const dcnanoDb = nano.use("dc_rf10");
// const gcnanoDb = nano.use("gc_rf10"); //新增

// const otherrf01nanoDb = nano.use("other_rf01");
// const otherrf10nanoDb = nano.use("other_rf10");
// const alarmnanoDb = nano.use("alarm");
// const hisalarmnanoDb = nano.use("hisalarm");
const test_alarmnanoDb = nano.use("test_alarm");
const test_hisalarmnanoDb = nano.use("test_hisalarm");

// let alarm_db_event_lock = false;
// // const alarm_test_nanoDb = nano.use("alarm_test");
// [
//   lc1nanoDb,
//   lc2nanoDb,
//   lc3nanoDb,
//   lc4nanoDb,
//   dcnanoDb,
//   gcnanoDb,
//   otherrf10nanoDb,
//   test_alarmnanoDb,
//   test_hisalarmnanoDb
// ].forEach((element) => {
//   element.get("_design/" + "rAlarm_ddoc", (err, body) => {
//     // console.log(body)
//     if (err) {
//       if (err.statusCode === 404) {
//         console.log("Design document does not exist. Creating...");
//         const indexDef_time = {
//           index: { fields: ["time"] },
//           ddoc: "rAlarm_ddoc",
//           name: "time_index",
//         };
//         element.createIndex(indexDef_time);
//       } else {
//         console.error("Error:", err);
//       }
//     // } else {
//     //   console.log("Design document exists:", Object.keys(body.views));
//      }
//   });
// });

// ////////////////////////////////////////////////////////////////////////////////////
// //原始
// function alarmdb_create_index() {
//   return new Promise((resolve, reject) => {
//     Promise.resolve("Design document does not exist. Creating...")
//       .then(() => {
//         const indexDef_read = {
//           index: { fields: ["read"] },
//           ddoc: "rAlarm_ddoc",
//           name: "read_index",
//         };
//         return alarmnanoDb.createIndex(indexDef_read);
//       })
//       .then(() => {
//         const indexDef_db_name_recover = {
//           index: { fields: ["db_name"] },
//           ddoc: "rAlarm_ddoc",
//           name: "db_name_recover_index",
//         };
//         return alarmnanoDb.createIndex(indexDef_db_name_recover);
//       })
//       .then(() => {
//         const indexDef_occurrence_time = {
//           index: { fields: ["occurrence_time"] },
//           ddoc: "rAlarm_ddoc",
//           name: "occurrence_time_index",
//         };
//         return alarmnanoDb.createIndex(indexDef_occurrence_time);
//       })
//       .then(() => {
//         resolve("Resolved alarmdb_create_index");
//         // console.log('Resolved alarmdb_create_index');
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// }

// alarmnanoDb.get("_design/" + "rAlarm_ddoc", (err, body) => {
//   if (err) {
//     if (err.statusCode === 404) {
//       let alarmdb_create_index_promise = alarmdb_create_index();
//       Promise.all([alarmdb_create_index_promise]).then((resolve, reject) =>
//         console.log(resolve, reject)
//       );
//     } else {
//       console.error("Error:", err);
//     }
//   } else if (Object.keys(body.views).length < 3) {
//     // console.log(Object.keys(body.views));
//     let alarmdb_create_index_promise = alarmdb_create_index();
//     Promise.all([alarmdb_create_index_promise]).then((resolve, reject) =>
//       console.log(resolve, reject)
//     );
//   } 
//   // else {
//   //   console.log("alarmnanoDb Design document exists:", Object.keys(body.views));
//   // }
// });

// hisalarmnanoDb.get("_design/" + "rAlarm_ddoc", (err, body) => {
//   if (err) {
//     if (err.statusCode === 404) {
//       console.log("Design document does not exist. Creating...");
//       const indexDef_occurrence_time = {
//         index: { fields: ["occurrence_time"] },
//         ddoc: "rAlarm_ddoc",
//         name: "occurrence_time_index",
//       };
//       hisalarmnanoDb.createIndex(indexDef_occurrence_time);
//     } else {
//       console.error("Error:", err);
//     }
//   } 
//   // else {
//   //   console.log(
//   //     "hisalarmnanoDb Design document exists:",
//   //     Object.keys(body.views)
//   //   );
//   // }
// });
// ////////////////////////////////////////////////////////////////////////////////////
// //test index
// function create_test_alarmdb_index() {
//   return new Promise((resolve, reject) => {
//     Promise.resolve("Design document does not exist. Creating...")
//       .then(() => {
//         const indexDef_read = {
//           index: { fields: ["read"] },
//           ddoc: "rAlarm_ddoc",
//           name: "read_index",
//         };
//         return test_alarmnanoDb.createIndex(indexDef_read);
//       })
//       .then(() => {
//         const indexDef_db_name_recover = {
//           index: { fields: ["db_name"] },
//           ddoc: "rAlarm_ddoc",
//           name: "db_name_recover_index",
//         };
//         return test_alarmnanoDb.createIndex(indexDef_db_name_recover);
//       })
//       .then(() => {
//         const indexDef_occurrence_time = {
//           index: { fields: ["occurrence_time"] },
//           ddoc: "rAlarm_ddoc",
//           name: "occurrence_time_index",
//         };
//         return test_alarmnanoDb.createIndex(indexDef_occurrence_time);
//       })
//       .then(() => {
//         //resolve("Resolved create_test_alarmdb_index");
//         // console.log('Resolved create_test_alarmdb_index');
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// }

// test_alarmnanoDb.get("_design/" + "rAlarm_ddoc", (err, body) => {
//   if (err) {
//     if (err.statusCode === 404) {
//       let create_test_alarmdb_index_promise = create_test_alarmdb_index();
//       Promise.all([create_test_alarmdb_index_promise]).then((resolve, reject) =>
//         console.log(resolve, reject)
//       );
//     } else {
//       console.error("Error:", err);
//     }
//   } else if (Object.keys(body.views).length < 3) {
//     // console.log(Object.keys(body.views));
//     let create_test_alarmdb_index_promise = create_test_alarmdb_index();
//     Promise.all([create_test_alarmdb_index_promise]).then((resolve, reject) =>
//       console.log(resolve, reject)
//     );
//   } 
//   // else {
//   //   console.log("test_alarmnanoDb Design document exists:", Object.keys(body.views));
//   // }
// });

// test_hisalarmnanoDb.get("_design/" + "rAlarm_ddoc", (err, body) => {
//   if (err) {
//     if (err.statusCode === 404) {
//       console.log("Design document does not exist. Creating...");
//       const indexDef_occurrence_time = {
//         index: { fields: ["occurrence_time"] },
//         ddoc: "rAlarm_ddoc",
//         name: "occurrence_time_index",
//       };
//       test_hisalarmnanoDb.createIndex(indexDef_occurrence_time);
//     } else {
//       console.error("Error:", err);
//     }
//   } 
//   // else {
//   //   console.log(
//   //     "test_hisalarmnanoDb Design document exists:",
//   //     Object.keys(body.views)
//   //   );
//   // }
// });

////////////////////////////////////////////////////////////////////////////////////

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, "../public")));

////////////////////////////////////////////////////////////////////////////////////
//即時告警
router.get("/alarm", (req, res) => {
  res.redirect("/alarm/realtime");
});

router.get("/alarm/realtime", (req, res) => {
  // num與fun
  let permission = req.body.permission;
  res.render("Alm_RealTime",{permission:permission});
});

//原本的
// router.post("/alarm/realtime/edit", (req, res) => {
//   alarm_db_event_lock = true;

//   let promise = true;
//   try {
//     const { ID, Checked } = req.body;
//     // console.log("Received ID:", ID);
//     // console.log("read:", Checked);

//     const read = Checked === "true";
//     // console.log(read)
//     //全部已讀
//     if (ID === "all") {
//       promise = alarmnanoDb
//         .list()
//         .then((body) => {
//           return alarmnanoDb.find({
//             selector: { read: { $exists: true, $eq: false } },
//             limit: body.total_rows,
//             use_index: ["rAlarm_ddoc", "read_index"],
//           });
//         })
//         .then((resp) => {
//           // console.log(resp.docs);
//           let docs_batch = resp.docs.map((element) => {
//             element.read = read;
//             if (element.recover && element.read) {
//               element._deleted = true;
//             }
//             return element;
//           });
//           return alarmnanoDb.bulk({ docs: docs_batch });
//         })
//         .catch((err) => {
//           if (err.statusCode === 404) {
//             console.error(
//               "Data not found in update_trigger_alarms:",
//               err.request.data
//             );
//           } else if (err.statusCode === 409) {
//             console.error(
//               "Error update conflict update_trigger_alarms flag:",
//               err.request.data
//             );
//           } else {
//             console.error("Error checking update_trigger_alarms flag:", err);
//           }
//         });
//     }
//     //單一已讀 
//     else {
//       promise = alarmnanoDb
//         .get(ID)
//         .then((resp) => {
//           resp.read = read;
//           // console.log(resp);
//           if (resp.recover && resp.read) {
//             return alarmnanoDb.destroy(resp._id, resp._rev);
//           } else {
//             // console.log(resp);
//             return alarmnanoDb.insert(resp);
//           }
//         })
//         .catch((err) => {
//           if (err.statusCode === 404) {
//             console.error(
//               "Data not found in /alarm/realtime/edit:",
//               err.request.data
//             );
//           } else {
//             console.error("Error checking /alarm/realtime/edit:", err);
//           }
//         });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("伺服器錯誤");
//   } finally {
//     // console.log(promise);
//     promise
//       .then(() => {
//         alarm_db_event_lock = false;
//         // setTimeout(() => {
//         //   alarm_db_event_lock = false;
//         // }, 1000);
//         console.log("/alarm/realtime/edit post: Suc!");
//         res.status(200).send("資料庫已更新"); //資料庫修改刪除完後再執行這行
//       })
//       .catch((error) => {
//         console.error("Promise rejected:", error);
//       });
//   }
// });

// //傳數值到前端的表格中
// router.get("/alarm/realtime/edit", (req, res) => {
//   Promise.resolve("Init")
//     .then(() => {
//       alarmnanoDb
//         .list()
//         .then((body) => {
//           // console.log(body);
//           return alarmnanoDb.find({
//             selector: {
//               occurrence_time: { $exists: true },
//               $or: [
//                 { read: { $exists: true, $eq: false } },
//                 { recover: { $exists: true, $eq: false } },
//               ],
//             },
//             fields: [
//               "_id",
//               "time",
//               "location",
//               "device",
//               "level",
//               "content",
//               "value",
//               "read",
//               "recover",
//               "recover_time",
//               "occurrence_time",
//             ],
//             sort: [{ occurrence_time: "desc" }],
//             limit: body.total_rows,
//             use_index: ["rAlarm_ddoc", "occurrence_time_index"],
//           });
//         })
//         .then((resp) => {
//           let alarm_db_array = [];
//           // let alarm_db_array_read = [];

//           for (const item of resp.docs) {
//             // console.log(item);
//             // ["_rev", "time", "db_name", "value"].forEach((key) => {
//             //   delete item[key];
//             // });
//             //時間格式修改
//             item["index"] = "";

//             const formattedTime = moment(item.time).format(
//               "YYYY/MM/DD HH:mm:ss:SSS"
//             );
//             item.time = formattedTime;
//             if (item.recover_time !== "") {
//               const formattedrecover_time = moment(item.recover_time).format(
//                 "YYYY/MM/DD HH:mm:ss:SSS"
//               );
//               item.recover_time = formattedrecover_time;
//             }
//             if (item.occurrence_time !== "") {
//               const formattedOccurrenceTime = moment(
//                 item.occurrence_time
//               ).format("YYYY/MM/DD HH:mm:ss:SSS");
//               item.occurrence_time = formattedOccurrenceTime;
//             }

//             alarm_db_array.push(item);
//             // if (item.read) {
//             //   alarm_db_array_read.push(item);
//             // } else {
//             // }
//           }
//           // console.log("alarm_db_array");
//           // console.log(alarm_db_array);
//           // res.send([...alarm_db_array, ...alarm_db_array_read]);
//           res.send(alarm_db_array);
//         });
//     })
//     .catch((err) => {
//       if (err.statusCode === 404) {
//         console.error(
//           "Data not found in /alarm/realtime/edit:",
//           err.request.data
//         );
//       } else {
//         console.error("Error checking /alarm/realtime/edit:", err);
//       }
//     });
//   // } catch (error) {
//   //   console.error(error);
//   //   res.status(500).send("Internal Server Error");
//   // }
// });

//新資料庫
router.post("/alarm/realtime/edit", (req, res) => {
  alarm_db_event_lock = true;

  let promise = true;
  try {
    const { ID, Checked } = req.body;
    // console.log("Received ID:", ID);
    // console.log("read:", Checked);

    const read = Checked === "true";
    // console.log(read)
    //全部已讀
    if (ID === "all") {
      promise = test_alarmnanoDb
        .list()
        .then((body) => {
          return test_alarmnanoDb.find({
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
          return test_alarmnanoDb.bulk({ docs: docs_batch });
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
    }
    //單一已讀 
    else {
      promise = test_alarmnanoDb
        .get(ID)
        .then((resp) => {
          resp.read = read;
          // console.log(resp);
          if (resp.recover && resp.read) {
            return test_alarmnanoDb.destroy(resp._id, resp._rev);
          } else {
            // console.log(resp);
            return test_alarmnanoDb.insert(resp);
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
      test_alarmnanoDb
        .list()
        .then((body) => {
          // console.log(body);
          return test_alarmnanoDb.find({
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
          // let alarm_db_array_read = [];

          for (const item of resp.docs) {
            // console.log(item);
            // ["_rev", "time", "db_name", "value"].forEach((key) => {
            //   delete item[key];
            // });
            //時間格式修改
            item["index"] = "";

            const formattedTime = moment(item.occurrence_time).format(
              "YYYY/MM/DD HH:mm:ss:SSS"
            );
            item.time = formattedTime;
            if (item.recover_time !== "") {
              const formattedrecover_time = moment(item.recover_time).format(
                "YYYY/MM/DD HH:mm:ss:SSS"
              );
              item.recover_time = formattedrecover_time;
            }
            if (item.occurrence_time !== "") {
              const formattedOccurrenceTime = moment(
                item.occurrence_time
              ).format("YYYY/MM/DD HH:mm:ss:SSS");
              item.occurrence_time = formattedOccurrenceTime;
            }

            alarm_db_array.push(item);
            // if (item.read) {
            //   alarm_db_array_read.push(item);
            // } else {
            // }
          }
          // console.log("alarm_db_array");
          // console.log(alarm_db_array);
          // res.send([...alarm_db_array, ...alarm_db_array_read]);
          res.send(alarm_db_array);
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

/********************************************************** */
//歷史告警
router.get("/alarm/history", (req, res) => {
  // num與fun
  let permission = req.body.permission;
  res.render("Alm_History", {permission:permission});
});

//原始版本
// router.get("/alarm/history/edit", (req, res) => {
//   const From_date = new Date().toISOString().split("T")[0]; // From_date set to today's date;
//   const To_date = new Date().toISOString(); // To_date set to current date and time

//   const From_datetime = From_date + "T00:00:00+08:00"; //預設讀取今天到現在
//   const To_datetime = To_date.slice(0, 19) + "+08:00"; //
//   console.log(From_datetime, To_datetime);

//   Promise.resolve("Init")
//     .then(() => {
//       return hisalarmnanoDb.find({
//         selector: {
//           occurrence_time: {
//             $exists: true,
//             $gte: From_datetime,
//             $lte: To_datetime,
//           },
//         },
//         fields: [
//           "location",
//           "device",
//           "level",
//           "content",
//           "value",
//           "read",
//           "recover",
//           "recover_time",
//           "occurrence_time",
//         ],
//         sort: [{ occurrence_time: "desc" }],
//         limit: 1000,
//         use_index: ["rAlarm_ddoc", "occurrence_time_index"],
//       });
//     })
//     .then((resp) => {
//       // console.log(resp);
//       var hisalarm_db_array = [];

//       for (const item of resp.docs) {
//         item["index"] = "";

//         const formattedTime = moment(item.time).format(
//           "YYYY/MM/DD HH:mm:ss:SSS"
//         );
//         item.time = formattedTime;
//         if (item.recover_time !== "") {
//           const formattedrecover_time = moment(item.recover_time).format(
//             "YYYY/MM/DD HH:mm:ss:SSS"
//           );
//           item.recover_time = formattedrecover_time;
//         }
//         if (item.occurrence_time !== "") {
//           const formattedOccurrenceTime = moment(item.occurrence_time).format(
//             "YYYY/MM/DD HH:mm:ss:SSS"
//           );
//           item.occurrence_time = formattedOccurrenceTime;
//         }
//         hisalarm_db_array.push(item);
//       }
//       // console.log("alarm_db_array");
//       //console.log(hisalarm_db_array);
//       res.send(hisalarm_db_array);
//     })
//     .catch((err) => {
//       if (err.statusCode === 404) {
//         console.error(
//           "Data not found in /alarm/history/edit:",
//           err.request.data
//         );
//       } else {
//         console.error("Error checking /alarm/history/edit:", err);
//       }
//     });
// });

// router.post("/alarm/history/edit", (req, res) => {
//   const { input1, input2, input3, input4 } = req.body;
//   const From_date = input1;
//   const From_time = input2;
//   const To_date = input3;
//   const To_time = input4;

//   const From_datetime = From_date + "T" + From_time + "+08:00";
//   const To_datetime = To_date + "T" + To_time + "+08:00";
//   console.log(From_datetime, To_datetime);

//   Promise.resolve("Init")
//     .then(() => {
//       return hisalarmnanoDb.find({
//         selector: {
//           occurrence_time: {
//             $exists: true,
//             $gte: From_datetime,
//             $lte: To_datetime,
//           },
//         },
//         fields: [
//           "location",
//           "device",
//           "level",
//           "content",
//           "value",
//           "read",
//           "recover",
//           "recover_time",
//           "occurrence_time",
//         ],
//         sort: [{ occurrence_time: "desc" }],
//         limit: 1000,
//         use_index: ["rAlarm_ddoc", "occurrence_time_index"],
//       });
//     })
//     .then((resp) => {
//       // console.log(resp);
//       var hisalarm_db_array = [];

//       for (const item of resp.docs) {
//         item["index"] = "";
//         hisalarm_db_array.push(item);
//         const formattedTime = moment(item.time).format(
//           "YYYY/MM/DD HH:mm:ss:SSS"
//         );
//         item.time = formattedTime;
//         if (item.recover_time !== "") {
//           const formattedrecover_time = moment(item.recover_time).format(
//             "YYYY/MM/DD HH:mm:ss:SSS"
//           );
//           item.recover_time = formattedrecover_time;
//         }
//         if (item.occurrence_time !== "") {
//           const formattedOccurrenceTime = moment(item.occurrence_time).format(
//             "YYYY/MM/DD HH:mm:ss:SSS"
//           );
//           item.occurrence_time = formattedOccurrenceTime;
//         }
//       }
//       // console.log("alarm_db_array");
//       // console.log(hisalarm_db_array);
//       res.send(hisalarm_db_array);
//     })
//     .catch((err) => {
//       if (err.statusCode === 404) {
//         console.error(
//           "Data not found in /alarm/history/edit:",
//           err.request.data
//         );
//       } else {
//         console.error("Error checking /alarm/history/edit:", err);
//       }
//     });
// });

router.get("/alarm/history/edit", (req, res) => {
  const From_date = new Date().toISOString().split("T")[0]; // From_date set to today's date;
  const To_date = new Date().toISOString(); // To_date set to current date and time

  const From_datetime = From_date + "T00:00:00+08:00"; //預設讀取今天到現在
  const To_datetime = To_date.slice(0, 19) + "+08:00"; //
  console.log(From_datetime, To_datetime);

  Promise.resolve("Init")
    .then(() => {
      return test_hisalarmnanoDb.find({
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
      var hisalarm_db_array = [];

      for (const item of resp.docs) {
        item["index"] = "";

        const formattedTime = moment(item.time).format(
          "YYYY/MM/DD HH:mm:ss:SSS"
        );
        item.time = formattedTime;
        if (item.recover_time !== "") {
          const formattedrecover_time = moment(item.recover_time).format(
            "YYYY/MM/DD HH:mm:ss:SSS"
          );
          item.recover_time = formattedrecover_time;
        }
        if (item.occurrence_time !== "") {
          const formattedOccurrenceTime = moment(item.occurrence_time).format(
            "YYYY/MM/DD HH:mm:ss:SSS"
          );
          item.occurrence_time = formattedOccurrenceTime;
        }
        hisalarm_db_array.push(item);
      }
      // console.log("alarm_db_array");
      //console.log(hisalarm_db_array);
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

router.post("/alarm/history/edit", (req, res) => {
  const { input1, input2, input3, input4 } = req.body;
  const From_date = input1;
  const From_time = input2;
  const To_date = input3;
  const To_time = input4;

  const From_datetime = From_date + "T" + From_time + "+08:00";
  const To_datetime = To_date + "T" + To_time + "+08:00";
  console.log(From_datetime, To_datetime);

  Promise.resolve("Init")
    .then(() => {
      return test_hisalarmnanoDb.find({
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
      var hisalarm_db_array = [];

      for (const item of resp.docs) {
        item["index"] = "";
        hisalarm_db_array.push(item);
        const formattedTime = moment(item.time).format(
          "YYYY/MM/DD HH:mm:ss:SSS"
        );
        item.time = formattedTime;
        if (item.recover_time !== "") {
          const formattedrecover_time = moment(item.recover_time).format(
            "YYYY/MM/DD HH:mm:ss:SSS"
          );
          item.recover_time = formattedrecover_time;
        }
        if (item.occurrence_time !== "") {
          const formattedOccurrenceTime = moment(item.occurrence_time).format(
            "YYYY/MM/DD HH:mm:ss:SSS"
          );
          item.occurrence_time = formattedOccurrenceTime;
        }
      }
      // console.log("alarm_db_array");
      // console.log(hisalarm_db_array);
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


//告警內容判斷執行
// function alarm_processor_call() {
//   // alarm_db_event_lock = true;
//   // while (alarm_db_event_lock) {
//   //   // console.log("a")
//   //   setTimeout(()=>{console.log("Hi")}, 3000);
//   //   // console.log("b")
//   //   console.log('a')
//   //   // await new Promise(resolve => setTimeout(resolve, 3000));  // Wait for a short time
//   //   // console.log('b')
//   // }
//   // console.log("alarm_processor_call", alarm_db_event_lock)
//   if (!alarm_db_event_lock) {
//     const mangoQuery_latest_rawdata = {
//       selector: {
//         time: { $exists: true },
//       },
//       sort: [{ time: "desc" }],
//       limit: 1,
//       use_index: ["rAlarm_ddoc", "time_index"],
//     };

//     const lc1_alarm_promise = alarm_processor(
//       lc1nanoDb,
//       mangoQuery_latest_rawdata,
//       LC_error_result_gen,
//       alarmnanoDb,
//       hisalarmnanoDb
//     );
//     const lc2_alarm_promise = alarm_processor(
//       lc2nanoDb,
//       mangoQuery_latest_rawdata,
//       LC_error_result_gen,
//       alarmnanoDb,
//       hisalarmnanoDb
//     );
//     const lc3_alarm_promise = alarm_processor(
//       lc3nanoDb,
//       mangoQuery_latest_rawdata,
//       LC_error_result_gen,
//       alarmnanoDb,
//       hisalarmnanoDb
//     );
//     const lc4_alarm_promise = alarm_processor(
//       lc4nanoDb,
//       mangoQuery_latest_rawdata,
//       LC_error_result_gen,
//       alarmnanoDb,
//       hisalarmnanoDb
//     );

//     const dc_alarm_promise = alarm_processor(
//       dcnanoDb,
//       mangoQuery_latest_rawdata,
//       DC_error_result_gen,
//       alarmnanoDb,
//       hisalarmnanoDb
//     );

//     const other_alarm_promise = alarm_processor(
//       otherrf10nanoDb,
//       mangoQuery_latest_rawdata,
//       Other_error_result_gen,
//       alarmnanoDb,
//       hisalarmnanoDb
//     );

//     const gc_alarm_promise = alarm_processor(
//       gcnanoDb,
//       mangoQuery_latest_rawdata,
//       GC_error_result_gen,
//       alarmnanoDb,
//       hisalarmnanoDb
//     );

//     Promise.all([
//       lc1_alarm_promise,
//       lc2_alarm_promise,
//       lc3_alarm_promise,
//       lc4_alarm_promise,
//       dc_alarm_promise,
//       other_alarm_promise,
//       gc_alarm_promise,
//     ])
//       // .then(() => {
//       //   console.log("All alarm_processor: Suc!");
//       // })
//       .catch((error) => {
//         console.log(error);
//       });
//   }
// }
// // Set up the interval to make the API call regularly
// setInterval(alarm_processor_call, 3000);

module.exports = router;

// app.listen(port, () => {
//   console.log(`應用程式正在監聽端口 ${port}`);
// });

//************************************* */
