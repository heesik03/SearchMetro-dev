const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const requestIp = require('request-ip');
const userdbModel = require('../models/userdbModel');
require("dotenv").config();

const postLogin = async (req, res) => {
    try {
        const clientIp = requestIp.getClientIp(req); 
        const { email, password } = req.body;
        const accessUser = await userdbModel.findOne({ email });
        const accessPassword = await bcrypt.compare(password, accessUser.password);
        let token = '';
        let refreshToken = '';

        if (!accessUser || !accessPassword) {
            console.log(`${accessUser.id} 로그인 실패!`);
        }
        else {
            console.log(`${accessUser.id} 로그인 성공! (Login User Ip : ${clientIp})`)
            token = jwt.sign({ id: accessUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.cookie("token", token, {
                httpOnly: true,
                secure : true,
                sameSite: 'None' // 다른 도메인에서의 요청 허용
            });
            refreshToken = jwt.sign({ id: accessUser.id }, process.env.REFRESH_JWT_SECRET, { expiresIn: "14d" }); 
            accessUser.refreshToken = refreshToken;
            await accessUser.save();
        }
        res.send({
            token:token,
        });

    } catch(error) {
        console.error(`postLogin ERROR : ${error}`);
        res.send({
            message : "이메일 또는 비밀번호가 맞지 않습니다."
        });
    }
}

module.exports = {
    postLogin,
};