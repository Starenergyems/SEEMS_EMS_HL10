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

const test_alarmnanoDb = nano.use("alarm");
const test_hisalarmnanoDb = nano.use("alarm_his");

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
  res.render("Alm_RealTime", { permission: permission });
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
          for (const item of resp.docs) {
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
          }

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
  res.render("Alm_History", { permission: permission });
});

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

module.exports = router;
