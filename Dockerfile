# 使用本地的 Node.js 基底映像
FROM my-local-node:20.10.0

# 設定容器的工作目錄
WORKDIR /usr/src/app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製應用程式相關資源到容器內
COPY public public
COPY router router
COPY Set_SOC_ref Set_SOC_ref
COPY views views

# 將 start.sh 複製到容器內
COPY router/start.sh /usr/src/app/router/start.sh
WORKDIR /usr/src/app/router

# 確保 start.sh 有執行權限
RUN chmod +x /usr/src/app/router/start.sh

# 設定容器啟動時的執行指令
CMD ["/bin/bash", "/usr/src/app/router/start.sh"]
