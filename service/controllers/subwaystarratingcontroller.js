const subwayStarratingModel = require('../models/subwayStarratingModel');

const getSubwayStarRating = async (req, res) => {
    try {
        const query = req.query.query;
        const ratingData = await subwayStarratingModel.findOne({subwayName : query});
        if (ratingData) {
            const ratingAverage = ratingData.rating / ratingData.userList.length; // 토탈 별점 수 / 별점에 참여한 유저 수
            res.send({
                totalUsers : ratingData.userList.length , 
                average : ratingAverage
            });
        }
    } catch (error) {
        console.error(`getSubwayStarRating ERROR : ${error}`);
    }
}

const postSubwayStarRating = async (req, res) => {
    let alertMessage = '';
    try {
        const { query, score, userid } = req.body;
        const ratingData = await subwayStarratingModel.findOne({subwayName : query});
        
        if (!ratingData) {
            const addSubwayStarRating = new subwayStarratingModel({
                subwayName : query,
                rating : score,
                userList : userid,
            });
            await addSubwayStarRating.save();
            alertMessage = '별점 추가 성공!'
        } else {
            if (ratingData.userList.length===0 || !ratingData.userList.includes(userid)) { // 유저 리스트가 비었거나 userid가 없을때 
                ratingData.rating += score;
                ratingData.userList.push(userid);
                await ratingData.save();
                alertMessage = '별점 추가 성공!'
            } else {
                alertMessage = '이미 해당 지하철역의 별점을 추가하셨습니다.';
            }
        } 
        res.send({ 
            message : alertMessage,
        });
    } catch (error) {
        console.error(`postSubwayStarRating ERROR : ${error}`);
    }
}

module.exports = {
    getSubwayStarRating ,
    postSubwayStarRating,
};