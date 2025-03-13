import axios from 'axios';
import { useState , useEffect, useContext } from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa'; // 별 아이콘 가져오기
import { Context } from '../../App';

export function SubwayRating({query , token}) {
    const [ratingUserCount, setRatingUserCount] = useState(0);
    const [ratingAverage, setRatingAverage] = useState(0);
    const [starScore, setStarScore] = useState(0);
    const [alertMessage, setAlertMessage] = useState("");
    const userid = useContext(Context);

    const getRatingData = async() => {
      try {
        const getRatingDataResponse = await axios.get(`http://localhost:8080/search/rating?query=${query}`);
        if (getRatingDataResponse.data.totalUsers && getRatingDataResponse.data.average) {
          setRatingUserCount(getRatingDataResponse.data.totalUsers);
          setRatingAverage(getRatingDataResponse.data.average);
        }
      } catch (error) {
        console.error(`getRatingData ERROR : ${error}`);
      }
    }

    const addRating = async() => {
      if (!token) 
        return alert("별점은 로그인 후 가능합니다.");
      if (starScore<=0 || starScore>5) {
        return alert("별점은 1~5점으로만 매길 수 있습니다.");
      }
      try {
        const addRatingResponse = await axios.post(`http://localhost:8080/search/rating`, {
          query : query,
          score : starScore,
          userid : userid,
        })
        setAlertMessage(addRatingResponse.data.message);
        if (addRatingResponse.data.message!=='이미 해당 지하철역의 별점을 추가하셨습니다.')
          window.location.replace(`/search?query=${encodeURIComponent(query)}`); // 새로고침
      } catch (error) {
        console.error(`addRating ERROR : ${error}`);
        alert("별점 매기기에 실패했습니다.");
      } 
    }

    useEffect(() => {
      getRatingData();
    }, [query]);  
    
    return (
        <div>
          <hr />
          <h3><strong>{query.slice(-1)==='역' ? `${query}` :  `${query}역`}</strong> 의견 작성</h3> {/* 마지막 글자가 역이 아닐 시엔 '역' 붙이기 */}
          <br />
          <h4>🌟 평점 작성</h4>
          <span><FaStar/> {ratingAverage.toFixed(2)} ({ratingUserCount}명 참여)</span> {/* 소숫점 2자리까지만 */}
          {
              [...Array(5)].map((_, star) => ( // 0~4까지의 배열 생성, - : value 생략
                <span key={star} onClick={() => setStarScore(star + 1)}>
                  {star + 1 <= starScore ? (
                    <FaStar className="star-full" />
                  ) : (
                    <FaRegStar className="star" />
                  )}
                </span>
              ))
          }
          <button type="button" className="btn btn-outline-warning" onClick={() => addRating()}>평가</button>
          <br />
          {
            alertMessage && alertMessage==='이미 해당 지하철역의 별점을 추가하셨습니다.' ? (
              <strong style={{color : "red"}}>* {alertMessage}</strong> 
            ) : (
              <p></p> 
            )
          }
        </div>
    )
}