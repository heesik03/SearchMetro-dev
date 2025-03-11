import { useState, useEffect } from 'react';

export function Header({userid}) {
    const [isLoggedIn , setIsLoggedIn] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('jwtToken');
        if (accessToken && accessToken!=="") {
            setIsLoggedIn(true);
        } 
    }, []);

    const handleLogout = () => {
        try {
            localStorage.removeItem('jwtToken');
            setIsLoggedIn (false); 
            window.location.replace('/');
        } catch (error) {
            console.error(`handleLogout ERROR : ${error}`)
        }
    };

    return (
        <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
            <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="65" height="42" fill="currentColor" className="bi me-2 bi-train-freight-front" viewBox="0 0 16 16">
                    <path d="M5.065.158A1.5 1.5 0 0 1 5.736 0h4.528a1.5 1.5 0 0 1 .67.158l3.237 1.618a1.5 1.5 0 0 1 .83 1.342V13.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V3.118a1.5 1.5 0 0 1 .828-1.342zM2 9.372V13.5A1.5 1.5 0 0 0 3.5 15h4V8h-.853a.5.5 0 0 0-.144.021zM8.5 15h4a1.5 1.5 0 0 0 1.5-1.5V9.372l-4.503-1.35A.5.5 0 0 0 9.353 8H8.5zM14 8.328v-5.21a.5.5 0 0 0-.276-.447l-3.236-1.618A.5.5 0 0 0 10.264 1H5.736a.5.5 0 0 0-.223.053L2.277 2.67A.5.5 0 0 0 2 3.118v5.21l1-.3V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3.028zm-2-.6V5H8.5v2h.853a1.5 1.5 0 0 1 .431.063zM7.5 7V5H4v2.728l2.216-.665A1.5 1.5 0 0 1 6.646 7zm-1-5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm-3 8a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1m9 0a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1M5 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                </svg>
                <span className="fs-4">지하철</span>
            </a>

            <ul className="nav nav-pills">
                <li className="nav-item" style={{visibility: isLoggedIn ? 'hidden' : 'visible' }}>
                    <a href="/login" className="nav-link active" aria-current="page">로그인</a>
                </li>
                <li className="nav-item" style={{visibility: isLoggedIn ? 'visible' : 'hidden' }}>
                    <a href="/" className="nav-link" onClick={handleLogout}>로그아웃</a>
                </li>
                <li className="nav-item" style={{visibility: isLoggedIn ? 'visible' : 'hidden' }}>
                    <a href={`/mypage?userid=${userid}`} className="nav-link">마이페이지</a>
                </li>
            </ul>
        </header>
    );
}
