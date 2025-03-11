export const ErrorPage = ({error, errorInfo}) => {
    return (
        <div className="custom-bg text-dark" id="error-page">
            <div className="d-flex align-items-center justify-content-center min-vh-100 px-2">
                <div className="text-center">
                    <h1 className="display-1 fw-bold">{error ? error : "404 Not Found"}</h1>
                    <p className="fs-2 fw-medium mt-4">페이지 오류입니다. 개발자에게 문의해주세요 (cka8701@gmail.com)</p>
                    <p className="mt-4 mb-5">죄송합니다. 다시 접속하거나, 잠시 후 다시 접속해 주세요.</p>
                    <p className="mt-4 mb-5">{errorInfo && `에러 정보 : ${errorInfo}` }</p>
                    <a href="/" className="btn btn-light fw-semibold rounded-pill px-4 py-2 custom-btn">
                        메인 화면으로
                    </a>
                </div>
            </div>
        </div>
    );
}