const bcrypt = require('bcryptjs');
const userdbModel = require('../models/userdbModel');
const userCommentdbModel = require('../models/userCommentdbModel');
let alertMessage = '';

const getMypageData = async(req, res) => {
    try {
        const userID = req.query.userid;
        const userData = await userdbModel.findOne({ _id : userID });
        const commentListData = await userCommentdbModel.find({commenterID : userID});
        if (!userData || !commentListData) {
            console.log(`${userID} 회원 검색에 실패했습니다`);
            return res.send({
                error: 'error : 회원 검색에 실패했습니다.',
            });
        }
        res.send({
            name : userData.name,
            email : userData.email,
            isAdmin : userData.isAdmin,
            joinDate : userData.joinDate,
            commentlist : commentListData,
        });

    } catch (error) {
        console.error(`getMypageData ERROR : ${error}`);
        return res.send({
            error: `getMypageData ERROR : ${error}`,
        });
    }
}

const patchUserData = async(req, res) => {
    try {
        const userID = req.query.userid;
        const action = req.query.action;
        const fillterID = { _id: userID };

        if (action==='changeName') {
            const { nickname } = req.body; 
            const updateName = { $set: {name: nickname}}
    
            const changeUserName = await userdbModel.updateOne(fillterID, updateName);
            if (!changeUserName) {
                alertMessage = `${nickname}님의 닉네임 변경에 실패했습니다.`;
                console.log(alertMessage);
            }
            alertMessage = `${nickname}님의 닉네임 변경에 성공했습니다.`;
            console.log(`${userID}님의 닉네임 변경에 성공했습니다.`);

        } else if(action==='changePassword') {
            const { oldpassword, newpassword } = req.body;
            const userData = await userdbModel.findOne({ _id : userID });
            const checkPassword = await bcrypt.compare(oldpassword, userData.password);
            if (!checkPassword) {
                alertMessage = '비밀번호가 일치하지 않습니다.';
                console.log(alertMessage);
            } else {
                const hashedNewPassword = await bcrypt.hash(newpassword, 10);
                const updatePassword = { $set: {password: hashedNewPassword}}
                const changeUserPassword = await userdbModel.updateOne(fillterID, updatePassword);
                if (!changeUserPassword) {
                    alertMessage = '서버 오류로 비밀번호 변경에 실패했습니다.';
                    console.log(alertMessage);
                } else {
                    alertMessage = '비밀번호 변경에 성공했습니다.';
                    console.log(`${userID}님의 비밀번호 변경에 성공했습니다.`);
                }
            }
        }

        res.send({message : alertMessage});

    } catch (error) {
        // 중복 키 오류 처리 (11000)
        if (error.code === 11000) {
            const duplicateKey = Object.keys(error.keyValue)[0]; // 중복된 키 확인
            if (duplicateKey === 'name') {
                return res.send({
                    message: '이미 존재하는 닉네임입니다.',
                });
            }
        }
        console.error(`patchUserData ERROR : ${error}`);
        return res.send({
            message: `patchUserData ERROR : ${error}`,
        });
    }
    
}

const delUserData = async(req, res) => {
    try {
        const {userid} = req.body;
        const deleteUser =  await userdbModel.deleteOne({_id: userid});
        if (!deleteUser) {
            alertMessage = '서버 오류로 회원탈퇴에 실패했습니다.'
        } else {
            alertMessage = '회원탈퇴에 성공했습니다.'
            console.log(`${userid} 회원탈퇴 완료`);
        }
        res.send({message : alertMessage});
    } catch (error) {
        console.error(`delUserData ERROR : ${error}`);
        return res.send({
            message: `서버 오류로 회원탈퇴에 실패했습니다. : ${error}`,
        });
    }
}

module.exports = {
    getMypageData,
    patchUserData,
    delUserData,
};
