import React, { useState, useEffect } from 'react';
import { comicsList } from './comicsData.js';
import {
  Menu, Search, Settings,
  Moon, Sun, X, CreditCard
} from 'lucide-react';

export default function PixiComicApp() {
  const [screen, setScreen] = useState('welcome');
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedComic, setSelectedComic] = useState(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Search Filter Logic
  const filteredComics = comicsList.filter((comic) =>
    comic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const themeBlue = "bg-blue-600 hover:bg-blue-700";
  const textThemeBlue = "text-blue-600";

  // Splash screen transition with Netflix style Zoom-In ending
  useEffect(() => {
    if (screen === 'welcome') {
      const timer = setTimeout(() => setScreen('discover'), 3400);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  const Sidebar = () => (
    <>
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
      )}
      
      <div className={`fixed top-0 left-0 h-full w-72 bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl flex flex-col`}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="h-8 w-28 overflow-hidden rounded-md cursor-pointer flex items-center" onClick={() => { setScreen('discover'); setIsMenuOpen(false); }}>
            <img src="https://i.imgur.com/PNkqsSa.jpeg" alt="Pixi Logo" className="w-full h-full object-cover" />
          </div>
          <button onClick={() => setIsMenuOpen(false)} className="p-1 hover:bg-slate-800 rounded">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 py-4 flex flex-col gap-2 px-4">
          <button onClick={() => { setScreen('discover'); setIsMenuOpen(false); }} className="flex items-center gap-4 w-full p-3 hover:bg-slate-800 rounded-xl transition">
            <Search size={20} className={textThemeBlue} /> Discover Comics
          </button>
          
          <button onClick={() => { setScreen('settings'); setIsMenuOpen(false); }} className="flex items-center gap-4 w-full p-3 hover:bg-slate-800 rounded-xl transition">
            <Settings size={20} className={textThemeBlue} /> Settings
          </button>
        </div>
      </div>
    </>
  );

  // Netflix Style Page Flipping & Zoom-In Welcome Screen
  if (screen === 'welcome') {
    return (
      <div className="h-screen w-full bg-[#38B6FF] flex flex-col items-center justify-center overflow-hidden netflix-zoom-container">
        <div className="book-container">
          <div className="book">
            <div className="page">
              <img src="https://i.imgur.com/Uz1WWUD.jpeg" alt="Pixi Logo" className="w-full h-full object-cover" />
            </div>
            <div className="page"></div>
            <div className="page"></div>
          </div>
        </div>
        
        <h2 className="text-white font-black tracking-widest text-xl mt-12 drop-shadow-lg animate-pulse">PIXI COMICS</h2>

        <style>{`
          .netflix-zoom-container {
            animation: netflixZoomOut 0.6s ease-in-out 2.8s forwards;
          }
          .book-container {
            perspective: 1200px;
          }
          .book {
            position: relative;
            width: 150px;
            height: 200px;
            transform-style: preserve-3d;
            animation: floatBook 3s ease-in-out infinite;
          }
          .page {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            border-radius: 4px 12px 12px 4px;
            transform-origin: left center;
            transform-style: preserve-3d;
            box-shadow: 0 12px 30px rgba(0,0,0,0.25);
            overflow: hidden;
            border-left: 3px solid #cbd5e1;
          }
          .page:nth-child(1) {
            animation: flip 1.4s ease-in-out infinite alternate;
            z-index: 3;
          }
          .page:nth-child(2) {
            background: #f8fafc;
            z-index: 2;
          }
          .page:nth-child(3) {
            background: #e2e8f0;
            z-index: 1;
          }
          @keyframes flip {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(-150deg); }
          }
          @keyframes floatBook {
            0%, 100% { transform: translateY(0) rotateX(10deg); }
            50% { transform: translateY(-12px) rotateX(10deg); }
          }
          @keyframes netflixZoomOut {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(3.5); opacity: 0; filter: blur(4px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 animate-fadeIn ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <header className={`sticky top-0 z-30 flex items-center justify-between p-4 shadow-sm backdrop-blur-md ${darkMode ? 'bg-slate-900/80 border-b border-slate-800' : 'bg-white/80 border-b border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-slate-500/20 rounded-lg">
            <Menu size={28} />
          </button>
          
          <div className="flex items-center cursor-pointer h-9 w-28 overflow-hidden rounded-lg" onClick={() => setScreen('discover')}>
            <img src="https://i.imgur.com/YPcn0bd.jpeg" alt="Pixi Logo" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <Sidebar />

      {screen === 'discover' && (
        <main className="max-w-5xl mx-auto p-4 py-8">
          <div className="relative mb-10">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search comics, characters, or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none shadow-sm border ${darkMode ? 'bg-slate-900 border-slate-700 focus:border-blue-500 text-white' : 'bg-slate-50 border-slate-300 focus:border-blue-500 text-slate-900'}`}
            />
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Discover Comics</h2>
            <span className="text-xs text-slate-500">{filteredComics.length} Comics Available</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {filteredComics.map((comic) => (
              <div
                key={comic.id}
                className="cursor-pointer group relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300"
                onClick={() => setSelectedComic(comic)}
              >
                <img src={comic.image} alt={comic.title} className="w-full h-56 md:h-72 object-cover group-hover:scale-105 transition duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded w-fit mb-1">{comic.price}</span>
                  <h3 className="text-white font-bold text-sm md:text-base">{comic.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {screen === 'settings' && (
        <main className="max-w-2xl mx-auto p-4 py-8">
          <h2 className="text-3xl font-bold mb-8">Settings</h2>
          
          <div className={`p-6 rounded-2xl mb-6 border shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon size={24} className={textThemeBlue}/> : <Sun size={24} className={textThemeBlue}/>}
                <div>
                  <h3 className="font-bold text-lg">App Theme</h3>
                  <p className="text-sm text-slate-500">Toggle dark or light mode</p>
                </div>
              </div>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-14 h-8 rounded-full flex items-center p-1 transition-colors ${darkMode ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </main>
      )}

      {/* Comic Details Modal with Payment */}
      {selectedComic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`max-w-xl w-full rounded-3xl overflow-hidden shadow-2xl flex flex-col ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
            <div className="relative h-64">
              <img src={selectedComic.image} alt={selectedComic.title} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedComic(null)} className="absolute top-4 right-4 p-2 bg-black/55 text-white rounded-full hover:bg-black/75">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-black">{selectedComic.title}</h2>
                <span className="text-lg font-bold text-blue-500">{selectedComic.price}</span>
              </div>
              <p className="text-sm text-slate-500 mb-6">Total Pages: {selectedComic.totalPages}</p>

              <div className="space-y-3">
                <a 
                  href={selectedComic.checkoutUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 rounded-xl font-black text-base text-white ${themeBlue} flex items-center justify-center gap-2 transition shadow-lg shadow-blue-500/30`}
                >
                  <CreditCard size={18} /> Proceed to Pay ({selectedComic.price})
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}