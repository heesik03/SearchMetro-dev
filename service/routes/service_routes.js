const express = require("express");
const router = express.Router();
const { getBookmark , postTokenVerify, delBookmark} = require("../controllers/maincontroller");
const { getSubwayData , postBookmark } = require("../controllers/searchcontroller");
const { getFirstAndLastMetro } = require("../controllers/firstandlastcontroller");
const { getSubwayStarRating , postSubwayStarRating } = require("../controllers/subwaystarratingcontroller");
const { getCommentData , postComment, patchLikesData, deleteCommentData } = require("../controllers/commentcontroller");
const { postLogin } = require("../controllers/logincontroller");
const { getMypageData, patchUserData, delUserData } = require("../controllers/mypagecontroller");
const { getUserListData } = require("../controllers/adminpagecontroller");
const { postSignUp } = require("../controllers/signupcontroller");

router.route("/")
    .get(getBookmark)
    .post(postTokenVerify)
    .delete(delBookmark)

router.route("/search")
    .get(getSubwayData)
    .post(postBookmark)

router.route("/search/FirstAndLast")
    .get(getFirstAndLastMetro)

router.route("/search/rating")
    .get(getSubwayStarRating)
    .post(postSubwayStarRating)

router.route("/search/comment")
    .get(getCommentData)
    .post(postComment)
    .patch(patchLikesData)
    .delete(deleteCommentData)

router.route("/login")
    .post(postLogin)

router.route("/mypage")
    .get(getMypageData)
    .patch(patchUserData)
    .delete(delUserData)

router.route("/mypage/admin")
    .get(getUserListData)

router.route("/signup")
    .post(postSignUp)

router.post("/error", (req , res) => {
    try {
        const { error , stack } = req.body;
        console.log('React 에러 : ');
        console.error(`error: ${error}`);
        console.error(`errorInfo : ${stack}`);
        res.send({message : '에러 서버 수신 완료!'});
    } catch (error) {
        console.error(`클라이언트의 에러를 받는 중 오류가 발생했습니다 : ${error}`);
    }
})

module.exports = router;