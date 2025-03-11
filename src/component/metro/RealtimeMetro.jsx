// import { useState } from 'react';
import { APIfilters, metroOption, groupedByUpdnLine } from "../../filters/APIfilters";

export function RealtimeMetro({realtimemetroData}) {
    const groupRealtimeData = groupedByUpdnLine(realtimemetroData) // 상하행선 기준으로 분리
    // const metroupdnlineList = Object.keys(groupRealtimeData);

    if (realtimemetroData.message) {
        return (
            <div>
                <h3>{realtimemetroData.code} 에러 발생!</h3>
                <h3>{realtimemetroData.message}</h3>
                <h3>{APIfilters[realtimemetroData.code]}</h3>
                <hr></hr>
            </div>
        );
    }

    return (
        <div className="row">
          {Object.keys(groupRealtimeData).map((updnLine) => (
            <div className="col" key={updnLine}>
              <h4>{updnLine}</h4>
              <ul style={{ listStyleType: 'none', paddingLeft: 0 }}> {/* li 점 지우기, 왼쪽 padding 지우기 */}
                {groupRealtimeData[updnLine].map((metro, index) => (
                  <li key={index}>
                    <p style={{ fontSize: '0.8rem', color: 'gray' }}>* {metro.recptnDt} 기준</p>
                    <p>{metroOption[metro.subwayId]} {metro.trainLineNm}</p>
                    <p style={{color: metro.btrainSttus !== '일반' ? 'red' : 'black',}}>
                        열차 종류 : {metro.btrainSttus }
                    </p>
                    <strong>현재 위치 : {metro.arvlMsg2}</strong>
                    <strong style={{ color: 'red' }}>
                      {metro.lstcarAt === '1' && ' 막차'}
                    </strong>
                    <hr />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
}