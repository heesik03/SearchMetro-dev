const mongoose = require("mongoose");
const { DateTime } = require('luxon');

const UserSchema = new mongoose.Schema( {
    name: {
        type: String,
        unique: true, // 중복 방지
        required: [true, "이름 작성 필요"],
        maxlength: [20, "닉네임은 최대 20자까지 가능합니다."]
    },
    email: {
        type : String,
        unique: true, // 중복 방지
        required : [true, "이메일 작성 필요"],
        lowercase: true, // 소문자로 처리하여 중복방지
        trim: true // 공백제거
    },
    password : {
        type : String,
        required : [true, "비밀번호 작성 필요"],
    },
    isAdmin : { // 관리자 계정 여부
        type : Boolean,
        default : false, 
    },
    joinDate: { // 가입 날짜
        type: String,
        default: () => {
            const koreaTime = DateTime.now().setZone('Asia/Seoul');
            const formattedTime = koreaTime.toFormat('yyyy-LL-dd HH:mm:ss');

            return formattedTime;
        }
    },
    refreshToken : {
        type: String,
    },
    bookmark: { 
        type: [String],
    },
})

const userDB = mongoose.model("userDB", UserSchema);

module.exports = userDB;