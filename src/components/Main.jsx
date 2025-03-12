import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { useState , useContext  } from 'react';
import { SearchBar } from './SearchBar';
import { useFetchBookmarks } from '../hook/useFetchBookmark';
import { Context } from '../App';

export function Main({token}) {
    const userid = useContext(Context);
    const [bookmarkArray, setBookmarkArray] = useFetchBookmarks(token, userid); // useFetchBookmarks 훅으로 상태와 setter 가져오기
    const [bookmarkPageNumber, setBookmarkPageNumber] = useState(0);

    const deleteBookmark = async (userid, bookmark) => {
        try {
            const deleteBookmarkResponse = await axios.delete(`http://localhost:8080/`, {
                data: { 
                    userid: userid,
                    bookmark: bookmark
                }
            });
            alert(deleteBookmarkResponse.data.message);
            if (deleteBookmarkResponse.data.message==='북마크 삭제 성공')
                setBookmarkArray(prevBookmarks => prevBookmarks.filter(b => b !== bookmark)); // 삭제한 북마크 항목 적용
        } catch (error) {
            alert("북마크 삭제에 실패했습니다.");
            console.error(`SubwayComment ERROR : ${error}`);
        }
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setBookmarkPageNumber(selectedPage);
    };

    const offset = bookmarkPageNumber * 5; 
    const currentBookmark = bookmarkArray.slice(offset, offset + 5); // 현재 보여줄 페이지 (현재페이지~현재페이지+5)
    const pageCount = Math.ceil(bookmarkArray.length / 5); // 총 페이지 갯수 계산

    return (
        <div className="container">
            {bookmarkArray?.length? (
                <div>
                    <h4>🔖 북마크한 지하철역</h4>
                    <div className="bookmark-container">
                        <ul className="list-group">
                            {currentBookmark.map((bookmark) => (
                                <li className="list-group-item" key={bookmark}>
                                    <a href={`search?query=${bookmark}`} style={{ textDecoration: 'none' }} id="main-bookmark">
                                        - {bookmark}
                                    </a>
                                    <input type="button" className="del-bookmark" value="X" onClick={() => deleteBookmark(userid, bookmark)} />
                                </li>
                            ))}
                        </ul>

                        <div className="pagination-container">
                            {
                                bookmarkArray?.length>=5 ? (
                                    <ReactPaginate
                                    containerClassName={"pagination"} 
                                    pageClassName={"page-item"}
                                    activeClassName={"active"}
                                    breakLabel="..." // 페이지가 많을 때 '...'을 표시
                                    nextLabel=">"  
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={5}  // 한 번에 보여줄 페이지 버튼의 수
                                    pageCount={pageCount} // 전체 페이지 수
                                    previousLabel="<"
                                    renderOnZeroPageCount={null} // 페이지가 없을 때 페이지네이션을 렌더링하지 않음
                                    />
                                ) : (
                                    <p></p>
                                )
                            }
                        </div>
                    </div>
                </div>
            ) : (
                <p></p>
            )}
            <hr />
            <div id="mainpage-searchBar">
                <SearchBar token={token} />
            </div>
            <div className="container">
                <iframe
                    width="100%"
                    height="500px"
                    src="https://www.youtube.com/embed/I7jce3OqWVc?si=FF3PcWebPdJ3FMFO&amp;start=1"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                />
            </div>
        </div>
    );
}