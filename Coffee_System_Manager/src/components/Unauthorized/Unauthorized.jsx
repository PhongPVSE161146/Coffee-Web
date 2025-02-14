import React, { useState, useEffect } from 'react';
import { gsap, Sine } from 'gsap';
import holdUp from "../../assets/access-denied_Is238Ly.mp3";
import { useNavigate } from "react-router-dom";

import './Unauthorized.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  useEffect(() => {
    // GSAP animations
    const tl = gsap.timeline({ defaults: { duration: 1.5, ease: Sine.easeOut } });

    tl.fromTo('.mainCircle',
      { fill: '#41E969', stroke: '#41E969' },
      { fill: 'transparent', stroke: '#F70048', strokeWidth: 6, duration: 0.8 }
    ).to('.mainCircle', { duration: 1.5 }, "<");

    tl.fromTo('.dashedRing', {
      stroke: '#41E969',
      scale: 1,
      rotation: 0,
    },
      {
        stagger: 0.4,
        stroke: '#F70048',
        scale: 0.8,
        transformOrigin: '50% 50%',
        rotation: 180,
        duration: 1,
      }, "<");

    tl.to('.dashedRing', {
      stagger: 0.5,
      repeat: -1,
      yoyo: true,
      scale: 0.9,
      rotation: 360,
      duration: 12,
    });
  }, []);

  return (
    <div className='unauthorizedPage' >
      <audio autoPlay>
        <source src={holdUp} type='audio/mpeg'/>
      </audio>
      <div className='error-text' > ERROR 401!<span>|</span> </div>
      <svg viewBox="200 150 400 300" preserveAspectRatio="xMidYMid meet" width="100%" height="50vmax">
        <defs>
          {/*outter ring*/}
          <circle id="dashedRing1" className="dashedRing" cx="400" cy="300" r="60" stroke="#41E969" strokeWidth="6" fill="none" strokeDasharray="4,4" />
          <circle id="dashedRing2" className="dashedRing" cx="400" cy="300" r="75" stroke="#41E969" strokeWidth="10" fill="none" strokeDasharray="5,5" opacity="0.6" />
          <circle id="dashedRing3" className="dashedRing" cx="400" cy="300" r="90" stroke="#41E969" strokeWidth="12" fill="none" strokeDasharray="6,6" opacity="0.2" />
        </defs>

        {/* Main Circle*/}
        <circle cx="400" cy="300" r="40" className="mainCircle" fill="#41E969" />

        <use xlinkHref="#dashedRing1" />
        <use xlinkHref="#dashedRing2" />
        <use xlinkHref="#dashedRing3" />
      </svg>

      <div className='Unauthorized-text' > Unauthorized </div>

      <div className='returnBtn' onClick={handleGoBack} > Go Back </div>
    </div>
  );
};

export default Unauthorized;