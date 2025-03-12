import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { useState , useEffect, useContext } from 'react';
import { Context } from '../../App';

export function SubwayComment({ query , userip, token}) {
    const [commentArticle, setCommentArticle] = useState('');
    const [isCommentCreated, setIsCommentCreated] = useState(false);
    const [isCommentDelete, setIsCommentDelete] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [originalComment, setOriginalComment] = useState([]); // 게시글 원본 저장
    const userid = useContext(Context);

    const getCommentList = async() => {
        try {
            const getCommentListResponse = await axios.get(`http://localhost:8080/search/comment`);
            setCommentList(getCommentListResponse.data.commentlist.reverse());
            setOriginalComment(getCommentListResponse.data.commentlist);
        } catch (error) {
            console.error(`getCommentList ERROR : ${error}`);
            return alert("게시글 호출에 실패했습니다.");
        } 
    }

    const createComment = async(e) => {
        e.preventDefault();
        if (!token) 
            return alert("글 작성은 로그인 후 가능합니다.");
        if (commentArticle<=2 && commentArticle>=300)
            return alert("글자수는 2자 이상, 300자 이하입니다.");
        try {
            const createCommentResponse = await axios.post(`http://localhost:8080/search/comment`, {
                query:query, 
                userid:userid, 
                userip : userip,
                article:commentArticle
            });
            setCommentArticle("");
            if (createCommentResponse.data.error) {
                alert(createCommentResponse.data.error);
            } 
        } catch (error) {
            alert("글 작성에 실패했습니다.");
            console.error(`SubwayComment ERROR : ${error}`);
        } finally {
            setIsCommentCreated(true);  // 댓글 작성 후 상태 변경
        }
    }

    const patchLikes = async (commentid) => {
        if (!token) 
            return alert("추천은 로그인 후 가능합니다.");
        try {
            const patchLikesResponse = await axios.patch(`http://localhost:8080/search/comment`, { 
                commentid :  commentid,
                userid : userid,
            });
            alert(patchLikesResponse.data.message);
            if (patchLikesResponse.data.likes) {
                setCommentList((prevList) => 
                    prevList.map((comment) => 
                        comment._id === commentid 
                        ? { ...comment, likes: patchLikesResponse.data.likes } // 서버에서 받은 좋아요 수로 업데이트
                        : comment
                    )
                );
            }
        } catch (error) {
            alert("게시글 추천에 실패했습니다.");
            console.error(`patchLikes ERROR : ${error}`);
        }
    }

    const deleteComment = async(e , commentid) => {
        e.preventDefault();
        if (!token) 
            return alert("글 삭제는 로그인 후 가능합니다.");
        try {
            const deleteCommentResponse = await axios.delete(`http://localhost:8080/search/comment`, {
                data: { 
                    commentid: commentid,
                    userid: userid
                }
            });
            if (deleteCommentResponse.data.message)
                alert(deleteCommentResponse.data.message);
        } catch (error) {
            alert("댓글 삭제에 실패했습니다.");
            console.error(`SubwayComment ERROR : ${error}`);
        } finally {
            setIsCommentDelete(true) // 댓글 삭제 후 상태 변경
        }
    }

    const filterComment = (filter) => {
        let sortedComments = [...originalComment];  // 기존 commentList 복사
    
        if (filter === 'likes') {
            sortedComments.sort((a, b) => b.likes - a.likes);
        } else if (filter === 'commentsOnly') {
            sortedComments = sortedComments.filter(comment => comment.subway === query);
        } else {
            const sortDescending = filter === 'oldest';
            sortedComments.sort((a, b) => {
                const dateA = new Date(a.timestamp);
                const dateB = new Date(b.timestamp);
                return sortDescending ? dateA - dateB : dateB - dateA; // "oldest"일시 오름차순, 아니라면 내림차순
            });
        }
        setCommentList(sortedComments);  // 필터링 된 리스트 상태 업데이트
        setSelectedFilter(filter);       // 선택된 필터 상태 업데이트
    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPageNumber(selectedPage);
    };

    const offset = pageNumber * 10; 
    const currentComments = commentList.slice(offset, offset + 10); // 현재 보여줄 페이지 (현재페이지~현재페이지+10)
    const pageCount = Math.ceil(commentList.length / 10); // 총 페이지 갯수 계산


    useEffect(() => { 
        getCommentList();
        setIsCommentCreated(false); 
        setIsCommentDelete(false);
    }, [isCommentCreated, isCommentDelete]); 

    return (
        <div>
            <br />
            <h4>✍ 게시글 작성</h4>
            <br />
            <p style={{ fontWeight: 'bold' }}>*욕설, 비하, 차별적인 발언 등 타인을 불쾌하게 하는 내용이나 법에 저촉되는 내용은 삭제될 수 있습니다.</p>
            <form>
                <p>게시글 갯수 : {commentList.length}개</p>
                <div className="input-group">
                    <textarea
                        className="form-control"
                        minLength={2}
                        maxLength={300}
                        placeholder="지하철 역에 대한 의견을 남겨주세요."
                        required
                        onChange={(e) => { setCommentArticle(e.target.value); }}
                        value={commentArticle}
                        name="commentArticle"  
                    />
                    <button type="submit" className="btn btn-primary" onClick={createComment}>작성</button>
                </div>
            </form>
            <br />
            <div className="filter-button">
                <p onClick={() => filterComment('likes')}
                    style={{
                        color: selectedFilter === 'likes' ? 'blue' : 'black',
                    }}>
                    추천순
                </p>
                <p onClick={() => filterComment('newest')}
                style={{
                    color: selectedFilter === 'newest' ? 'blue' : 'black',
                    }}
                >
                    최신순
                </p>
                <p onClick={() => filterComment('oldest')}
                style={{
                    color: selectedFilter === 'oldest' ? 'blue' : 'black',
                }}
                >
                    과거순
                </p>
                <p onClick={() => filterComment('commentsOnly')}
                style={{
                    color: selectedFilter === 'commentsOnly' ? 'blue' : 'black',
                }}
                >
                    검색한 역만
                </p>
            </div>
            <br />
            <div>
                {currentComments.map((comment) => (  
                    <div key={comment._id}>
                        <hr className="my-0" style={{ height: '1px' }} />
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p>
                                {comment.commenterName} <span style={{ fontWeight: 'bold' }}>({comment.subway})</span>
                            </p>
                            <button className="liked-button" onClick={() => patchLikes(comment._id) }>
                                <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-hand-thumbs-up" viewBox="0 0 16 16" >
                                    <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                                </svg>
                                <span style={{ color: 'red' }}>{comment.likes}</span>
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-danger btn-sm" 
                                style={{ margin: '1px 0 12px 17px' }} 
                                onClick={(e) => deleteComment(e, comment._id)}>
                                X
                            </button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p>
                                {comment.timestamp}
                            </p>
                            <div className="vr" style={{ backgroundColor: '#000', height: '18px', margin: '2px 10px 0 10px' }} /> {/* 세로줄 */}
                            <p>
                                {comment.commenterIP}
                            </p>
                        </div>
                        <p>{comment.article}</p>
                    </div>
                ))}
                <div className="pagination-container">
                    {
                        commentList?.length>=10 ? (
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
    );
}