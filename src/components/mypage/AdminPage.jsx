import axios from 'axios';
import { useState , useEffect, useContext } from 'react';
import { Context } from '../../App';

export function AdminPage({ children }) {

    const [userList, setUserList] = useState([]);
    const userid = useContext(Context);

    document.title = '관리자 페이지';

    const getUserList = async () => {
        try {
            const getUserListResponse = await axios.get(`http://localhost:8080/mypage/admin?userid=${userid}`);
            if (getUserListResponse.data.userlist && getUserListResponse.data.userlist!=='') {
                setUserList(getUserListResponse.data.userlist);
            } else {
                alert('유저 목록 조회 실패');
            }
        } catch (error) {
            console.error(`removeUser ERROR : ${error}`);
            alert(`회원 정보 불러오기 오류 : ${error}`);
        }
    }

    const removeUser = async (userid) => {
        try {
            console.log(userid)
            const removeUserResponse = await axios.delete(`http://localhost:8080/mypage`, {
                data: { 
                    userid: userid
                }
            });
            alert(removeUserResponse.data.message);
        } catch (error) {
            console.error(`removeUser ERROR : ${error}`);
            alert("회원 삭제 오류");
        }
    }

    useEffect(()=> {
        if(userid)
            getUserList();
    } , [userid])

    return (
        <>
            <h3 style={{ color: 'red' }}>관리자 페이지</h3>
            <br />
            {children ?? <p>마이페이지 오류입니다.</p>}
            <hr />  {/* 밑줄 */}
            <h4>❗유저 관리</h4>
            <br />
            <table className="table table-striped" id="userpage-table">
                <thead>
                    <tr>
                        <th scope="col">닉네임</th>
                        <th scope="col">id</th>
                        <th scope="col">이메일</th>
                        <th scope="col">가입일</th>
                        <th scope="col" style={{textAlign: 'center'}}>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.slice().reverse().map((user) => ( 
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user._id} </td>
                            <td>{user.email}</td>
                            <td>{user.joinDate}</td>
                            <td style={{textAlign: 'center'}}>
                                <button type="submit" className="btn btn-danger btn-sm" onClick={() => removeUser(user._id)}>
                                    X
                                </button>
                            </td>
                        </tr> 
                    ))}
                </tbody>
            </table>
        </>
    );
}
