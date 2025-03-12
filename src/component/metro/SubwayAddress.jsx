import { useState, useEffect } from 'react';
import SubwayAddressData from '../../json/SubwayAddressData.json';

export function SubwayAddress({ subwayname }) {
    const [address, setAddress] = useState(null);
    
    useEffect(() => {
        const result = SubwayAddressData.DATA.find(item => item.sbwy_stns_nm === subwayname);
        setAddress(result); 
      }, [subwayname]); 
    
    if (!address) {
        return <h5>* 역 주소, 전화번호 정보가 없는 역입니다.</h5>        
    }

    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">도로명주소</th>
                        <th scope="col">전화번호</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{address.road_nm_addr}</td>
                        <td>{address.telno}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}