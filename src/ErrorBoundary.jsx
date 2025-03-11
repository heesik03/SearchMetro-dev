import React from "react";
import { ErrorPage } from "./component/ErrorPage";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false }; // 에러 발생 여부를 추적하는 상태 초기화
  }

  static getDerivedStateFromError(error) {
    // 에러가 발생하면 호출되며, 상태를 업데이트하여 다음 렌더링에 폴백 UI를 표시하도록 설정
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 에러가 발생했을 때 호출되며, 추가적인 에러 정보를 출력
    console.error(`리액트 페이지 에러 : ${error} errorInfo : ${errorInfo}`);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage 
          error={this.state.error?.toString()} 
          errorInfo={this.state.errorInfo?.componentStack} 
        />
      );
    }
  
    return this.props.children; // 에러가 발생하지 않은 경우 자식 컴포넌트(원래 웹사이트)를 렌더링
  }
  
}