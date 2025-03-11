const mongoose = require("mongoose");
const { DateTime } = require('luxon');

const UserCommentSchema = new mongoose.Schema( {
    commenterName: {
        type: String,
        required : [true , "작성자의 닉네임을 입력하세요."],
    },
    commenterID : {
        type: String,
        required : [true , "작성자의 ID를 입력하세요."],
    },
    commenterIP : {
        type: String,
        required : [true , "작성자의 IP를 입력하세요."],
    },
    subway: {
        type: String,
        required : [true , "지하철 역의 이름을 입력하세요."],
    },
    article : {
        type: String,
        required : [true , "내용 작성 필요"],
        maxlength: [300, "내용은 최대 300자까지 가능합니다."],
        minlength: [2, "내용은 2자 이상이여야 합니다."],
    },
    likes : { 
        type: Number,
        default: 0,
    },
    likedUsers : {
        type: [String],
        default: []
    },
    timestamp: { // 작성 날짜
        type: String,
        default: () => {
            const koreaTime = DateTime.now().setZone('Asia/Seoul');
            const formattedTime = koreaTime.toFormat('yyyy-LL-dd HH:mm:ss');

            return formattedTime;
        }
    },
})


const usercommentDB = mongoose.model("usercommentDB", UserCommentSchema);

module.exports = usercommentDB;