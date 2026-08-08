import React, { useState, useEffect } from 'react';
import {
  Menu, Search, ShoppingCart, Settings, LogOut,
  User, Shield, Moon, Sun, X, ChevronRight, CheckCircle, PlusCircle, Trash2, Lock
} from 'lucide-react';

export default function PixiComicApp() {
  const [screen, setScreen] = useState('welcome');
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(true);
  const [selectedComic, setSelectedComic] = useState(null);

  // Login වෙන User ගේ Email එක සහ Admin ද නැද්ද යන්න තේරීමට
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loggedUserEmail, setLoggedUserEmail] = useState('');

  // ** මෙන්න මෙතැනට ඔයාගේ Admin Gmail එක දාන්න **
  const ADMIN_EMAIL = "maneesharavihara0@gmail.com"; // උදාහරණයක් ලෙස ඔයාගේ සැබෑ ඊමේල් එක මෙතැනට දෙන්න

  // ලොග් වී සිටින පරිශීලකයා Admin ද යන්න ස්වයංක්‍රීයව පරීක්ෂා කරයි
  const isAdmin = loggedUserEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const [cart, setCart] = useState([]);
  const [boughtComics, setBoughtComics] = useState([]); // Dummy comic අයින් කළා
  const [newComics, setNewComics] = useState([]); // Uploads වැඩ කිරීමට මෙය අත්‍යවශ්‍යයි

  const [adminTitle, setAdminTitle] = useState('');
  const [adminPrice, setAdminPrice] = useState('');
  const [adminImage, setAdminImage] = useState(''); // Image link එක සඳහා
  const [adminPdf, setAdminPdf] = useState('');     // PDF link එක සඳහා

  const themeBlue = "bg-blue-600 hover:bg-blue-700";
  const textThemeBlue = "text-blue-600";

  useEffect(() => {
    if (screen === 'welcome') {
      const timer = setTimeout(() => setScreen('auth'), 3000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  const addToCart = (comic) => {
    if (!cart.some(item => item.id === comic.id)) {
      setCart([...cart, comic]);
      alert(`"${comic.title}" added to Cart! 🛒`);
    } else {
      alert("This comic is already in your cart.");
    }
  };

  // PDF File Upload Handler
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminPdf(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadComic = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert("Unauthorized! Only Admin can upload comics.");
      return;
    }
    if (!adminTitle || !adminPrice || !adminImage || !adminPdf) {
      alert("Please fill all fields and upload a PDF!");
      return;
    }
    const newEntry = {
      id: Date.now(),
      title: adminTitle,
      price: adminPrice,
      image: adminImage,
      pdfUrl: adminPdf // PDF එක මෙතනට සෙට් වෙනවා
    };
    setNewComics([newEntry, ...newComics]);
    setAdminTitle('');
    setAdminPrice('');
    setAdminImage('');
    setAdminPdf('');
    alert("Comic uploaded successfully by Admin! 🚀");
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
            <User size={20} className={textThemeBlue} /> My Library & Cart ({cart.length})
          </button>

          {/* ඔයාගේ ඊමේල් එකෙන් log වී ඇත්නම් පමණක් Sidebar එකේ Admin පුවරුව පෙනේ */}
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
                // ඇතුළත් කළ ඊමේල් ලිපිනය සටහන් කරගනී
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
          {/* ඔයාගේ ඊමේල් එකෙන් log වී ඇත්නම් පමණක් Header එකේ upload බටන් එක පෙනේ */}
          {isAdmin && (
            <button onClick={() => setScreen('admin')} className="hidden md:flex items-center gap-1 bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-500/20 hover:bg-amber-500/20 transition">
              <PlusCircle size={16} /> Admin Upload
            </button>
          )}

          <button onClick={() => setScreen('profile')} className="relative p-2 bg-slate-200 dark:bg-slate-800 rounded-full hover:scale-105 transition">
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
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
            <h2 className="text-2xl font-bold">New Uploads </h2>
            <span className="text-xs text-slate-500">{newComics.length} Comics Available</span>
          </div>

          {newComics.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              No comics uploaded yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {newComics.map((comic) => (
                <div
                  key={comic.id}
                  className="cursor-pointer group relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300"
                  onClick={() => setSelectedComic(comic)}
                >
                  <img src={comic.image} alt={comic.title} className="w-full h-56 md:h-72 object-cover group-hover:scale-105 transition duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white font-bold text-sm md:text-base">{comic.title}</h3>
                    <p className="text-blue-400 font-semibold text-xs mt-1">{comic.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* ADMIN SCREEN */}
      {screen === 'admin' && (
        isAdmin ? (
          <main className="max-w-xl mx-auto p-4 py-8">
            <div className={`p-8 rounded-3xl border shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-3xl font-black mb-2 text-amber-500">Admin Comic Upload</h2>
              <p className="text-sm text-slate-500 mb-6">Publish a new comic issue directly to the Discover feed.</p>

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
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Price (e.g. $2.99 or Free)</label>
                  <input
                    type="text"
                    value={adminPrice}
                    onChange={(e) => setAdminPrice(e.target.value)}
                    placeholder="$2.99"
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
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">PDF File Upload</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className={`w-full p-3.5 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                  />
                  {adminPdf && <p className="text-xs text-green-500 mt-2 font-bold">PDF Attached Successfully!</p>}
                </div>

                <button type="submit" className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl shadow-lg transition mt-4">
                  Publish Comic Now 🚀
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
              MR
            </div>
            <div>
              <h2 className="text-3xl font-bold">{loggedUserEmail || 'User'}</h2>
              <p className="text-slate-500 text-sm">{isAdmin ? 'Administrator' : 'VIP Member / Reader'}</p>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-4 border-b border-slate-300 dark:border-slate-800 pb-2">My Library (Unlocked Comics)</h3>
          {boughtComics.length === 0 ? (
            <p className="text-sm text-slate-500 mb-10">No purchased comics yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {boughtComics.map((comic) => (
                <div key={comic.id} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
                  <img src={comic.image} alt={comic.title} className="w-full h-48 object-cover" />
                  <div className={`p-3 text-center ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                    <p className="text-sm font-bold truncate">{comic.title}</p>
                    {comic.pdfUrl ? (
                      <a href={comic.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 font-semibold mt-1 block hover:underline">
                        📖 Read PDF
                      </a>
                    ) : (
                      <p className="text-xs text-green-500 font-semibold mt-1">Ready to read</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <h3 className="text-xl font-bold mb-4 border-b border-slate-300 dark:border-slate-800 pb-2">Cart Items ({cart.length})</h3>
          {cart.length === 0 ? (
            <p className="text-sm text-slate-500 mb-10">Your cart is empty.</p>
          ) : (
            <div className="space-y-3 mb-10">
              {cart.map((item) => (
                <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.title} className="w-12 h-16 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-xs text-blue-500 font-semibold">{item.price}</p>
                    </div>
                  </div>
                  <button onClick={() => setCart(cart.filter(c => c.id !== item.id))} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
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

      {selectedComic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>

            <div className="md:w-2/5 h-64 md:h-auto relative">
              <img src={selectedComic.image} alt={selectedComic.title} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedComic(null)} className="absolute top-4 left-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70">
                <X size={20} />
              </button>
            </div>

            <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
              <h2 className="text-3xl font-black mb-2">{selectedComic.title}</h2>
              <p className="text-sm text-slate-500 mb-6">By Pixi Publishing • Action, Sci-Fi</p>

              <div className="space-y-4">
                <div
                  onClick={() => addToCart(selectedComic)}
                  className={`border-2 rounded-2xl p-4 cursor-pointer transition hover:border-blue-500 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold">Add to Cart 🛒</h4>
                      <p className="text-xs text-slate-500 mt-1">Buy this single comic issue</p>
                    </div>
                    <span className="text-xl font-black">{selectedComic.price}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 my-2">
                  <div className="flex-1 h-px bg-slate-300 dark:bg-slate-700"></div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">OR GET VIP</span>
                  <div className="flex-1 h-px bg-slate-300 dark:bg-slate-700"></div>
                </div>

                <div
                  onClick={() => {
                    setBoughtComics([...boughtComics, selectedComic]);
                    alert(`Successfully subscribed & unlocked "${selectedComic.title}" with Premium Pass! 🌟`);
                    setSelectedComic(null);
                    setScreen('profile');
                  }}
                  className="row relative border-2 border-amber-500 bg-amber-50 dark:bg-amber-500/10 rounded-2xl p-5 cursor-pointer transform hover:scale-[1.02] transition shadow-lg shadow-amber-500/20"
                >
                  <div className="absolute -top-3 -right-3 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    Best Value
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-amber-600 dark:text-amber-400 text-lg flex items-center gap-2">
                        (pixi) Premium Pass <CheckCircle size={16} />
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 mb-2">Read this and all other comics instantly.</p>
                    </div>
                    <span className="text-2xl font-black text-amber-600 dark:text-amber-400">$4.99<span className="text-sm font-normal">/mo</span></span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setBoughtComics([...boughtComics, selectedComic]);
                  alert(`Successfully unlocked "${selectedComic.title}"! Added to your Library.`);
                  setSelectedComic(null);
                  setScreen('profile');
                }}
                className={`w-full mt-6 py-4 rounded-xl font-black text-lg text-white ${themeBlue} flex items-center justify-center gap-2 transition hover:shadow-lg hover:shadow-blue-500/30`}
              >
                Instant Unlock & Read <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}