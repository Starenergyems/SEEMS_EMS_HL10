const express = require("express");
const axios = require("axios");
const router = express.Router();

// Your Line Notify Token
const lineNotifyToken = "YOUR_LINE_NOTIFY_TOKEN";

// Route to trigger Line Notify
router.get("/sendLineNotify", async (req, res) => {
  try {
    // Line Notify API endpoint
    const lineNotifyEndpoint = "https://notify-api.line.me/api/notify";

    // Message to be sent
    const message = "Hello from your website!";

    // Send the notification
    await axios.post(lineNotifyEndpoint, `message=${message}`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${lineNotifyToken}`,
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Line Notify sent successfully" });
  } catch (error) {
    console.error("Error sending Line Notify:", error);
    res
      .status(500)
      .json({ success: false, message: "Error sending Line Notify" });
  }
});

module.exports = router;
