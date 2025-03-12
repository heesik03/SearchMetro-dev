import { useState , useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { SubwayNameList } from '../filters/SubwayNameList';
import { useDebounce } from '../hook/useDebounce';
import { useFetchBookmarks } from '../hook/useFetchBookmark';
import { Context } from '../App';

export function SearchBar({token}) {
    const userid = useContext(Context);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState([]); 
    const [bookmarkArray, setBookmarkArray] = useFetchBookmarks(token, userid);
    const navigate = useNavigate();
    const debouncedSearchQuery = useDebounce(searchQuery, 300); // 과도한 요청, 처리를 방지하기 위한 Debounce

    const filterSubwayList = () => {
        const filteredList = SubwayNameList.filter((list) =>
          list.includes(debouncedSearchQuery)
        );
        const uniqueFilteredList = [...new Set(filteredList)]; // 같은 결과값 방지
        setSearchSuggestions(uniqueFilteredList);
      };

      useEffect(() => {
        if (debouncedSearchQuery==='') {
            setSearchSuggestions([]); // 배열 초기화
            return;
        }
        filterSubwayList()
    }, [debouncedSearchQuery]);

    return (
        <div>
            <div className="input-group">
                <input 
                type="search" 
                className="form-control rounded" 
                placeholder="지하철 이름을 입력해주세요..."
                value={searchQuery} // 입력 값은 searchQuery로 
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) { // Enter 키가 눌리고 검색어가 비어 있지 않으면
                    navigate(`/search?query=${encodeURIComponent(searchQuery)}`); // 검색 결과로 이동
                    }
                }}
                />
                    <button type="button" className="btn btn-outline-primary" onClick={() => {
                    if (searchQuery.trim()) { // 검색어가 비어 있지 않으면
                        navigate(`/search?query=${encodeURIComponent(searchQuery)}`); // 쿼리 파라미터로 검색어를 전달
                    }
                    }}>🔍</button>
            </div>
            {searchSuggestions.length ? (
                <ul className="suggestions-ul" style={{ paddingLeft: 0 }}>
                    {searchSuggestions.map((item, index) => (
                        <li key={index}>
                            <a href={`search?query=${item}`} style={{ textDecoration: 'none', color: (bookmarkArray ?? []).includes(item) ? "#feb309" : "black" }}>
                                {item}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p></p>
            )}
        </div>
    );
}