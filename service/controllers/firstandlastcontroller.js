const axios = require('axios');
require("dotenv").config();

const getFirstAndLastMetro = async(req, res) => {
    try {
        const subwayid = req.query.subwayid;
        const uplndnln = req.query.uplndnln; // 상하행 여부
        const dayofweek = req.query.dayofweek; // 요일
        const trainline = req.query.trainline; // 호선
        let FirstAndLastLink = `http://openapi.seoul.go.kr:8088/${process.env.SUBWAY_KEY}/json/SearchFirstAndLastTrainbyLineServiceNew/1/1/`
        FirstAndLastLink = FirstAndLastLink + `${trainline}/${uplndnln}/${dayofweek}/${subwayid}`;
        let FirstAndLastInfo = '';

        const FirstAndLastInfoResponse = await axios.get(FirstAndLastLink);
        if (!FirstAndLastInfoResponse.data.SearchFirstAndLastTrainbyLineServiceNew) {
            console.log(`열차코드 ${subwayid} 첫차와 막차 정보 API 오류 :`);
            console.log(FirstAndLastInfoResponse.data.RESULT);
            FirstAndLastInfo = FirstAndLastInfoResponse.data; // 오류정보 담기
        } else {
            FirstAndLastInfo = FirstAndLastInfoResponse.data.SearchFirstAndLastTrainbyLineServiceNew.row[0];
        }

        res.send({Info : FirstAndLastInfo});


    } catch (error) {
        console.error(`getFirstAndLastMetro ERROR : ${error}`);
    }
}

module.exports = {
    getFirstAndLastMetro,
};