const axios = require('axios');
const bcrypt = require('bcryptjs');
const userdbModel = require('../models/userdbModel');
require("dotenv").config();

const postSignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const inputuserdb = new userdbModel({
            name : name,
            email : email,
            password : hashedPassword,
        });
        await inputuserdb.save();
        console.log(`${name} 회원가입 성공!`);
        res.send({message : '회원가입에 성공했습니다!'});

    } catch (error) {
        let errorMessage = '';

        if (error.code === 11000) {
            console.error(`postSignUp ERROR : ${error}`);
        
            if (error.keyValue.email) {
                errorMessage = '이미 사용 중인 이메일입니다. 다른 이메일을 입력해주세요.';
            } else if (error.keyValue.name) {
                errorMessage = '이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.';
            } else {
                errorMessage = '이메일 또는 이름이 다른 사용자와 일치합니다.';
            }
            return res.send({ message: errorMessage });
        }        

        console.error(`postSignUp ERROR : ${error}`);
        return res.send({
            message: '서버 에러로 회원가입에 실패했습니다.',
        });

    }
}

module.exports = {
    postSignUp,
};