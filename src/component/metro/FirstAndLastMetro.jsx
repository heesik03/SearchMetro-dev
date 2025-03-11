import axios from 'axios';
import Select from 'react-select';
import { useState } from 'react';
import { uplndnlnOptions, dayofweekOptions, trainlineOptions } from "../../filters/SelectOptions";

export function FirstAndLastMetro({subwayid , subwayline}) {
    const [uplndnln , setUplnDnln] = useState('');
    const [dayofweek, setDayofWeek] = useState('');
    const [trainline, setTrainLine] = useState('');
    const [firstandlast, setFirstAndLast] = useState('');
    const [printpage, setPrintpage] = useState(false);

    const filteredSubwayline = trainlineOptions.filter(option => 
        subwayline.some(item => item.LINE_NUM === option.value) // 1~9호선 중 하나를 거름
    );
    
    const SearchFirstandLast = async() => {
        if(uplndnln === '' || dayofweek === '' || trainline === '') {
            return alert("값을 전부 넣어주세요.");
        }
        try {
            const SearchFirstandLastResponse = await axios.get(
                `http://localhost:8080/search/FirstAndLast?subwayid=${subwayid}&uplndnln=${uplndnln}&dayofweek=${dayofweek}&trainline=${trainline}`
            );
            if (!SearchFirstandLastResponse.data.Info.RESULT) {
                setFirstAndLast(SearchFirstandLastResponse.data.Info);
            } else {
                alert(SearchFirstandLastResponse.data.Info.RESULT.MESSAGE);
                setFirstAndLast('');
            }
        } catch (error) {
            console.error(`SearchFirstandLast ERROR : ${error}`);
        } finally {
            setPrintpage(true)
        }
    }

    function formatTime(timeString) { // 시간 형식 변환 : 시간분초 => (시간:분:초)
        const hours = timeString.slice(0, 2); 
        const minutes = timeString.slice(2, 4); 
        const seconds = timeString.slice(4, 6); 
      
        return `${hours}:${minutes}:${seconds}`;
      }

    const FirstAndLastMetroResults = () => {
        if(!firstandlast) {
            return (
                <h3>검색에 실패했습니다. 값을 다시 입력해주세요. </h3>
            );
        }
        return (
            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}> {/* li 점 지우기, 왼쪽 padding 지우기 */}
                <br />
                <li>
                    <h4>첫차 정보</h4>
                    <p style={{ fontWeight: 'bold' }}>
                        첫차 시간 : <span style={{ color: 'blue' }}> {formatTime(firstandlast.FSTT_HRM)} </span>
                    </p>
                    <p>출발역 : {firstandlast. FSTT_DPTRE_STTN}</p>
                    <p>도착역 : {firstandlast.FSTT_ARVL_STTN}</p>
                </li>
                <br />
                <li>
                    <h4>막차 정보</h4>
                    <p style={{ fontWeight: 'bold' }}> 
                        막차 시간 : <span style={{ color: 'red' }}> {formatTime(firstandlast.LSTTM_HRM)} </span>
                    </p>
                    <p>출발역 : {firstandlast.LSTTM_DPTRE_STTN}</p>
                    <p>도착역 : {firstandlast.LSTTM_ARVL_STTN}</p>
                </li>
                <hr></hr>
            </ul>
        );
    }

    const Empty = () => {
        return;
    }

    return (
        <div>
            <Select options={uplndnlnOptions} onChange={selectedOption => setUplnDnln(selectedOption.value)} placeholder='상/하행 선택' />
            <Select options={dayofweekOptions} onChange={selectedOption => setDayofWeek(selectedOption.value)} placeholder='요일 선택' />
            <Select options={filteredSubwayline} onChange={selectedOption => setTrainLine(selectedOption.value)} placeholder='호선 선택' />
            <button
            type="button"
            className="btn btn-outline-primary"
            onClick={SearchFirstandLast}
            style={{ marginTop: '20px' }}
            >
                검색
            </button>

            {printpage ? <FirstAndLastMetroResults /> : <Empty />}
        </div>
    );
}
