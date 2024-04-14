// ChannelNavigation.js

import React, { useState, useEffect } from 'react';

import MobileChannelNavigation from './mobileChannelNavigation';
import DesktopChannelNavigation from './desktopChannelNavigation';

import "../styles/groupNavigation.css";


function ChannelNavigation() {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }
  
    window.addEventListener('resize', handleResize);
  
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    isMobile ? (
      <MobileChannelNavigation />
    ) : (  
      <DesktopChannelNavigation />
    )
  );

}

export default ChannelNavigation;