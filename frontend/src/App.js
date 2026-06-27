import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import MusicRequest from './components/MusicRequest';
import Music from './components/Music';
import Concerts from './components/Concerts';
import Gallery from './components/Gallery';
import Watch from './components/Watch';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Login from './components/Login';
import Settings from './components/Settings';

function MainSite({ scrolled, darkMode, toggleDark }) {
  return (
    <div className="App">
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
        <Routes>
          <Route path="/" element={<MainSite scrolled={scrolled} darkMode={darkMode} toggleDark={toggleDark} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  );
}

export default App;
