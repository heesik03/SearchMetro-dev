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

module.exports = router;