import { useState, useEffect } from 'react';
import SubwayAmenitiesData from '../../json/SubwayAmenitiesData.json';

export function SubwayAmenities({ subwayid }) {
  const [amenities, setAmenities] = useState(null);

  useEffect(() => {
    const result = SubwayAmenitiesData.DATA.find(item => item.station_id === subwayid);
    setAmenities(result); 
  }, [subwayid]); 

  if (!amenities) {
    return (
      <>
          <h4>편의시설 정보가 없습니다.</h4>
          <hr />
      </>
  )
  }
  return (
    <div>
      <h3>{amenities.station_name} 편의시설 정보</h3>
      <p style={{ fontSize: '0.9rem', color: 'gray' }}>2025-03-07 기준</p>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr> 
              <th scope="col">환승주차자</th>
              <th scope="col">무인민원발급기</th>
              <th scope="col">엘리베이터</th>
              <th scope="col">휠체어리프트</th>
              <th scope="col">유아수유방</th>
              <th scope="col">기차예매역</th>
              <th scope="col">만남의장소</th>
              <th scope="col">문화공간</th>
              <th scope="col">환전키오스크</th>
            </tr>
          </thead>
          <tbody>
            <tr> 
              <td>{amenities.parking}</td>
              <td>{amenities.cim}</td>
              <td>{amenities.el}</td>
              <td>{amenities.wl}</td>
              <td>{amenities.fdroom}</td>
              <td>{amenities.train}</td>
              <td>{amenities.place}</td>
              <td>{amenities.culture}</td>
              <td>{amenities.exchange}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  );
}