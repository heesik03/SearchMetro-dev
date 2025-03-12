import axios from 'axios';
import { useState , useEffect , useContext } from 'react';
import { AdminPage } from './mypage/AdminPage';
import { UserPage } from './mypage/UserPage';
import { MyPageForm } from './mypage/MyPageForm';
import { Context } from '../App';

export function MyPage() {
    const accessToken = localStorage.getItem('jwtToken');
    const [username, setUserName] = useState('');
    const [useremail, setUserEmail] = useState('');
    const [isadmin, setIsadmin] = useState(false);
    const [userjoinDate, setUserJoinData] = useState('');
    const [commentList, setCommentList] = useState([]);
    const userid = useContext(Context);

    const fetchUserData = async() => {
        try {
            const getUserdataResponse = await axios.get(`http://localhost:8080/mypage?userid=${userid}`);
            if (getUserdataResponse.data.error) {
                window.location.href = '/';
                return alert(`${getUserdataResponse.data.error}`);
            }
            setUserName(getUserdataResponse.data.name);
            setUserEmail(getUserdataResponse.data.email);
            setIsadmin(getUserdataResponse.data.isAdmin);
            setUserJoinData(getUserdataResponse.data.joinDate);
            setCommentList(getUserdataResponse.data.commentlist);
        } catch {
            window.location.href = '/';
        return alert(`마이페이지 에러입니다. 개발자에게 문의해주세요.`);
    }}

    const updateUserName = async (newUsername) => {
        try {
            const updateResponse = await axios.patch(`http://localhost:8080/mypage?userid=${userid}&action=changeName`, { nickname: newUsername });
            alert(updateResponse.data.message);
            setUserName(newUsername); 
            fetchUserData();  
        } catch (error) {
            alert(`닉네임 변경 중 오류가 발생했습니다: ${error}`);
        }
    };

    useEffect(() => {
        if (!accessToken) {
            window.location.href = '/';
            alert('로그인 되어있지 않습니다.');
        }
        if (userid)
            fetchUserData();
    }, [accessToken, userid]); 

    return (
        <div className="container">
            {isadmin ? (
                // 중첩 컴포넌트
                <AdminPage>
                    <MyPageForm  
                        username={username}
                        useremail={useremail}
                        userjoinDate={userjoinDate}
                        updateUserName={updateUserName}
                        commentList={commentList}
                    />
                </AdminPage>
            ) : (
                <UserPage>
                    <MyPageForm 
                        username={username}
                        useremail={useremail}
                        userjoinDate={userjoinDate}
                        updateUserName={updateUserName}
                        commentList={commentList}
                    />
                </UserPage>
            )}
        </div>
    );
}