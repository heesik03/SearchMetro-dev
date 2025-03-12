import './App.css';
import axios from 'axios';
import { useState , useEffect , createContext  } from 'react';
import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./ErrorBoundary";
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Main } from './components/Main';
import { Search } from './components/Search';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { MyPage } from './components/MyPage';

export const Context = createContext();

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [userID, setUserID] = useState('');
  const [userIP, setUserIP] = useState('');

  const tokenVerify = async (token) => {
    try {
      const tokenVerifyResponse = await axios.post('http://localhost:8080/', {
        token: token,
      });
      setUserIP(tokenVerifyResponse.data.ip)
      if (!tokenVerifyResponse.data.token || tokenVerifyResponse.data.token==="" || tokenVerifyResponse.data.message==="토큰 검증에 실패했습니다.") {
        localStorage.removeItem('jwtToken');
        window.location.href = '/';
      } else {
        setAccessToken(tokenVerifyResponse.data.token);
        localStorage.setItem('jwtToken', tokenVerifyResponse.data.token);
      }
    } catch (error) {
      console.error(`tokenVerify ERROR : ${error}`);
      localStorage.removeItem('jwtToken');
      window.location.href = '/';
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setAccessToken(token);
      const decodedPayload = JSON.parse(atob(token.split('.')[1]));  // Base64로 인코딩된 payload를 디코딩 후 JSON으로 변환
      setUserID(decodedPayload.id);
      tokenVerify(token); // 토큰 검증
    }
  }, []); 

  return (
    <div>
      <ErrorBoundary>
        <Header userid={userID} />
        <Context.Provider value={userID}>
          <Routes>
            <Route path='/' element={<Main token={accessToken} />} />
            <Route path='/search' element={<Search token={accessToken} userip={userIP}/>} />
            <Route path='/mypage' element={<MyPage />}/>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp/>}/>
            <Route path="*" element={<Main/>} /> 
          </Routes>
        </Context.Provider>
        <Footer />
      </ErrorBoundary>
    </div>
  );
}

export default App;
