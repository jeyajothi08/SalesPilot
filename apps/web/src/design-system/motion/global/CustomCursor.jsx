import { useEffect } from 'react';

export const CustomCursor = () => {
  useEffect(() => {
    document.body.style.cursor = 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  return null;
};

