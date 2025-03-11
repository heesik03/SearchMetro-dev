const userdbModel = require('../models/userdbModel');
const requestIp = require('request-ip');
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getBookmark = async(req, res) => {
    try {
        const userID = req.query.userid;
        const userData = await userdbModel.findOne({ _id : userID });
        if (!userData) {
            console.log(`${userID} 회원 검색에 실패했습니다`);
            return res.status(404).send({
                error: 'error : 회원 검색에 실패했습니다.',
            });
        }
        res.send({
            bookmarkData : userData.bookmark,
        });

    } catch (error) {
        console.error(`getBookmark ERROR : ${error}`);
        res.status(500).send({error: `getBookmark ERROR : ${error}`,});
    }
}

const postTokenVerify = async (req, res) => {
    const clientIp = requestIp.getClientIp(req);
    let newToken = '';
    let message = '';
    try {
      const { token } = req.body;
      const tokenID = JSON.parse(atob(token.split('.')[1])); 
      const userData = await userdbModel.findOne({ _id : tokenID.id });
      const refreshToken = userData.refreshToken;

      jwt.verify(token, process.env.JWT_SECRET, async(err) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            // 토큰 유효 기간이 다 했을시
            console.error(`${userData.name}의 토큰이 만료되었습니다.`);
            if (!refreshToken || refreshToken==="") {
              res.clearCookie('token');
              message = '토큰 검증에 실패했습니다.';
            } else {
              // 리프레쉬 토큰 검증
              jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, async(error) => {
                if (error) { // 리프레쉬 토큰 유효기간이 다 하거나 검증 중 오류가 걸렸을 시
                  userData.refreshToken = "";
                  res.clearCookie('token');
                  message = '토큰 검증에 실패했습니다.';
                  await userData.save();
                } else {
                  newToken = jwt.sign({ id: userData.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
                  res.cookie("token", newToken, {
                    httpOnly: true,
                    secure : true,
                    sameSite: 'None' // 다른 도메인에서의 요청 허용
                  });
                }
              })
            }
          } else {
            console.error(`토큰 검증 중 오류 발생: ${err}`);
            res.clearCookie('token');
            message = '토큰 검증에 실패했습니다.';
          }
        } else {
          newToken = token; // 유효기간이 안 지났으므로 기존 토큰으로
        }
      });
    } catch (error) {
        res.clearCookie('token');
        console.error(`postTokenVerify ERROR : ${error}`);
    } finally {
      res.send({
        ip : clientIp,
        token : newToken,
        message : message,
      })
    }
};

const delBookmark = async (req, res) => {
  try {
    const {userid, bookmark} = req.body;
    await userdbModel.updateOne(
      { _id: userid },
      { $pull: { bookmark: bookmark } }
    );
    res.send({message : '북마크 삭제 성공'});
  } catch (error) {
    console.error(`delBookmark ERROR : ${error}`);
    res.send({message : '북마크 삭제 실패'});
}
}

module.exports = {
    getBookmark,
    postTokenVerify,
    delBookmark
};