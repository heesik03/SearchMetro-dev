import { useState, useEffect } from 'react';

export const useDebounce = (value, delay) => { // 커스텀 훅
    const [debouncedValue, setDebouncedValue] = useState(value);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedValue(value); // 0.3초 delay 줌
      }, delay);
  
      return () => {
        clearTimeout(timer); // 시간 설정 초기화
      };
    }, [value, delay]);
  
    return debouncedValue;
  };