const developerContact = "cka8701@gmail.com";
const API_ERROR_MSG = `API 호출 오류입니다. 개발자에게 문의해주세요. (${developerContact})`;
const SERVER_ERROR_MSG = "OPEN API 서버 오류입니다. 잠시 후 다시 접속해주세요.";
const DB_ERROR_MSG = "OPEN API DB 오류입니다. 잠시 후 다시 접속해주세요.";

export const APIfilters = {
  "INFO-100": "개발자에게 문의해주세요 (cka8701@gmail.com).",
  "INFO-200": "다시 검색해주세요.",
  "ERROR-300": API_ERROR_MSG,
  "ERROR-301": API_ERROR_MSG,
  "ERROR-310": API_ERROR_MSG,
  "ERROR-331": API_ERROR_MSG,
  "ERROR-332": API_ERROR_MSG,
  "ERROR-333": API_ERROR_MSG,
  "ERROR-334": API_ERROR_MSG,
  "ERROR-335": API_ERROR_MSG,
  "ERROR-336": API_ERROR_MSG,
  "ERROR-500": SERVER_ERROR_MSG,
  "ERROR-600": DB_ERROR_MSG,
  "ERROR-601": DB_ERROR_MSG
};

export const metroOption = {
  "1001": "1호선",
  "1002": "2호선",
  "1003": "3호선",
  "1004": "4호선",
  "1005": "5호선",
  "1006": "6호선",
  "1007": "7호선",
  "1008": "8호선",
  "1009": "9호선",
  "1061": "중앙선",
  "1063": "경의중앙선",
  "1065": "공항철도",
  "1067": "경춘선",
  "1075": "수의분당선",
  "1077": "신분당선",
  "1092": "우이신설선",
  "1093": "서해선",
  "1081": "경강선",
  "1032": "GTX-A"
};

export const groupedByUpdnLine = (data) => {
  return data.reduce((acc, currentData) => {
    const { updnLine } = currentData;
    if (!acc[updnLine]) {
      acc[updnLine] = [];
    }
    acc[updnLine].push(currentData); // 상하행선을 key로 배열 만들기 {상행:[], 하행:[]}
    return acc;
  }, {});
};


