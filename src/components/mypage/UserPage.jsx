import axios from 'axios';
import { useContext } from 'react';
import { Context } from '../../App';

export function UserPage({ children }) {

    const userid = useContext(Context);
    document.title = '마이 페이지';

    const deleteAccount = async (e) => {
        e.preventDefault();
        try {
            const isConfirmed = window.confirm("정말 탈퇴하시겠습니까?");
            if (isConfirmed) {
                const deleteAccountResponse = await axios.delete(`http://localhost:8080/mypage`, {
                    data: { 
                        userid: userid
                    }
                });
                alert(deleteAccountResponse.data.message);
                if (deleteAccountResponse.data.message==='회원탈퇴에 성공했습니다.') {
                    await axios.post('http://localhost:8080/');
                    localStorage.removeItem('jwtToken');
                    window.location.href = '/';
                }
            }
        } catch (error) {
            console.error(`deleteAccount error : ${error}`);
            alert("회원탈퇴에 실패했습니다.");
        }
    }

    return (
        <>
            {children ?? <p>마이페이지 오류입니다.</p>}
            <hr />  {/* 밑줄 */}
            <form>
                <button type="submit" className="btn btn-danger" onClick={deleteAccount}>회원탈퇴</button>
            </form>
        </>
    );
}
