# Nginx Tutorial

本次實作將模擬一個完整的前後端專案架構，並在 GitHub Codespaces 上部署：

1. 靜態檔案服務：使用 Nginx 提供 React App 的 HTML、CSS、JS。

2. API 反向代理：將 `/api` 開頭的 HTTP 請求轉發到後端 FastAPI。

### 功能項目

1. 靜態檔案服務

   - Nginx 直接提供 `frontend/dist` 目錄下的靜態檔案。

2. API 反向代理

   - `GET /api/health`：回傳後端健康狀態。
   - `GET /api/greet?name=…`：示範帶參數的 GET 請求。
   - `POST /api/post`：示範接收 JSON 的 POST 請求。

### 環境準備

1.  開啟 Codespace

    - 在 GitHub Repo 頁面點擊 `「Code」→「Codespaces」→「Create codespace on main」`。
    - 等待 Codespace 環境建立完成。

2.  建置前端並啟動後端服務

    打開 Codespace 的 Terminal，依序執行以下指令：

    ```bash
    cd frontend
    npm install
    npm run build
    cd ..

    nohup uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload > /dev/null 2>&1 &
    ```

    - 前端會被建置到 `/workspaces/nginx-tutorial/frontend/dist`。
    - 後端使用 `uvicorn` 啟動 FastAPI Server。

3.  Nginx 設定

    打開 `nginx/default.conf`，修改以下 TODO 處的設定

    ```bash
    server {
        listen 80 default_server;
        listen [::]:80 default_server;

        server_name _;

        # TODO: 填寫靜態檔案服務設定
        location / {

        }

        # TODO: 填寫 REST API 反向代理設定
        location /api/ {

        }
    }
    ```

    - 修改重點
      - location `/`：設定 `root` 指向靜態檔案資料夾，並用 `try_files` 支援前端路由。
      - location `/api/`：透過 `proxy_pass` 將請求轉發至 FastAPI。

4.  重載 Nginx 設定

    完成設定後，執行以下指令：

    ```bash
    sudo ln -sf /workspaces/nginx-tutorial/nginx/default.conf /etc/nginx/sites-enabled/default
    sudo nginx -t
    sudo service nginx start
    # sudo service nginx restart
    ```

### 驗證流程

1. 在 VS Code 的「Ports」分頁找到 80 Port 對應的 Forwarded Address。
2. 開啟網址（通常是 `https://<codespace-name>-80.app.github.dev/`）。
3. 功能測試

   - Health Check 應顯示 OK。
   - 測試 GET `/api/greet`。
   - 測試 POST `/api/post`。
