// slack_api.js
const axios = require("axios");
const moment = require("moment");
require("dotenv").config();

function sendSlackNotification(doc) {
  //console.log("文件內容如下:", doc);
  // 設定顏色與標題
  let color, title;
  if (doc.recover) {
    color = "#36a64f";
    title = "✅ Recovered";
  } else if (doc.level === "Alarm") {
    color = "#FFCC00";
    title = "⚠️ Alarm";
  } else if (doc.level === "Fault") {
    color = "#FF0000";
    title = "❌ Fault";
  } else if (doc.level === "event") {
    if (doc.resourceType === "GC") {
      color = "#FF0000";
      title = "❌ Fault";
    } else {
      color = "#FFCC00";
      title = "⚠️ Alart";
    }
  }
  
  const formattedDate = moment(
    doc.recover ? doc.recover_time : doc.occurrence_time
  ).format("YYYY-MM-DD HH:mm:ss");

  const message = {
    attachments: [
      {
        color,
        title,
        fields: [
          { title: "Resource Type", value: doc.device, short: true },
          { title: "Alert Tag", value: doc.tag, short: true },
          { title: "Value", value: doc.value, short: true },
          { title: "Occurrence Time", value: formattedDate, short: true },
          {
            title: "Recover Time",
            value: doc.recover ? formattedDate : "N/A",
            short: true,
          },
          { title: "ID", value: doc._id, short: true },
          { title: "Level", value: doc.level, short: true },
          { title: "Content", value: doc.content, short: false },
        ],
        footer: "Please review the details and take any necessary actions.",
      },
    ],
  };

  return axios({
    method: "post",
    url: process.env.SLACK_WEBHOOK_URL,
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify(message),
  })
    .then((resp) => {
      console.log("Slack Notification Sent:", resp.data);
    })
    .catch((err) => {
      console.error(
        "Slack Notify Error:",
        err.message,
        err.response ? err.response.data : ""
      );
    });
}

module.exports = { sendSlackNotification };
