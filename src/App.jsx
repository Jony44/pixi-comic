import React, { useState, useEffect } from 'react';
import { comicsList } from './comicsData.js';
import {
  Menu, Search, Settings,
  User, Moon, Sun, X, PlusCircle, CreditCard
} from 'lucide-react';

export default function PixiComicApp() {
  const [screen, setScreen] = useState('welcome');
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedComic, setSelectedComic] = useState(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Admin Email Configuration (Always Admin now or direct access)
  const isAdmin = true; // දැන් හැමෝටම හෝ ඇමින් කෙනෙක් ලෙස පහසුවෙන් ක්‍රියාත්මක වේ

  // Search Filter Logic
  const filteredComics = comicsList.filter((comic) =>
    comic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Admin Form States
  const [adminTitle, setAdminTitle] = useState('');
  const [adminPrice, setAdminPrice] = useState('$3.99');
  const [adminImage, setAdminImage] = useState('');
  const [adminCheckoutUrl, setAdminCheckoutUrl] = useState('');
  const [adminPdfUrl, setAdminPdfUrl] = useState('');
  const [adminTotalPages, setAdminTotalPages] = useState('10');

  const themeBlue = "bg-blue-600 hover:bg-blue-700";
  const textThemeBlue = "text-blue-600";

  // Splash Screen Animation Effect (Zoom in & Blur effect)
  useEffect(() => {
    if (screen === 'welcome') {
      const timer = setTimeout(() => setScreen('discover'), 2500);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // Handle Comic Upload by Admin
  const handleUploadComic = (e) => {
    e.preventDefault();
    if (!adminTitle || !adminImage) {
      alert("Please fill title and image fields!");
      return;
    }

    const newEntry = {
      id: Date.now(),
      title: adminTitle,
      price: adminPrice || 'Free',
      image: adminImage,
      checkoutUrl: adminCheckoutUrl || 'https://pixicomics.lemonsqueezy.com/checkout/buy/d4f5f3de-b1fb-45ff-83d9-9f3de564e56f?discount=0',
      pdfUrl: adminPdfUrl || '#',
      totalPages: parseInt(adminTotalPages, 10) || 10
    };

    comicsList.unshift(newEntry);
    setAdminTitle('');
    setAdminPrice('$3.99');
    setAdminImage('');
    setAdminCheckoutUrl('');
    setAdminPdfUrl('');
    setAdminTotalPages('10');
    alert("Comic uploaded successfully! 🚀");
    setScreen('discover');
  };

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
          
          <button onClick={() => { setScreen('admin'); setIsMenuOpen(false); }} className="flex items-center gap-4 w-full p-3 hover:bg-slate-800 rounded-xl transition text-amber-400">
            <PlusCircle size={20} /> Admin Upload Panel
          </button>
          
          <button onClick={() => { setScreen('settings'); setIsMenuOpen(false); }} className="flex items-center gap-4 w-full p-3 hover:bg-slate-800 rounded-xl transition">
            <Settings size={20} className={textThemeBlue} /> Settings
          </button>
        </div>
      </div>
    </>
  );

  // Welcome Screen with Zoom-in and Blur Animation
  if (screen === 'welcome') {
    return (
      <div className="h-screen w-full bg-[#38B6FF] flex flex-col items-center justify-center overflow-hidden">
        <div className="w-48 h-48 flex items-center justify-center mb-4 overflow-hidden rounded-3xl shadow-2xl animate-pulse transition-all duration-1000 transform scale-110 hover:scale-125 filter blur-[0.5px]">
          <img src="https://i.imgur.com/Uz1WWUD.jpeg" alt="Pixi Logo" className="w-full h-full object-cover transition-transform duration-700 transform hover:scale-110" />
        </div>
        <p className="text-white/90 text-sm font-bold tracking-wider animate-bounce">Loading Pixi Universe...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <header className={`sticky top-0 z-30 flex items-center justify-between p-4 shadow-sm backdrop-blur-md ${darkMode ? 'bg-slate-900/80 border-b border-slate-800' : 'bg-white/80 border-b border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-slate-500/20 rounded-lg">
            <Menu size={28} />
          </button>
          
          <div className="flex items-center cursor-pointer h-9 w-28 overflow-hidden rounded-lg" onClick={() => setScreen('discover')}>
            <img src="https://i.imgur.com/YPcn0bd.jpeg" alt="Pixi Logo" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setScreen('admin')} className="hidden md:flex items-center gap-1 bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-500/20 hover:bg-amber-500/20 transition">
            <PlusCircle size={16} /> Admin Upload
          </button>
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

      {/* ADMIN SCREEN */}
      {screen === 'admin' && (
        <main className="max-w-xl mx-auto p-4 py-8">
          <div className={`p-8 rounded-3xl border shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className="text-3xl font-black mb-2 text-amber-500">Admin Comic Upload</h2>
            <p className="text-sm text-slate-500 mb-6">Publish a new comic issue and attach its checkout and PDF link.</p>

            <form onSubmit={handleUploadComic} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Comic Title</label>
                <input
                  type="text"
                  value={adminTitle}
                  onChange={(e) => setAdminTitle(e.target.value)}
                  placeholder="e.g. Cyber Punk Episode 2"
                  className={`w-full p-3.5 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Price (e.g. $3.99)</label>
                <input
                  type="text"
                  value={adminPrice}
                  onChange={(e) => setAdminPrice(e.target.value)}
                  placeholder="$3.99"
                  className={`w-full p-3.5 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Image Cover URL</label>
                <input
                  type="text"
                  value={adminImage}
                  onChange={(e) => setAdminImage(e.target.value)}
                  placeholder="https://..."
                  className={`w-full p-3.5 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Lemon Squeezy Checkout URL</label>
                <input
                  type="text"
                  value={adminCheckoutUrl}
                  onChange={(e) => setAdminCheckoutUrl(e.target.value)}
                  placeholder="https://pixicomics.lemonsqueezy.com/checkout/buy/..."
                  className={`w-full p-3.5 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">PDF Download URL (Supabase/Drive link)</label>
                <input
                  type="text"
                  value={adminPdfUrl}
                  onChange={(e) => setAdminPdfUrl(e.target.value)}
                  placeholder="https://...file.pdf"
                  className={`w-full p-3.5 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Total Pages</label>
                <input
                  type="number"
                  value={adminTotalPages}
                  onChange={(e) => setAdminTotalPages(e.target.value)}
                  placeholder="23"
                  className={`w-full p-3.5 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                />
              </div>

              <button type="submit" className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl shadow-lg transition mt-4">
                Publish Comic & PDF 🚀
              </button>
            </form>
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