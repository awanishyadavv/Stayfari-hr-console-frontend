// src/components/BlurPage.jsx
import React, { useEffect } from 'react';

const BlurPage = () => {
  useEffect(() => {
    const applyBlur = () => {
      document.body.style.filter = 'blur(5px)';
      document.body.style.pointerEvents = 'none';
    };

    const removeBlur = () => {
      document.body.style.filter = 'none';
      document.body.style.pointerEvents = 'auto';
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        applyBlur();
      } else {
        removeBlur();
      }
    };

    const handleWindowBlur = () => {
      applyBlur();
    };

    const handleWindowFocus = () => {
      removeBlur();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  return null;
};

export default BlurPage;
