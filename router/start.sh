#!/bin/bash

echo "Starting app.js in the background..."
node ./app.js 

# echo "Starting alarmFilter.js..."
# node ./alarmFilter.js

# echo "Starting getReportData.js..."
# node ./router/getReportData.js

# 保持容器運行（可選，避免容器退出）
wait
