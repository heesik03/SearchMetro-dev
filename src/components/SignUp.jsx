import axios from 'axios';
import { useState , useEffect } from 'react';

export function SignUp() {
    const [signupname, setSingUpName] = useState('');
    const [signupemail, setSingUpEmail] = useState('');
    const [signuppassword, setSingUpPassword] = useState('');
    const [signuprepeat, setSingUpRepeat] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const passwordReg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,30}$/; // 정규표현식

    document.title = '회원가입';

    useEffect(() => {
        const token = localStorage.getItem('jwtToken'); // localStorage에서 토큰 확인
        if (token) {
            alert("이미 로그인 상태입니다.");
            window.location.href = '/';
        }
    }, []);

    const handleSignUp = async () => {
        try {
            if (isChecked === false) {
                return alert("약관에 동의하지 않으면 가입할 수 없습니다.");
            }
            if (signuppassword!==signuprepeat) {
                return alert("확인 비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
            }
            if (!passwordReg.test(signuppassword) || !passwordReg.test(signuprepeat) ) {
                return alert("비밀번호는 알파벳, 숫자, 특수문자를 포함해야 합니다.");
            }
            const signupdata = {
                name : signupname,
                email : signupemail, 
                password : signuppassword,
            }
    
            const handleSignUpResponse = await axios.post(`http://localhost:8080/signup`, signupdata);
            const responseMessage = handleSignUpResponse.data.message;
            alert(responseMessage);  // 성공 또는 실패 메시지를 표시
            if (responseMessage==='회원가입에 성공했습니다!') {
                window.location.href = '/';
            }
        } catch (error) {
            console.error(`Sign Up ERROR : ${error}`);
        }
    }

    return (
        <div className="container">
            <h4>회원가입</h4>
            <hr />
            <form className="mx-1 mx-md-4" id="singup-form">
                <div className="d-flex flex-row align-items-center mb-4">
                    <div data-mdb-input-init className="form-outline flex-fill mb-0">
                        <input 
                            type="text" id="signup-nameForm" className="form-control" 
                            placeholder="닉네임 입력" maxLength="20" required
                            onChange={(e) => setSingUpName(e.target.value)}
                        />
                        <label className="form-label" htmlFor="signup-nameForm" />
                    </div>
                </div>

                <div className="d-flex flex-row align-items-center mb-4">
                    <div data-mdb-input-init className="form-outline flex-fill mb-0">
                        <input 
                            type="email" id="signup-emailForm" className="form-control" 
                            placeholder="이메일 입력" required
                            onChange={(e) => setSingUpEmail(e.target.value)}
                        />
                        <label className="form-label" htmlFor="signup-emailForm" />
                    </div>
                </div>

                <div className="d-flex flex-row align-items-center mb-4">
                    <div data-mdb-input-init className="form-outline flex-fill mb-0">
                        <input 
                            type="password" id="signup-passwordForm" className="form-control" 
                            placeholder="비밀번호 입력" minLength="8" maxLength="30" required 
                            onChange={(e) => setSingUpPassword(e.target.value)}
                        />
                        <label className="form-label" htmlFor="signup-passwordForm" />
                        <strong>* 8자 이상, 30자 이하로 알파벳, 숫자, 특수문자를 포함하게 만들어주세요.</strong>
                    </div>
                </div>

                <div className="d-flex flex-row align-items-center mb-4">
                    <div data-mdb-input-init className="form-outline flex-fill mb-0">
                        <input 
                            type="password" id="signup-Repeat" className="form-control" 
                            placeholder="확인용 비밀번호 입력" minLength="8" maxLength="30" required 
                            onChange={(e) => setSingUpRepeat(e.target.value)}
                        />
                        <label className="form-label" htmlFor="signup-Repeat" />
                    </div>
                </div>
                <div className="form-check">
                    <input 
                        className="form-check-input" 
                        type="checkbox" 
                        value="" 
                        id="termsAndConditions" 
                        checked={isChecked} 
                        onChange={(e) => setIsChecked(e.target.checked)} 
                    />
                    <label className="form-check-label" htmlFor="termsAndConditions">
                        <strong><span style={{color : 'red'}}>* </span>IP, 이메일 정보 수집에 동의합니다.</strong>
                    </label>
                </div>
                <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                    <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-lg" onClick={handleSignUp}>회원가입</button>
                </div>

            </form>
        </div>
    );
}