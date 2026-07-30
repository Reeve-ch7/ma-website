import React from 'react';
import './Preloader.css';

export default function Preloader({ visible }) {
  return (
    <div className={`preloader${visible ? '' : ' preloader--hidden'}`} aria-hidden={!visible}>
      <div className="preloader__mark">
        <img src="/men-aloho-logo.jpg" alt="" className="preloader__logo" />
        <p className="preloader__name">Men Aloho</p>
      </div>
      <div className="preloader__bar">
        <span className="preloader__bar-fill" />
      </div>
    </div>
  );
}
