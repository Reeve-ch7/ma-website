import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Choristers from './components/Choristers';
import MusicRequest from './components/MusicRequest';
import Music from './components/Music';
import Concerts from './components/Concerts';
import Gallery from './components/Gallery';
import Watch from './components/Watch';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Login from './components/Login';
import Settings from './components/Settings';
import Analytics from './components/Analytics';
import Enquiry from './components/Enquiry';
import NotFound from './components/NotFound';
import Preloader from './components/Preloader';
import useAssetsLoaded from './utils/useAssetsLoaded';
import { trackVisit, sendHeartbeat } from './lib/analyticsService';

const HOME_CRITICAL_ASSETS = ['/men-aloho-logo.jpg'];

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function AnalyticsTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    trackVisit(pathname);
  }, [pathname]);

  useEffect(() => {
    sendHeartbeat();
    const id = setInterval(sendHeartbeat, 30_000);
    return () => clearInterval(id);
  }, []);

  return null;
}

function MainSite({ scrolled, darkMode, toggleDark }) {
  const assetsLoaded = useAssetsLoaded(HOME_CRITICAL_ASSETS);

  useEffect(() => {
    document.body.style.overflow = assetsLoaded ? '' : 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [assetsLoaded]);

  return (
    <div className="App">
      <Preloader visible={!assetsLoaded} />
      {assetsLoaded && (
        <>
          <Navbar scrolled={scrolled} darkMode={darkMode} toggleDark={toggleDark} />
          <Hero />
          <Music />
          <Watch />
          <About />
          <Concerts />
          <MusicRequest />
          <Gallery />
          <Contact />
          <Footer />
        </>
      )}
    </div>
  );
}

function ChoristersPage({ scrolled, darkMode, toggleDark }) {
  return (
    <div className="App">
      <Navbar scrolled={scrolled} darkMode={darkMode} toggleDark={toggleDark} />
      <Choristers />
      <Footer />
    </div>
  );
}

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('ma-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('ma-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDark = () => {
    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setDarkMode(d => !d);
      });
    });
    setTimeout(() => root.classList.remove('theme-transitioning'), 2000);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AdminProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AnalyticsTracker />
        <Routes>
          <Route path="/" element={<MainSite scrolled={scrolled} darkMode={darkMode} toggleDark={toggleDark} />} />
          <Route path="/choristers" element={<ChoristersPage scrolled={scrolled} darkMode={darkMode} toggleDark={toggleDark} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  );
}

export default App;
