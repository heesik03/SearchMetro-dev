const axios = require('axios');
const userdbModel = require('../models/userdbModel');
require("dotenv").config();

const realTimeSubwayList = // 지하철 실시간 도착 필터링 할 정보
['subwayId' , 'updnLine' , 'trainLineNm' , 'btrainSttus', 'recptnDt', 'arvlMsg2', 'lstcarAt'];
const SubwayInfoList = ['LINE_NUM'];

function filterData(data, list) {
    return data.map(item => 
        Object.fromEntries( // [key , value] 배열 => 객체 {} 배열로 전환
            Object.entries(item).filter(([key]) => list.includes(key)) // 객체 {} => [key , value] 배열로 전환
        )
    );
}

const getSubwayData = async (req, res) => {
    try {
        const query = req.query.query;  // 검색어 query 값 받기 
        let SubwayId = '';
        let SubwayName = '';
        let SubwayLine = '';
        let SubwayInfoData = '';
        let realTimeSubwayData = ''; // 지하철 실시간 도착정보

        const SubwayInfoLink = `http://openapi.seoul.go.kr:8088/${process.env.SUBWAY_KEY}/json/SearchInfoBySubwayNameService/1/5/${query}/` 
        const realTimeSubwayLink = `http://swopenAPI.seoul.go.kr/api/subway/${process.env.SUBWAY_KEY}/json/realtimeStationArrival/0/15/${query}`;

        const [SubwayInfoResponse, realTimeSubwayResponse] = await axios.all([
            axios.get(SubwayInfoLink),
            axios.get(realTimeSubwayLink),
        ]);
 
        // 지하철 정보 if문
        if (!SubwayInfoResponse.data.SearchInfoBySubwayNameService) {
            console.error(`${query} 지하쳘 역 정보 API 오류 :`);
            SubwayInfoData = SubwayInfoResponse.data;
            console.log(SubwayInfoData);
        } else {
            SubwayInfoData = SubwayInfoResponse.data.SearchInfoBySubwayNameService.row; // STATION_CD: 지하철역 코드 LINE_NUM : 호선 이름
            SubwayId = SubwayInfoData[0].STATION_CD;
            SubwayName = SubwayInfoData[0].STATION_NM;
            SubwayLine = filterData(SubwayInfoData, SubwayInfoList);
        }

        // 지하철 실시간 정보 if문
        if (!realTimeSubwayResponse.data.realtimeArrivalList) {
            console.error(`${query} 지하철 실시간 도착정보 API 오류 :`);
            realTimeSubwayData = realTimeSubwayResponse.data;
            console.log(realTimeSubwayData);
        } else {
            realTimeSubwayData = realTimeSubwayResponse.data.realtimeArrivalList;
            realTimeSubwayData = filterData(realTimeSubwayData, realTimeSubwayList);
        }

        res.send({
            realtime : realTimeSubwayData,
            subwayinfo : SubwayInfoData,
            id : SubwayId,
            name : SubwayName,
            line : SubwayLine,
        });
        
    } catch (error) {
        console.error(`getSubwayData ERROR : ${error}`);
    }
}

const postBookmark = async (req, res) => {
    try {
        const { subwayName , userID} = req.body;
        const userData = await userdbModel.findOne({ _id : userID });
        let sendMessage = '';

        if (!userData) {
            sendMessage = 'error : 회원 검색에 실패했습니다.';
            return res.status(404).send({ message: sendMessage });
        }
        if (userData.bookmark.length===0 || !userData.bookmark.includes(subwayName)) {
            userData.bookmark.push(subwayName);
            await userData.save();
            sendMessage = `${userData.name} 북마크 추가 성공! (${subwayName})`
            res.send({ message: sendMessage });
        } else {
            await userdbModel.updateOne(
                { _id: userID },
                { $pull: { bookmark: subwayName } }
            );
            return res.send({message : "북마크 삭제 성공"});
        }
    } catch (error) {
        sendMessage = `postBookmark ERROR : ${error}`
        console.error(sendMessage);
        return res.send({ message: sendMessage });
    }
}

module.exports = {
    getSubwayData,
    postBookmark
};