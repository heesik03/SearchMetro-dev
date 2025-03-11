import axios from 'axios';
import { useContext  } from 'react';
import { SearchBar } from './SearchBar';
import { useFetchBookmarks } from '../hook/useFetchBookmark';
import { Context } from '../App';

export function Main({token}) {
    const userid = useContext(Context);
    const [bookmarkArray, setBookmarkArray] = useFetchBookmarks(token, userid); // useFetchBookmarks 훅으로 상태와 setter 가져오기

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
                setBookmarkArray(prevBookmarks => prevBookmarks.filter(b => b !== bookmark));
        } catch (error) {
            alert("북마크 삭제에 실패했습니다.");
            console.error(`SubwayComment ERROR : ${error}`);
        }
    }

    return (
        <div className="container">
            {bookmarkArray?.length? (
                <ul className="list-group">
                    <h4>북마크한 지하철역</h4>
                    {bookmarkArray.map((bookmark) => (
                        <li className="list-group-item" key={bookmark}>
                            <a href={`search?query=${bookmark}`} style={{ textDecoration: 'none' }} id="main-bookmark">
                                - {bookmark}
                            </a>
                            <input type="button" className="del-bookmark" value="X" onClick={() => deleteBookmark(userid, bookmark)} />
                        </li>
                    ))}
                </ul>
            ) : (
                <p></p>
            )}
            <hr />
            <SearchBar token={token} />
        </div>
    );
}