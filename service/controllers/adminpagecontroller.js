const userdbModel = require('../models/userdbModel');

const getUserListData = async(req, res) => {
    try {
        const userID = req.query.userid;
        const userData = await userdbModel.findOne({ _id : userID });
        let userListData = '';

        if (userData.isAdmin) {
            userListData = await userdbModel.find({isAdmin : false});
        } else {
            console.error('경고! 관리자가 아닌 사용자가 유저 목록에 접근하려 합니다.');
        }

        res.send({userlist : userListData});

    } catch (error) {
        console.error(`getUserListData Error : ${error}`);
    }
}

module.exports = {
    getUserListData,
};