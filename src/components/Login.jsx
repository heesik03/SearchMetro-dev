import axios from 'axios';
import { useState , useEffect } from 'react';

export function Login() {
    const [useremail, setUserEmail] = useState('');
    const [userpassword, setUserPassword] = useState('');
    const [alertMessage, setAlertMessage] = useState("");

    document.title = '로그인';

    useEffect(() => {
        const token = localStorage.getItem('jwtToken'); // localStorage에서 토큰 확인
        if (token) {
            alert("이미 로그인 상태입니다.");
            window.location.href = '/';  
        }
    }, []);


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userdata = {
                email : useremail, 
                password : userpassword
            }
    
            const handleLoginResponse = await axios.post(`http://localhost:8080/login`, userdata, { withCredentials: true });

            if (handleLoginResponse.data.error) {
                setAlertMessage(handleLoginResponse.data.error);
            }

            if (handleLoginResponse.data.token) {
                localStorage.setItem('jwtToken', handleLoginResponse.data.token);
                window.location.href = '/';  
            } else {
                setAlertMessage("이메일 또는 비밀번호가 맞지 않습니다.");
            }

        } catch (error) {
            console.error(`Login ERROR : ${error}`);
        }
    }

    return (
        <div className="container">
            <h4>로그인</h4>
            <hr />
            <div id="login-container">
                <form>
                    <div data-mdb-input-init className="form-outline mb-4">
                        <input type="email" id="emailForm" className="form-control" placeholder="이메일" onChange={(e) => setUserEmail(e.target.value)} required/>
                        <label className="form-label" htmlFor="emailForm" />
                    </div>

                    <div data-mdb-input-init className="form-outline mb-4">
                        <input type="password" id="passwordForm" className="form-control" placeholder="비밀번호" onChange={(e) => setUserPassword(e.target.value)} required />
                        <label className="form-label" htmlFor="passwordForm" />
                    </div>

                    <div className="row mb-4">
                        <div className="col">
                            <strong>* 아이디/비밀번호 분실 시 개발자에게 문의하세요 (cka8701@gmail.com)</strong>
                        </div>
                    </div>
                    {
                        alertMessage && (
                            <>
                                <strong style={{color : "red"}}>* {alertMessage}</strong> 
                                <br />
                                <br />
                            </>
                        ) 
                    }
                    <button type="submit" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-block mb-4" onClick={handleLogin}>로그인</button>
                    
                    <div className="text-center">
                        <p>회원이 아닌가요? <a href="/signup">회원가입</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
}