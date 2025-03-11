import axios from 'axios';
import { useState , useEffect, useContext } from 'react';
import { Context } from '../../App';

export function MyPageForm({ username, useremail, userjoinDate, updateUserName, commentList }) {
    const [changeUsername, setChangeUsername] = useState('');
    const [oldpassword, setOldPassword] = useState('');
    const [changeUserpassword, setChangeUserPassword] = useState('');
    const [confirmUserpassword, setConfirmUserPassword] = useState('');
    const [comments, setComments] = useState(commentList);
    const userid = useContext(Context);
    const passwordReg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,30}$/; // 정규표현식

    useEffect(() => {
        if (commentList && commentList.length > 0) {
            setComments(commentList);
        }
    }, [commentList]);
    
    const patchUserName = async(e) => {
        e.preventDefault();
        updateUserName(changeUsername);
    }

    const patchUserPassword = async(e) => {
        e.preventDefault();
        try {
            if (changeUserpassword!==confirmUserpassword)
                return alert("비밀번호와 확인용 비밀번호가 다릅니다.");
            if (oldpassword===changeUserpassword)
                return alert("이전 비밀번호와 새로운 비밀번호가 같습니다.");
            if (!passwordReg.test(changeUserpassword) || !passwordReg.test(confirmUserpassword) ) {
                return alert("비밀번호는 알파벳, 숫자, 특수문자를 포함해야 합니다.");
            }
            const patchUserPasswordResponse = await axios.patch(`http://localhost:8080/mypage?userid=${userid}&action=changePassword`, { 
                oldpassword: oldpassword,
                newpassword: changeUserpassword,
            });
            alert(patchUserPasswordResponse.data.message);
            if (patchUserPasswordResponse.data.message==='비밀번호 변경에 성공했습니다.') {
                localStorage.removeItem('jwtToken');
                window.location.href = '/';
            }
        } catch (error) {
            console.error(`patchUserPassword error : ${error}`);
            alert("비밀번호 변경에 실패했습니다.");
        }
    }

    const deleteMypageComment = async (commentid) => {
        try {
            const deleteCommentResponse = await axios.delete(`http://localhost:8080/search/comment`, {
                data: { 
                    commentid: commentid,
                    userid: userid
                }
            });
            if (deleteCommentResponse.data.message) {
                alert(deleteCommentResponse.data.message);
                setComments((prevComments) => prevComments.filter(comment => comment._id !== commentid));
            }
        } catch (error) {
            alert("댓글 삭제에 실패했습니다.");
            console.error(`SubwayComment ERROR : ${error}`);
        }
    }

    return (
        <div>
            <ul style={{ listStyleType: 'square' }}>
                <h3>{username} 님 안녕하세요!</h3>
                <li>계정 id : {userid}</li>
                <li>이메일 : {useremail}</li>
                <li>계정 생성일 : {userjoinDate}</li>
            </ul>
            <hr />  {/* 밑줄 */}
            <form>
                <h4>닉네임 변경</h4>
                <br />
                <p>- 현재 닉네임 : {username}</p>
                <input type="text" id="name-Form" placeholder="닉네임을 입력해주세요" onChange={(e) => setChangeUsername(e.target.value)} required/>
                <label className="form-label" htmlFor="name-Form" />
                <button type="submit" onClick={patchUserName}>변경</button>   
            </form>
            <hr /> {/* 밑줄 */}
            <form>
                <h4>비밀번호 변경</h4>
                <div className="form-group row" id="password-change">
                    <label htmlFor="inputPassword1" className="col-sm-2 col-form-label">이전 비밀번호 입력</label>
                    <div className="col-sm-10">
                        <input 
                            type="password" className="form-control" id="inputPassword1" 
                            minLength="8" maxLength="30" required
                            placeholder="이전 비밀번호 입력" onChange={(e) => setOldPassword(e.target.value)} 
                        />
                    </div>
                    {/* css로 간격 주기 */}
                    <label htmlFor="inputPassword2" className="col-sm-2 col-form-label">새로운 비밀번호 입력</label>
                    <div className="col-sm-10">
                        <input 
                            type="password" className="form-control" id="inputPassword2"
                            minLength="8" maxLength="30" required
                            placeholder="새로운 비밀번호 입력" onChange={(e) => setChangeUserPassword(e.target.value)} 
                        />
                    </div>
                    {/* css로 간격 주기 */}
                    <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">비밀번호 확인</label>
                    <div className="col-sm-10">
                        <input 
                            type="password" className="form-control" id="inputPassword3"
                            minLength="8" maxLength="30" required
                            placeholder="비밀번호 확인" onChange={(e) => setConfirmUserPassword(e.target.value)} 
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-info" onClick={patchUserPassword}>수정</button>
            </form>
            <hr />  {/* 밑줄 */}
            <h4>게시글 관리</h4>
            <br />
            <table className="table table-striped" id="userpage-table">
                <thead>
                    <tr>
                        <th scope="col">지하철역</th>
                        <th scope="col">내용</th>
                        <th scope="col">작성일</th>
                        <th scope="col">삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {comments.slice().reverse().map((comment) => ( 
                        <tr key={comment._id}>
                            <td>{comment.subway}</td>
                            <td>
                                <a 
                                    href={`/search?query=${comment.subway}`} 
                                    style={{ color: 'black' }} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {comment.article.length > 45 ? `${comment.article.substring(0, 25)}...` : comment.article} {/* 25자 이상이면 ...으로 표시 */}
                                </a>
                            </td>
                            <td>{comment.timestamp}</td>
                            <td>
                                <button type="submit" className="btn btn-danger btn-sm" onClick={() => deleteMypageComment(comment._id)}>
                                    X
                                </button>
                            </td>
                        </tr> 
                    ))}
                </tbody>
            </table>
        </div>
    );
}