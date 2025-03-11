const express = require("express");
const cors = require('cors');
const requestIp = require('request-ip');
const service = express();
const { userdbConnect} = require('./config/userdbConnect');
require("dotenv").config();  // env 연결

const port = process.env.PORT || 8080;
const corsOptions = {
  origin: "http://localhost:3000", // react 링크
  credentials: true, // 클라이언트에서 쿠키를 포함한 요청을 보내도록 허용
};

service.use(cors(corsOptions)); // cors 설정

userdbConnect(); //db 연결

// JSON 및 URL 인코딩된 데이터 파싱
service.use(express.json());
service.use(express.urlencoded({ extended: false }));

service.use("/", require("./routes/service_routes")); // routes 연결
service.use(requestIp.mw()); // req.clientIp 미들웨이에 추가

service.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});





