const mongoose = require("mongoose");

const SubwayStarRatingSchema = new mongoose.Schema({
    subwayName : {
        type: String,
        required : [true , "지하철 역명을 입력하세요."],
        unique: true, // 중복 방지
    },
    rating : {
        type: Number,
        default: 0, 
    },
    userList : {
        type: [String],
        default: [],
    },
})

const subwayStarRatingDB = mongoose.model("subwayStarRatingDB", SubwayStarRatingSchema);

module.exports = subwayStarRatingDB;