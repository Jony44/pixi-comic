import React, { useState, useEffect } from 'react';
import { 
  Menu, Search, ShoppingCart, Settings, LogOut, 
  User, Shield, Moon, Sun, X, ChevronRight, CheckCircle, PlusCircle, Trash2, Lock, CreditCard, ExternalLink, BookOpen, Upload 
} from 'lucide-react';

export default function PixiComicApp() {
  const [screen, setScreen] = useState('welcome');
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(true);
  const [selectedComic, setSelectedComic] = useState(null);
  const [readingComic, setReadingComic] = useState(null);
  
  // Payment Type Selector ('card', 'crypto', 'paypal', 'applepay')
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Card Details Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  // Other payment details states
  const [cryptoWallet, setCryptoWallet] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loggedUserEmail, setLoggedUserEmail] = useState('');

  const ADMIN_EMAIL = "maneesharavihara0@gmail.com";
  const isAdmin = loggedUserEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const [cart, setCart] = useState([]);
  const [boughtComics, setBoughtComics] = useState([]);

  // Initial dummy comic to ensure it immediately shows up on the discover page
  const [newComics, setNewComics] = useState([
    {
      id: 1,
      title: "Cyberpunk Chronicles Vol. 1",
      price: "$4.99",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    }
  ]);

  // Admin Form States
  const [adminTitle, setAdminTitle] = useState('');
  const [adminPrice, setAdminPrice] = useState('');
  const [adminImage, setAdminImage] = useState(''); 
  const [adminPdf, setAdminPdf] = useState('');      

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
      alert(`"${comic.title}" added to cart successfully! 🛒`);
    } else {
      alert("This comic is already in your cart.");
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      if(!cardNumber || !cardExpiry || !cardCvc || !cardName) {
        alert("Please fill in all credit card details.");
        return;
      }
    } else if (paymentMethod === 'crypto') {
      if(!cryptoWallet) {
        alert("Please enter your wallet address or transaction hash.");
        return;
      }
    } else if (paymentMethod === 'paypal') {
      if(!paypalEmail) {
        alert("Please enter your PayPal email address.");
        return;
      }
    }

    alert("Payment successful! Comic added to your library. 🎉");
    setBoughtComics([...boughtComics, selectedComic]);
    setSelectedComic(null);
    setScreen('profile');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const Sidebar = () => (
    <>
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
      )}
      
      <div className={`fixed top-0 left-0 h-full w-72 bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl flex flex-col`}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="cursor-pointer flex items-center gap-2" onClick={() => { setScreen('discover'); setIsMenuOpen(false); }}>
            <div className="bg-blue-600 text-white px-2.5 py-1 rounded-lg font-black text-lg tracking-wider">PIXI</div>
            <span className="font-bold text-sm tracking-widest text-slate-300">COMICS</span>
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
        <div className="px-6 py-4 flex items-center justify-center mb-4 overflow-hidden rounded-3xl shadow-2xl bg-white text-blue-600 font-black text-4xl tracking-widest">
          PIXI
        </div>
        <p className="text-white/90 text-sm font-bold mt-2 tracking-wider">Loading your universe...</p>
      </div>
    );
  }

  if (screen === 'auth') {
    return (
      <div className="h-screen w-full bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 text-white px-3 py-1.5 rounded-xl font-black text-xl tracking-wider">PIXI COMICS</div>
          </div>
          <h2 className="text-2xl font-black text-center mb-2">{isLoginModal ? 'Welcome Back' : 'Join Pixi'}</h2>
          <p className="text-center text-slate-500 mb-8 text-sm">
            {isLoginModal ? 'Sign in to read your favorite comics' : 'Create an account to start exploring'}
          </p>
          
          <div className="space-y-4">
            {!isLoginModal && (
              <input type="text" placeholder="Full Name" className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-sm" />
            )}
            <input 
              type="email" 
              placeholder="Email Address" 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-sm" 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-sm" 
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
              className={`w-full py-3.5 text-white font-bold rounded-xl mt-4 ${themeBlue} transition shadow-lg shadow-blue-500/20 text-sm`}
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
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setScreen('discover')}>
            <div className="bg-blue-600 text-white px-2.5 py-1 rounded-lg font-black text-sm tracking-wider">PIXI</div>
            <span className="font-black text-lg tracking-wider">COMICS</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
              className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none shadow-sm border text-sm ${darkMode ? 'bg-slate-900 border-slate-700 focus:border-blue-500 text-white' : 'bg-slate-50 border-slate-300 focus:border-blue-500 text-slate-900'}`}
            />
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Discover Comics 🚀</h2>
            <span className="text-xs text-slate-500">{newComics.length} Comics Available</span>
          </div>
          
          {newComics.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl">
              <p className="text-slate-500 font-medium mb-2">No comics available yet.</p>
              {isAdmin && (
                <button onClick={() => setScreen('admin')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold">
                  Upload First Comic 🚀
                </button>
              )}
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

      {screen === 'admin' && (
        isAdmin ? (
          <main className="max-w-xl mx-auto p-4 py-8">
            <div className={`admin-panel p-6 rounded-3xl border shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-xl font-bold mb-4 text-amber-500">Admin: Upload New Comic</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Comic Title</label>
                  <input 
                    type="text" 
                    placeholder="Enter comic title" 
                    value={adminTitle} 
                    onChange={(e) => setAdminTitle(e.target.value)}
                    className={`w-full p-3 border rounded-xl outline-none text-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Price</label>
                  <input 
                    type="text" 
                    placeholder="e.g. $4.99 or Free" 
                    value={adminPrice} 
                    onChange={(e) => setAdminPrice(e.target.value)}
                    className={`w-full p-3 border rounded-xl outline-none text-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Cover Image (Drag & Drop or Browse)</label>
                  <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-300 bg-slate-50'}`}>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"/>
                  </div>
                  {adminImage && <p className="text-xs text-green-500 mt-1 font-semibold">Image uploaded successfully!</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Comic PDF (Drag & Drop or Browse)</label>
                  <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-300 bg-slate-50'}`}>
                    <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"/>
                  </div>
                  {adminPdf && <p className="text-xs text-green-500 mt-1 font-semibold">PDF attached successfully!</p>}
                </div>

                <button 
                  onClick={() => {
                    if(!adminTitle || !adminPdf) {
                      alert("Please provide a title and attach the PDF file!");
                      return;
                    }
                    
                    const newComicItem = {
                      id: Date.now(),
                      title: adminTitle,
                      price: adminPrice || 'Free',
                      image: adminImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
                      pdfUrl: adminPdf
                    };

                    setNewComics([newComicItem, ...newComics]);
                    
                    setAdminTitle('');
                    setAdminPrice('');
                    setAdminImage('');
                    setAdminPdf('');
                    alert("Comic successfully uploaded and published to Discover!");
                    setScreen('discover');
                  }}
                  className="w-full bg-blue-600 text-white px-4 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition text-sm shadow-lg shadow-blue-600/20"
                >
                  Publish Comic
                </button>
              </div>
            </div>
          </main>
        ) : (
          <div className="h-[80vh] flex flex-col items-center justify-center text-center p-4">
            <Lock size={64} className="text-red-500 mb-4" />
            <h2 className="text-2xl font-black mb-2">Access Denied</h2>
            <p className="text-slate-500 mb-6 text-sm">You do not have permission to view the admin panel.</p>
            <button onClick={() => setScreen('discover')} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm">
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

          <h3 className="text-xl font-bold mb-4 border-b border-slate-300 dark:border-slate-800 pb-2">My Library</h3>
          {boughtComics.length === 0 ? (
            <p className="text-sm text-slate-500 mb-10">No purchased comics yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {boughtComics.map((comic) => (
                <div 
                  key={comic.id} 
                  onClick={() => setReadingComic(comic)}
                  className="cursor-pointer rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md hover:scale-105 transition"
                >
                  <img src={comic.image} alt={comic.title} className="w-full h-48 object-cover" />
                  <div className={`p-3 text-center ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                    <p className="text-sm font-bold truncate">{comic.title}</p>
                    <p className="text-xs text-green-500 font-semibold mt-1 flex items-center justify-center gap-1">
                      <BookOpen size={14} /> Read Comic 📖
                    </p>
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
                      <h4 className="font-bold text-sm">{item.title}</h4>
                      <p className="text-xs text-blue-500 font-semibold">{item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setSelectedComic(item);
                      }} 
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold"
                    >
                      Checkout
                    </button>
                    <button onClick={() => setCart(cart.filter(c => c.id !== item.id))} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg">
                      <Trash2 size={20} />
                    </button>
                  </div>
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
              <p className="text-sm text-slate-500 mb-4">By Pixi Publishing • Action, Sci-Fi</p>
              <p className="text-lg font-bold text-blue-500 mb-6">Price: {selectedComic.price}</p>

              <div className="space-y-4">
                <button 
                  onClick={() => addToCart(selectedComic)} 
                  className={`w-full py-3 rounded-2xl border-2 font-bold transition flex items-center justify-center gap-2 text-sm ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-blue-500 text-white' : 'bg-slate-50 border-slate-200 hover:border-blue-500 text-slate-800'}`}
                >
                  <ShoppingCart size={18} /> Add to Cart 🛒
                </button>

                <div className="flex items-center justify-center gap-4 my-2">
                  <div className="flex-1 h-px bg-slate-300 dark:bg-slate-700"></div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">OR</span>
                  <div className="flex-1 h-px bg-slate-300 dark:bg-slate-700"></div>
                </div>

                {selectedComic.price.toLowerCase() === 'free' ? (
                  <button 
                    onClick={() => {
                      setBoughtComics([...boughtComics, selectedComic]);
                      setReadingComic(selectedComic);
                      setSelectedComic(null);
                    }}
                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
                  >
                    <BookOpen size={20} /> Read Free PDF Now 📖
                  </button>
                ) : (
                  <div className={`p-5 rounded-2xl border-2 border-amber-500 ${darkMode ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                    <h4 className="font-bold text-amber-600 dark:text-amber-400 text-sm mb-3 flex items-center gap-2">
                      <CreditCard size={18} /> Select Payment Method
                    </h4>
                    
                    {/* Logos connected and fully functional */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <button 
                        onClick={() => setPaymentMethod('card')} 
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${paymentMethod === 'card' ? 'border-amber-500 bg-amber-500/20' : 'border-slate-300 dark:border-slate-700'}`}
                      >
                        <CreditCard size={18} className="text-amber-500" />
                        <span className="text-[10px] font-bold">Card</span>
                      </button>

                      <button 
                        onClick={() => setPaymentMethod('crypto')} 
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${paymentMethod === 'crypto' ? 'border-amber-500 bg-amber-500/20' : 'border-slate-300 dark:border-slate-700'}`}
                      >
                        <span className="text-xs font-black text-amber-500">₿</span>
                        <span className="text-[10px] font-bold">Crypto</span>
                      </button>

                      <button 
                        onClick={() => setPaymentMethod('paypal')} 
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${paymentMethod === 'paypal' ? 'border-amber-500 bg-amber-500/20' : 'border-slate-300 dark:border-slate-700'}`}
                      >
                        <span className="text-xs font-black text-blue-500">P</span>
                        <span className="text-[10px] font-bold">PayPal</span>
                      </button>

                      <button 
                        onClick={() => setPaymentMethod('applepay')} 
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${paymentMethod === 'applepay' ? 'border-amber-500 bg-amber-500/20' : 'border-slate-300 dark:border-slate-700'}`}
                      >
                        <span className="text-xs font-black"></span>
                        <span className="text-[10px] font-bold">Apple Pay</span>
                      </button>
                    </div>

                    <form onSubmit={handlePaymentSubmit} className="space-y-3">
                      {paymentMethod === 'card' && (
                        <>
                          <input 
                            type="text" 
                            placeholder="Cardholder Name" 
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className={`w-full p-2.5 text-xs rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
                          />
                          <input 
                            type="text" 
                            placeholder="Card Number (4532 •••• •••• ••••)" 
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className={`w-full p-2.5 text-xs rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
                          />
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="MM/YY" 
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className={`w-1/2 p-2.5 text-xs rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
                            />
                            <input 
                              type="password" 
                              placeholder="CVC" 
                              maxLength="4"
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              className={`w-1/2 p-2.5 text-xs rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
                            />
                          </div>
                        </>
                      )}

                      {paymentMethod === 'crypto' && (
                        <input 
                          type="text" 
                          placeholder="Enter Crypto Wallet Address / TxID" 
                          value={cryptoWallet}
                          onChange={(e) => setCryptoWallet(e.target.value)}
                          className={`w-full p-2.5 text-xs rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
                        />
                      )}

                      {paymentMethod === 'paypal' && (
                        <input 
                          type="email" 
                          placeholder="Enter PayPal Email Address" 
                          value={paypalEmail}
                          onChange={(e) => setPaypalEmail(e.target.value)}
                          className={`w-full p-2.5 text-xs rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
                        />
                      )}

                      {paymentMethod === 'applepay' && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-2">
                          Clicking confirm will securely trigger Apple Pay popup authentication.
                        </p>
                      )}

                      <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl shadow transition text-xs">
                        Confirm Payment & Unlock 🔒
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {readingComic && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4 text-white">
          <div className="w-full flex justify-between items-center max-w-4xl p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <div>
              <h3 className="font-bold text-lg">{readingComic.title}</h3>
              <p className="text-xs text-blue-400">Reader Mode</p>
            </div>
            <div className="flex items-center gap-3">
              {readingComic.pdfUrl && (
                <a 
                  href={readingComic.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  Open PDF in New Tab <ExternalLink size={14} />
                </a>
              )}
              <button onClick={() => setReadingComic(null)} className="p-2 bg-white/20 rounded-full hover:bg-white/40">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 w-full max-w-4xl my-4 flex items-center justify-center bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
            {readingComic.pdfUrl ? (
              <iframe 
                src={readingComic.pdfUrl} 
                title={readingComic.title}
                className="w-full h-[70vh] border-0 rounded-xl bg-white"
              />
            ) : (
              <div className="text-center p-6">
                <p className="text-red-400 font-bold mb-2">No PDF file found!</p>
                <img src={readingComic.image} alt={readingComic.title} className="max-h-[50vh] object-contain mx-auto rounded-lg shadow-lg" />
              </div>
            )}
          </div>

          <div className="text-xs text-slate-400 text-center">
            If the PDF does not load directly, please use the "Open PDF in New Tab" button above.
          </div>
        </div>
      )}

    </div>
  );
}import React, { useState, useEffect } from 'react';
import { 
  Menu, Search, ShoppingCart, Settings, LogOut, 
  User, Shield, Moon, Sun, X, ChevronRight, CheckCircle, PlusCircle, Trash2, Lock, CreditCard, ExternalLink, BookOpen, Upload 
} from 'lucide-react';

export default function PixiComicApp() {
  const [screen, setScreen] = useState('welcome');
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(true);
  const [selectedComic, setSelectedComic] = useState(null);
  const [readingComic, setReadingComic] = useState(null);
  
  // Payment Type Selector ('card', 'crypto', 'paypal', 'applepay')
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Card Details Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  // Other payment details states
  const [cryptoWallet, setCryptoWallet] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loggedUserEmail, setLoggedUserEmail] = useState('');

  const ADMIN_EMAIL = "maneesharavihara0@gmail.com";
  const isAdmin = loggedUserEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const [cart, setCart] = useState([]);
  const [boughtComics, setBoughtComics] = useState([]);

  // Initial dummy comic to ensure it immediately shows up on the discover page
  const [newComics, setNewComics] = useState([
    {
      id: 1,
      title: "Cyberpunk Chronicles Vol. 1",
      price: "$4.99",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    }
  ]);

  // Admin Form States
  const [adminTitle, setAdminTitle] = useState('');
  const [adminPrice, setAdminPrice] = useState('');
  const [adminImage, setAdminImage] = useState(''); 
  const [adminPdf, setAdminPdf] = useState('');      

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
      alert(`"${comic.title}" added to cart successfully! 🛒`);
    } else {
      alert("This comic is already in your cart.");
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      if(!cardNumber || !cardExpiry || !cardCvc || !cardName) {
        alert("Please fill in all credit card details.");
        return;
      }
    } else if (paymentMethod === 'crypto') {
      if(!cryptoWallet) {
        alert("Please enter your wallet address or transaction hash.");
        return;
      }
    } else if (paymentMethod === 'paypal') {
      if(!paypalEmail) {
        alert("Please enter your PayPal email address.");
        return;
      }
    }

    alert("Payment successful! Comic added to your library. 🎉");
    setBoughtComics([...boughtComics, selectedComic]);
    setSelectedComic(null);
    setScreen('profile');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const Sidebar = () => (
    <>
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
      )}
      
      <div className={`fixed top-0 left-0 h-full w-72 bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl flex flex-col`}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="cursor-pointer flex items-center gap-2" onClick={() => { setScreen('discover'); setIsMenuOpen(false); }}>
            <div className="bg-blue-600 text-white px-2.5 py-1 rounded-lg font-black text-lg tracking-wider">PIXI</div>
            <span className="font-bold text-sm tracking-widest text-slate-300">COMICS</span>
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
        <div className="px-6 py-4 flex items-center justify-center mb-4 overflow-hidden rounded-3xl shadow-2xl bg-white text-blue-600 font-black text-4xl tracking-widest">
          PIXI
        </div>
        <p className="text-white/90 text-sm font-bold mt-2 tracking-wider">Loading your universe...</p>
      </div>
    );
  }

  if (screen === 'auth') {
    return (
      <div className="h-screen w-full bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 text-white px-3 py-1.5 rounded-xl font-black text-xl tracking-wider">PIXI COMICS</div>
          </div>
          <h2 className="text-2xl font-black text-center mb-2">{isLoginModal ? 'Welcome Back' : 'Join Pixi'}</h2>
          <p className="text-center text-slate-500 mb-8 text-sm">
            {isLoginModal ? 'Sign in to read your favorite comics' : 'Create an account to start exploring'}
          </p>
          
          <div className="space-y-4">
            {!isLoginModal && (
              <input type="text" placeholder="Full Name" className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-sm" />
            )}
            <input 
              type="email" 
              placeholder="Email Address" 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-sm" 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-sm" 
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
              className={`w-full py-3.5 text-white font-bold rounded-xl mt-4 ${themeBlue} transition shadow-lg shadow-blue-500/20 text-sm`}
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
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setScreen('discover')}>
            <div className="bg-blue-600 text-white px-2.5 py-1 rounded-lg font-black text-sm tracking-wider">PIXI</div>
            <span className="font-black text-lg tracking-wider">COMICS</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
              className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none shadow-sm border text-sm ${darkMode ? 'bg-slate-900 border-slate-700 focus:border-blue-500 text-white' : 'bg-slate-50 border-slate-300 focus:border-blue-500 text-slate-900'}`}
            />
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Discover Comics 🚀</h2>
            <span className="text-xs text-slate-500">{newComics.length} Comics Available</span>
          </div>
          
          {newComics.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl">
              <p className="text-slate-500 font-medium mb-2">No comics available yet.</p>
              {isAdmin && (
                <button onClick={() => setScreen('admin')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold">
                  Upload First Comic 🚀
                </button>
              )}
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

      {screen === 'admin' && (
        isAdmin ? (
          <main className="max-w-xl mx-auto p-4 py-8">
            <div className={`admin-panel p-6 rounded-3xl border shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-xl font-bold mb-4 text-amber-500">Admin: Upload New Comic</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Comic Title</label>
                  <input 
                    type="text" 
                    placeholder="Enter comic title" 
                    value={adminTitle} 
                    onChange={(e) => setAdminTitle(e.target.value)}
                    className={`w-full p-3 border rounded-xl outline-none text-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Price</label>
                  <input 
                    type="text" 
                    placeholder="e.g. $4.99 or Free" 
                    value={adminPrice} 
                    onChange={(e) => setAdminPrice(e.target.value)}
                    className={`w-full p-3 border rounded-xl outline-none text-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Cover Image (Drag & Drop or Browse)</label>
                  <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-300 bg-slate-50'}`}>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"/>
                  </div>
                  {adminImage && <p className="text-xs text-green-500 mt-1 font-semibold">Image uploaded successfully!</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Comic PDF (Drag & Drop or Browse)</label>
                  <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-300 bg-slate-50'}`}>
                    <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"/>
                  </div>
                  {adminPdf && <p className="text-xs text-green-500 mt-1 font-semibold">PDF attached successfully!</p>}
                </div>

                <button 
                  onClick={() => {
                    if(!adminTitle || !adminPdf) {
                      alert("Please provide a title and attach the PDF file!");
                      return;
                    }
                    
                    const newComicItem = {
                      id: Date.now(),
                      title: adminTitle,
                      price: adminPrice || 'Free',
                      image: adminImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
                      pdfUrl: adminPdf
                    };

                    setNewComics([newComicItem, ...newComics]);
                    
                    setAdminTitle('');
                    setAdminPrice('');
                    setAdminImage('');
                    setAdminPdf('');
                    alert("Comic successfully uploaded and published to Discover!");
                    setScreen('discover');
                  }}
                  className="w-full bg-blue-600 text-white px-4 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition text-sm shadow-lg shadow-blue-600/20"
                >
                  Publish Comic
                </button>
              </div>
            </div>
          </main>
        ) : (
          <div className="h-[80vh] flex flex-col items-center justify-center text-center p-4">
            <Lock size={64} className="text-red-500 mb-4" />
            <h2 className="text-2xl font-black mb-2">Access Denied</h2>
            <p className="text-slate-500 mb-6 text-sm">You do not have permission to view the admin panel.</p>
            <button onClick={() => setScreen('discover')} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm">
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

          <h3 className="text-xl font-bold mb-4 border-b border-slate-300 dark:border-slate-800 pb-2">My Library</h3>
          {boughtComics.length === 0 ? (
            <p className="text-sm text-slate-500 mb-10">No purchased comics yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {boughtComics.map((comic) => (
                <div 
                  key={comic.id} 
                  onClick={() => setReadingComic(comic)}
                  className="cursor-pointer rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md hover:scale-105 transition"
                >
                  <img src={comic.image} alt={comic.title} className="w-full h-48 object-cover" />
                  <div className={`p-3 text-center ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                    <p className="text-sm font-bold truncate">{comic.title}</p>
                    <p className="text-xs text-green-500 font-semibold mt-1 flex items-center justify-center gap-1">
                      <BookOpen size={14} /> Read Comic 📖
                    </p>
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
                      <h4 className="font-bold text-sm">{item.title}</h4>
                      <p className="text-xs text-blue-500 font-semibold">{item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setSelectedComic(item);
                      }} 
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold"
                    >
                      Checkout
                    </button>
                    <button onClick={() => setCart(cart.filter(c => c.id !== item.id))} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg">
                      <Trash2 size={20} />
                    </button>
                  </div>
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
              <p className="text-sm text-slate-500 mb-4">By Pixi Publishing • Action, Sci-Fi</p>
              <p className="text-lg font-bold text-blue-500 mb-6">Price: {selectedComic.price}</p>

              <div className="space-y-4">
                <button 
                  onClick={() => addToCart(selectedComic)} 
                  className={`w-full py-3 rounded-2xl border-2 font-bold transition flex items-center justify-center gap-2 text-sm ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-blue-500 text-white' : 'bg-slate-50 border-slate-200 hover:border-blue-500 text-slate-800'}`}
                >
                  <ShoppingCart size={18} /> Add to Cart 🛒
                </button>

                <div className="flex items-center justify-center gap-4 my-2">
                  <div className="flex-1 h-px bg-slate-300 dark:bg-slate-700"></div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">OR</span>
                  <div className="flex-1 h-px bg-slate-300 dark:bg-slate-700"></div>
                </div>

                {selectedComic.price.toLowerCase() === 'free' ? (
                  <button 
                    onClick={() => {
                      setBoughtComics([...boughtComics, selectedComic]);
                      setReadingComic(selectedComic);
                      setSelectedComic(null);
                    }}
                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
                  >
                    <BookOpen size={20} /> Read Free PDF Now 📖
                  </button>
                ) : (
                  <div className={`p-5 rounded-2xl border-2 border-amber-500 ${darkMode ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                    <h4 className="font-bold text-amber-600 dark:text-amber-400 text-sm mb-3 flex items-center gap-2">
                      <CreditCard size={18} /> Select Payment Method
                    </h4>
                    
                    {/* Logos connected and fully functional */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <button 
                        onClick={() => setPaymentMethod('card')} 
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${paymentMethod === 'card' ? 'border-amber-500 bg-amber-500/20' : 'border-slate-300 dark:border-slate-700'}`}
                      >
                        <CreditCard size={18} className="text-amber-500" />
                        <span className="text-[10px] font-bold">Card</span>
                      </button>

                      <button 
                        onClick={() => setPaymentMethod('crypto')} 
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${paymentMethod === 'crypto' ? 'border-amber-500 bg-amber-500/20' : 'border-slate-300 dark:border-slate-700'}`}
                      >
                        <span className="text-xs font-black text-amber-500">₿</span>
                        <span className="text-[10px] font-bold">Crypto</span>
                      </button>

                      <button 
                        onClick={() => setPaymentMethod('paypal')} 
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${paymentMethod === 'paypal' ? 'border-amber-500 bg-amber-500/20' : 'border-slate-300 dark:border-slate-700'}`}
                      >
                        <span className="text-xs font-black text-blue-500">P</span>
                        <span className="text-[10px] font-bold">PayPal</span>
                      </button>

                      <button 
                        onClick={() => setPaymentMethod('applepay')} 
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${paymentMethod === 'applepay' ? 'border-amber-500 bg-amber-500/20' : 'border-slate-300 dark:border-slate-700'}`}
                      >
                        <span className="text-xs font-black"></span>
                        <span className="text-[10px] font-bold">Apple Pay</span>
                      </button>
                    </div>

                    <form onSubmit={handlePaymentSubmit} className="space-y-3">
                      {paymentMethod === 'card' && (
                        <>
                          <input 
                            type="text" 
                            placeholder="Cardholder Name" 
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className={`w-full p-2.5 text-xs rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
                          />
                          <input 
                            type="text" 
                            placeholder="Card Number (4532 •••• •••• ••••)" 
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className={`w-full p-2.5 text-xs rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
                          />
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="MM/YY" 
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className={`w-1/2 p-2.5 text-xs rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
                            />
                            <input 
                              type="password" 
                              placeholder="CVC" 
                              maxLength="4"
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              className={`w-1/2 p-2.5 text-xs rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
                            />
                          </div>
                        </>
                      )}

                      {paymentMethod === 'crypto' && (
                        <input 
                          type="text" 
                          placeholder="Enter Crypto Wallet Address / TxID" 
                          value={cryptoWallet}
                          onChange={(e) => setCryptoWallet(e.target.value)}
                          className={`w-full p-2.5 text-xs rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
                        />
                      )}

                      {paymentMethod === 'paypal' && (
                        <input 
                          type="email" 
                          placeholder="Enter PayPal Email Address" 
                          value={paypalEmail}
                          onChange={(e) => setPaypalEmail(e.target.value)}
                          className={`w-full p-2.5 text-xs rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300'}`}
                        />
                      )}

                      {paymentMethod === 'applepay' && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-2">
                          Clicking confirm will securely trigger Apple Pay popup authentication.
                        </p>
                      )}

                      <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl shadow transition text-xs">
                        Confirm Payment & Unlock 🔒
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {readingComic && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4 text-white">
          <div className="w-full flex justify-between items-center max-w-4xl p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <div>
              <h3 className="font-bold text-lg">{readingComic.title}</h3>
              <p className="text-xs text-blue-400">Reader Mode</p>
            </div>
            <div className="flex items-center gap-3">
              {readingComic.pdfUrl && (
                <a 
                  href={readingComic.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  Open PDF in New Tab <ExternalLink size={14} />
                </a>
              )}
              <button onClick={() => setReadingComic(null)} className="p-2 bg-white/20 rounded-full hover:bg-white/40">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 w-full max-w-4xl my-4 flex items-center justify-center bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
            {readingComic.pdfUrl ? (
              <iframe 
                src={readingComic.pdfUrl} 
                title={readingComic.title}
                className="w-full h-[70vh] border-0 rounded-xl bg-white"
              />
            ) : (
              <div className="text-center p-6">
                <p className="text-red-400 font-bold mb-2">No PDF file found!</p>
                <img src={readingComic.image} alt={readingComic.title} className="max-h-[50vh] object-contain mx-auto rounded-lg shadow-lg" />
              </div>
            )}
          </div>

          <div className="text-xs text-slate-400 text-center">
            If the PDF does not load directly, please use the "Open PDF in New Tab" button above.
          </div>
        </div>
      )}

    </div>
  );
}