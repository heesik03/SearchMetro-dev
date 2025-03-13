import axios from 'axios';
import { useState , useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { RealtimeMetro } from './metro/RealtimeMetro';
import { FirstAndLastMetro } from './metro/FirstAndLastMetro';
import { SubwayAmenities } from './metro/SubwayAmenities';
import { SubwayAddress } from './metro/SubwayAddress';
import { SubwayRating } from './metro/SubwayRating';
import { SubwayComment } from './metro/SubwayComment';
import { RealtimeNamefilters } from '../filters/RealtimeNamefilters'; // 두 api 간의 다른 지하철역 이름 모음
import { MetroLineColor } from '../filters/MetroLineColor';
import { Context } from '../App';

export function Search({token, userip}) {
  const location = useLocation();  // 현재 URL 정보를 가져옴
  const [query, setQuery] = useState('');
  const [realtimemetroData, setRealtimeMetroData] = useState([]);
  const [subwayInfo, setSubwayInfo] = useState([]);
  const [subwayid , setSubwayID] = useState('');
  const [subwayname, setSubwayname] = useState('');
  const [subwayline, setSubwayline] = useState([]);

  const userid = useContext(Context);

  useEffect(() => {
    const params = new URLSearchParams(location.search);  // location.search는 쿼리 파라미터 부분
    const queryParam = params.get('query');  // 'query' 파라미터 값 추출
    if (queryParam) {
      setQuery(queryParam);
    }
  }, [location.search]); // location.search가 변경될 때마다 실행
  
  const sendRequest = async () => {
    if (!query) return; // query 없으면 작동 안됨
    try {
      if (RealtimeNamefilters[query]) // 지하철 실시간 도착정보와 지하철역 정보 api 간의 역 이름 차이 보완
        setQuery(RealtimeNamefilters[query])
        
      const responseSearch = await axios.get(`http://localhost:8080/search?query=${query}`);
      setRealtimeMetroData(responseSearch.data.realtime);
      setSubwayInfo(responseSearch.data.subwayinfo)
      setSubwayID(responseSearch.data.id);
      setSubwayname(responseSearch.data.name)
      const cleanSubwayline = responseSearch.data.line.map(item => {
        return {
          ...item,
          LINE_NUM: item.LINE_NUM.replace(/^0/, '') // 맨 앞의 0 제거
        };
      });
      setSubwayline(cleanSubwayline);
    } catch (error) {
      console.error(`sendRequest ERROR : ${error}`);
    }
  };

  const addBookmark = async () => {
    if(!token)
      return alert("로그인 해주세요.");
    try {
      const addBookmarkResponse = await axios.post(`http://localhost:8080/search`, {
        subwayName : query, 
        userID : userid, 
      });
      return alert(`${addBookmarkResponse.data.message}`);
    } catch (error) {
      console.log(`addBookmark ERROR : ${error}`);
      return alert(`addBookmark ERROR : ${error}`);
    }
  }

  useEffect(() => {
    sendRequest();  
    document.title = `${query} : 지하철 검색 결과`;  // 페이지 제목 수정
  }, [query]); 

  return (
    <div className="container">
      <SearchBar token={token} userid={userid} />
      <hr />
      <p style={{ fontSize: '0.9rem', color: 'gray' }}>
        * 모든 지하철 정보는 서울시 Open API를 통해 제공되며, 서버나 API 상태에 따라 정보가 부정확할 수 있습니다.
      </p>
      <form className="title-bookmark-form">
        <h3>검색한 역 : <strong>{query ? `${query}` : '찾을 수 없음'}</strong></h3>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="50" height="50" fill="currentColor" 
            className="bi bi-bookmark-star" viewBox="0 0 16 16" onClick={addBookmark} id="bookmark-button"
          >
            <path d="M7.84 4.1a.178.178 0 0 1 .32 0l.634 1.285a.18.18 0 0 0 .134.098l1.42.206c.145.021.204.2.098.303L9.42 6.993a.18.18 0 0 0-.051.158l.242 1.414a.178.178 0 0 1-.258.187l-1.27-.668a.18.18 0 0 0-.165 0l-1.27.668a.178.178 0 0 1-.257-.187l.242-1.414a.18.18 0 0 0-.05-.158l-1.03-1.001a.178.178 0 0 1 .098-.303l1.42-.206a.18.18 0 0 0 .134-.098z"/>
            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
          </svg>      
      </form>
      <div className="metro-line">
        <h5>노선 정보 : </h5>
      {
        subwayline && subwayline.length > 0 ? (
          subwayline.map((item, index) => {
            const metroLine = MetroLineColor.find(line => line.name === item.LINE_NUM); // 호선에 맞는 색이 있는지 찾기
            const metroLineColor = metroLine ? metroLine.color : "#000000"; // 호선에 맞는 색이 없으면 검은색으로
            return (
              <h5 key={index} style={{ color: metroLineColor , fontWeight: 'bold'}}>
                *{item.LINE_NUM}
              </h5>
            );
          })
        ) : (
          <h5>지하철 노선 정보가 없습니다.</h5>
        )
      }
      </div>
      <hr/>
      <h3>🚇 지하철 실시간 도착정보</h3>
      <br/>
      <RealtimeMetro realtimemetroData={realtimemetroData} />
      <FirstAndLastMetro subwayInfo={subwayInfo} subwayline={subwayline} query={query} />
      <br />
      <SubwayAmenities subwayid={subwayid} />
      <SubwayAddress subwayname={subwayname} />
      <SubwayRating query={query} token={token} />
      <SubwayComment query={query} userip={userip} token={token} />
    </div>
  );
}