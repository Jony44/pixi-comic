import React, { useState, useEffect } from 'react';
import {
  Menu, Search, Settings, LogOut,
  User, Moon, Sun, X, PlusCircle, Trash2, Lock, BookOpen, ArrowLeft, ArrowRight
} from 'lucide-react';

export default function PixiComicApp() {
  const [screen, setScreen] = useState('welcome');
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(true);
  const [selectedComic, setSelectedComic] = useState(null);

  // User States
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loggedUserEmail, setLoggedUserEmail] = useState('');

  // Admin Email Configuration
  const ADMIN_EMAIL = "maneesharavihara0@gmail.com";
  const isAdmin = loggedUserEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  // Comics Data State
  const [comicsList, setComicsList] = useState([
    {
      id: 1,
      title: 'Doomquest',
      price: 'Free',
      image: '6294257036396533852.jpg',
      pdfUrl: 'Doomquest003(2026).pdf',
      totalPages: '23'
    }
  ]);

  // Admin Form States
  const [adminTitle, setAdminTitle] = useState('');
  const [adminPrice, setAdminPrice] = useState('Free');
  const [adminImage, setAdminImage] = useState('');
  const [adminPdf, setAdminPdf] = useState('');
  const [adminTotalPages, setAdminTotalPages] = useState('10');

  // Reader States
  const [readingComic, setReadingComic] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Touch Swipe States for Mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const themeBlue = "bg-blue-600 hover:bg-blue-700";
  const textThemeBlue = "text-blue-600";

  useEffect(() => {
    if (screen === 'welcome') {
      const timer = setTimeout(() => setScreen('auth'), 3000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // ==========================================
  // ⌨️ Keyboard Arrows Support for Reader
  // ==========================================
  useEffect(() => {
    if (screen !== 'reader' || !readingComic) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        changePage(currentPage + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        changePage(currentPage - 1);
      } else if (e.key === 'Escape') {
        closeReader();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, readingComic, currentPage]);

  // Handle Comic Upload by Admin
  const handleUploadComic = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert("Unauthorized! Only Admin can upload comics.");
      return;
    }
    if (!adminTitle || !adminImage) {
      alert("Please fill title and image fields!");
      return;
    }

    const newEntry = {
      id: Date.now(),
      title: adminTitle,
      price: adminPrice || 'Free',
      image: adminImage,
      pdfUrl: adminPdf,
      totalPages: parseInt(adminTotalPages, 10) || 10
    };

    setComicsList([newEntry, ...comicsList]);
    setAdminTitle('');
    setAdminPrice('Free');
    setAdminImage('');
    setAdminPdf('');
    setAdminTotalPages('10');
    alert("Comic & PDF uploaded successfully by Admin! 🚀");
    setScreen('discover');
  };

  const startReading = (comic) => {
    const savedPage = localStorage.getItem(`bookmark_${loggedUserEmail}_${comic.id}`);
    const startPage = savedPage ? parseInt(savedPage, 10) : 1;
    
    setReadingComic(comic);
    setCurrentPage(startPage);
    setScreen('reader');
  };

  const changePage = (newPage) => {
    if (readingComic && newPage >= 1 && newPage <= readingComic.totalPages) {
      setCurrentPage(newPage);
      localStorage.setItem(`bookmark_${loggedUserEmail}_${readingComic.id}`, newPage);
    }
  };

  const closeReader = () => {
    setReadingComic(null);
    setScreen('discover');
  };

  // ==========================================
  // 📱 Mobile Swipe Handlers
  // ==========================================
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe Left -> Next Page
      changePage(currentPage + 1);
    } else if (isRightSwipe) {
      // Swipe Right -> Previous Page
      changePage(currentPage - 1);
    }
  };

  const Sidebar = () => (
    <>
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
      )}
      
      <div className={`fixed top-0 left-0 h-full w-72 bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl flex flex-col`}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="h-8 w-28 overflow-hidden rounded-md cursor-pointer flex items-center" onClick={() => { setScreen('discover'); setIsMenuOpen(false); }}>
            <img src="/6318815573495714036.jpg" alt="Pixi Logo" className="w-full h-full object-cover" />
          </div>
          <button onClick={() => setIsMenuOpen(false)} className="p-1 hover:bg-slate-800 rounded">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 py-4 flex flex-col gap-2 px-4">
          <button onClick={() => { setScreen('discover'); setIsMenuOpen(false); }} className="flex items-center gap-4 w-full p-3 hover:bg-slate-800 rounded-xl transition">
            <Search size={20} className={textThemeBlue} /> Discover Comics
          </button>
          
          <button onClick={() => { setScreen('profile'); setIsMenuOpen(false); }} className="flex items-center gap-4 w-full p-3 hover:bg-slate-800 rounded-xl transition">
            <User size={20} className={textThemeBlue} /> My Profile
          </button>
          
          {isAdmin && (
            <button onClick={() => { setScreen('admin'); setIsMenuOpen(false); }} className="flex items-center gap-4 w-full p-3 hover:bg-slate-800 rounded-xl transition text-amber-400">
              <PlusCircle size={20} /> Admin Upload Panel
            </button>
          )}
          
          <button onClick={() => { setScreen('settings'); setIsMenuOpen(false); }} className="flex items-center gap-4 w-full p-3 hover:bg-slate-800 rounded-xl transition">
            <Settings size={20} className={textThemeBlue} /> Settings
          </button>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => { setLoggedUserEmail(''); setScreen('welcome'); }} className="flex items-center gap-4 w-full p-3 hover:bg-red-500/20 text-red-400 rounded-xl transition">
            <LogOut size={20} /> Log Out
          </button>
        </div>
      </div>
    </>
  );

  if (screen === 'welcome') {
    return (
      <div className="h-screen w-full bg-[#38B6FF] flex flex-col items-center justify-center">
        <div className="w-48 h-48 flex items-center justify-center mb-4 overflow-hidden rounded-3xl shadow-2xl">
          <img src="/pixi.jpg" alt="Pixi Logo" className="w-full h-full object-cover" />
        </div>
        <p className="text-white/80 text-sm font-medium mt-2 tracking-wide">Loading your universe...</p>
      </div>
    );
  }

  if (screen === 'auth') {
    return (
      <div className="h-screen w-full bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-36 overflow-hidden rounded-xl">
              <img src="/6318815573495714031 (1).jpg" alt="Pixi Logo" className="w-full h-full object-cover" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-center mb-2">{isLoginModal ? 'Welcome' : 'Join Pixi'}</h2>
          <p className="text-center text-slate-500 mb-8 text-sm">
            {isLoginModal ? 'Sign in to read your favorite comics' : 'Create an account to start exploring'}
          </p>
          
          <div className="space-y-4">
            {!isLoginModal && (
              <input type="text" placeholder="Full Name" className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-blue-500" />
            )}
            <input
              type="email"
              placeholder="Email Address"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-blue-500"
            />
            
            <button
              onClick={() => {
                if (!emailInput) {
                  alert("Please enter your email address!");
                  return;
                }
                setLoggedUserEmail(emailInput);
                setScreen('discover');
              }}
              className={`w-full py-3.5 text-white font-bold rounded-xl mt-4 ${themeBlue} transition shadow-lg shadow-blue-500/20`}
            >
              {isLoginModal ? 'Sign In' : 'Sign Up'}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-slate-600">
            {isLoginModal ? "New here? " : "Already have an account? "}
            <button onClick={() => setIsLoginModal(!isLoginModal)} className={`font-bold ${textThemeBlue}`}>
              {isLoginModal ? 'Create an account' : 'Log In'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
 // ==========================================
  // 📖 Comic Reader View (Real PDF Viewer)
  // ==========================================
  if (screen === 'reader' && readingComic) {
    // PDF file path eka proper widihata hada ganeema
    const pdfSource = readingComic.pdfUrl.startsWith('http') 
      ? readingComic.pdfUrl 
      : `/${readingComic.pdfUrl}`;

    return (
      <div 
        className="h-screen w-full bg-slate-900 text-white flex flex-col select-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800 z-10">
          <button onClick={closeReader} className="flex items-center gap-2 text-slate-400 hover:text-white transition">
            <ArrowLeft size={20} /> Back to Discover
          </button>
          <div className="text-center">
            <h3 className="font-bold">{readingComic.title}</h3>
            <p className="text-xs text-slate-400">Page {currentPage} of {readingComic.totalPages}</p>
          </div>
          <div className="w-20"></div>
        </div>

        {/* Main Reader Content Area - iframe මඟින් PDF එක පෙන්වීම */}
        <div className="flex-1 flex items-center justify-center px-2 md:px-12 relative overflow-hidden">
          
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="hidden md:flex absolute left-4 z-20 p-4 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl transition transform hover:scale-110"
          >
            <ArrowLeft size={32} />
          </button>

          {/* PDF Display Frame */}
          <div className="w-full max-w-4xl bg-black rounded-lg shadow-2xl overflow-hidden h-[80vh] mx-auto relative flex items-center justify-center">
            {readingComic.pdfUrl ? (
             <embed
  src={`/${readingComic.pdfUrl}#page=${currentPage}`}
  type="application/pdf"
  className="w-full h-full"
/>
            ) : (
              <div className="text-white text-center p-6">
                <BookOpen size={48} className="mx-auto mb-2 text-blue-400" />
                <p>No PDF attached for this comic yet.</p>
              </div>
            )}
          </div>

          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === readingComic.totalPages}
            className="hidden md:flex absolute right-4 z-20 p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl transition transform hover:scale-110"
          >
            <ArrowRight size={32} />
          </button>
        </div>

        {/* Bottom Pagination Bar */}
        <div className="p-4 bg-slate-950 flex justify-between items-center px-6 md:justify-center md:gap-6 border-t border-slate-800">
          <button 
            onClick={() => changePage(currentPage - 1)} 
            disabled={currentPage === 1}
            className="px-4 py-2 bg-slate-800 rounded-xl disabled:opacity-50 hover:bg-slate-700 transition flex items-center gap-2 text-sm font-bold md:hidden"
          >
            <ArrowLeft size={18} /> Prev
          </button>
          
          <span className="text-xs text-slate-400 md:hidden">Swipe left/right to navigate</span>

          <button 
            onClick={() => changePage(currentPage + 1)} 
            disabled={currentPage === readingComic.totalPages}
            className="px-4 py-2 bg-blue-600 rounded-xl disabled:opacity-50 hover:bg-blue-500 transition flex items-center gap-2 text-sm font-bold md:hidden"
          >
            Next <ArrowRight size={18} />
          </button>
        </div>
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
          
          <div
            className="flex items-center cursor-pointer h-9 w-28 overflow-hidden rounded-lg"
            onClick={() => setScreen('discover')}
          >
            <img src="/6318815573495714031 (1).jpg" alt="Pixi Logo" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button onClick={() => setScreen('admin')} className="hidden md:flex items-center gap-1 bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-500/20 hover:bg-amber-500/20 transition">
              <PlusCircle size={16} /> Admin Upload
            </button>
          )}

          <button onClick={() => setScreen('profile')} className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full hover:scale-105 transition">
            <User size={20} />
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
              className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none shadow-sm border ${darkMode ? 'bg-slate-900 border-slate-700 focus:border-blue-500 text-white' : 'bg-slate-50 border-slate-300 focus:border-blue-500 text-slate-900'}`}
            />
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Discover Comics</h2>
            <span className="text-xs text-slate-500">{comicsList.length} Comics Available</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {comicsList.map((comic) => (
              <div
                key={comic.id}
                className="cursor-pointer group relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300"
                onClick={() => setSelectedComic(comic)}
              >
                <img src={comic.image} alt={comic.title} className="w-full h-56 md:h-72 object-cover group-hover:scale-105 transition duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-sm md:text-base">{comic.title}</h3>
                  <p className="text-blue-400 font-semibold text-xs mt-1">Click to Read</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ADMIN SCREEN */}
      {screen === 'admin' && (
        isAdmin ? (
          <main className="max-w-xl mx-auto p-4 py-8">
            <div className={`p-8 rounded-3xl border shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-3xl font-black mb-2 text-amber-500">Admin Comic & PDF Upload</h2>
              <p className="text-sm text-slate-500 mb-6">Publish a new comic issue and attach its PDF link for readers.</p>

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
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Image Cover URL</label>
                  <input
                    type="text"
                    value={adminImage}
                    onChange={(e) => setAdminImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className={`w-full p-3.5 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">PDF File URL</label>
                  <input
                    type="text"
                    value={adminPdf}
                    onChange={(e) => setAdminPdf(e.target.value)}
                    placeholder="/pdfs/comic-name.pdf or external link"
                    className={`w-full p-3.5 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Total Pages</label>
                  <input
                    type="number"
                    value={adminTotalPages}
                    onChange={(e) => setAdminTotalPages(e.target.value)}
                    placeholder="24"
                    className={`w-full p-3.5 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                  />
                </div>

                <button type="submit" className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl shadow-lg transition mt-4">
                  Publish Comic & PDF 🚀
                </button>
              </form>
            </div>
          </main>
        ) : (
          <div className="h-[80vh] flex flex-col items-center justify-center text-center p-4">
            <Lock size={64} className="text-red-500 mb-4" />
            <h2 className="text-2xl font-black mb-2">Access Denied</h2>
            <p className="text-slate-500 mb-6">You do not have permission to view the Admin panel.</p>
            <button onClick={() => setScreen('discover')} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold">
              Back to Discover
            </button>
          </div>
        )
      )}

      {screen === 'profile' && (
        <main className="max-w-3xl mx-auto p-4 py-8">
          <div className="flex items-center gap-6 mb-10">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold ${themeBlue} text-white shadow-lg`}>
              {loggedUserEmail ? loggedUserEmail.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-3xl font-bold">{loggedUserEmail || 'User'}</h2>
              <p className="text-slate-500 text-sm">{isAdmin ? 'Administrator' : 'Reader'}</p>
            </div>
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

      {/* Comic Details Modal */}
      {selectedComic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`max-w-xl w-full rounded-3xl overflow-hidden shadow-2xl flex flex-col ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
            <div className="relative h-64">
              <img src={selectedComic.image} alt={selectedComic.title} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedComic(null)} className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-black mb-2">{selectedComic.title}</h2>
              <p className="text-sm text-slate-500 mb-6">Total Pages: {selectedComic.totalPages}</p>

              <button
                onClick={() => {
                  const comicToRead = selectedComic;
                  setSelectedComic(null);
                  startReading(comicToRead);
                }}
                className={`w-full py-4 rounded-xl font-black text-lg text-white ${themeBlue} flex items-center justify-center gap-2 transition shadow-lg shadow-blue-500/30`}
              >
                <BookOpen size={20} /> Read Comic Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}