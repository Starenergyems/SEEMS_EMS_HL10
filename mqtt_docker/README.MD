# 版本

node v16.20.2
npm 8.19.4

# 架構

mqtt_docker
├── app
│ ├──
├── config
│ ├──
├── data
│ ├──
├── log
│ ├──
├── .env #環境檔
├── demoFromSeCloud #雲端提供範例
├── getDataFromDB #資料庫操作
├── getTokenAndAuth #獲得驗證的Token並進行帳號登入，並將相關資訊存放到.env
├── MosqittoConnected #測試Mosqitto連線、發布與訂閱
├── publish #發布功能
├── subscribe #訂閱功能
├── testSiteConnected #測試本機連線、發布與訂閱
├──
├── docker-compose.mqtt.yml
