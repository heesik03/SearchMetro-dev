const userdbModel = require('../models/userdbModel');
const userCommentdbModel = require('../models/userCommentdbModel');

const getCommentData = async (req, res) => {
    try {
        const commentList = await userCommentdbModel.find();
        res.send({
            commentlist : commentList,
            message : "게시글 전송에 성공했습니다!",
        })
    } catch (error) {
        console.error(`getCommentData ERROR : ${error}`);
        return res.send({error : "서버 오류로 게시글 전송에 실패했습니다."});
    }
}

const postComment =  async (req, res) => {
    try {
        const { query, userid, userip, article } = req.body;
        const userData = await userdbModel.findOne({ _id : userid });
        const maskedIP = userip.split('.').slice(0, 2).join('.') + '.***';
        if (!userData) {
            console.log(`${userid} 회원 검색에 실패했습니다`);
            return res.send({
                error: 'error : 회원 검색에 실패했습니다.',
            });
        }
        const createUserCommentDB = new userCommentdbModel({
            commenterName : userData.name,
            commenterID : userid,
            commenterIP : maskedIP,
            subway : query,
            article : article,
        });
        await createUserCommentDB.save();
        console.log(`${userid} ${query} 글 작성 성공!   내용 : ${article}`);
        res.send({message : `${userid} ${query} 글 작성 성공!`});
    } catch (error) {
        console.error(`postComment ERROR : ${error}`);
        return res.send({error : "서버 오류로 글 작성에 실패했습니다."});
    }
}

const patchLikesData = async (req, res) => {
    try {
        const {commentid , userid} = req.body;
        const commentData = await userCommentdbModel.findOne({ _id : commentid });
        if (commentData.likedUsers.length===0 || !commentData.likedUsers.includes(userid)) { // likedUser가 비었거나 userid가 없다면
            commentData.likedUsers.push(userid);
            commentData.likes += 1;
            await commentData.save();
            return res.send({likes : commentData.likes, message : "추천 성공!"});
        } else {
            return res.send({message : "이미 추천한 게시글입니다."});
        }
    } catch (error) {
        console.error(`patchLikesData ERROR : ${error}`);
        return res.send({message : "서버 오류로 추천에 실패했습니다."});
    }
}

const deleteCommentData = async (req, res) => {
    try {
        const { commentid, userid } = req.body;
        const userData = await userdbModel.findOne({ _id : userid });
        const commentData = await userCommentdbModel.findOne({ _id : commentid });
        let alertMessage = '';
        if (commentData.commenterID===userid || userData.isAdmin) {
            const deletedComment = await userCommentdbModel.deleteOne({ _id: commentid });
            if (userData && commentData && deletedComment) {
                alertMessage = '게시글 삭제에 성공했습니다.';
                console.log(`${userData.name}의 삭제한 글 내용 : ${commentData.article}`);
            } else {
                alertMessage = '서버 오류로 게시글 삭제에 실패했습니다.';
            }
        } else {
            alertMessage = '작성자 또는 관리자만이 게시글 삭제가 가능합니다.';
        }
        console.log(`${userid}의 ${commentid} 글 삭제 요청 결과 : ${alertMessage}`);
        res.send({message : alertMessage,});

    } catch (error) {
        console.error(`deleteCommentData ERROR : ${error}`);
        return res.send({message : "서버 오류로 게시글 삭제에 실패했습니다."});
    }
}

module.exports = {
    getCommentData,
    postComment,
    patchLikesData,
    deleteCommentData,
};
