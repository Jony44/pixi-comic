import React, { useState, useEffect } from 'react';
import {
  Menu, Search, ShoppingCart, Settings, LogOut,
  User, Moon, Sun, X, ChevronRight, CheckCircle, Trash2, CreditCard, BookOpen, ArrowLeft, ArrowRight
} from 'lucide-react';

// ==========================================
// 📌 Hardcoded Comics සහ PDF Data
// ==========================================
const COMICS_DATA = [
  {
    id: 1,
    title: "Cyber Universe - Issue 1",
    price: "$2.99",
    image: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=400",
    pdfUrl: "/pdfs/comic-1.pdf",
    totalPages: 24 // PDF එකේ මුළු පිටු ගණන
  },
  {
    id: 2,
    title: "The Last Samurai - Origins",
    price: "$3.49",
    image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?q=80&w=400",
    pdfUrl: "/pdfs/comic-2.pdf",
    totalPages: 30
  },
  {
    id: 3,
    title: "Galactic Wars: Fall of Mars",
    price: "$4.99",
    image: "https://images.unsplash.com/photo-1618519764620-7403abdbdf9c?q=80&w=400",
    pdfUrl: "/pdfs/comic-3.pdf",
    totalPages: 45
  }
];

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

  // Cart & Library
  const [cart, setCart] = useState([]);
  const [boughtComics, setBoughtComics] = useState([]); 

  // Payment UI States
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'paypal'
  const [pendingPurchase, setPendingPurchase] = useState(null); // Subscription or Single Comic

  // Reader States (Bookmark System)
  const [readingComic, setReadingComic] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const themeBlue = "bg-blue-600 hover:bg-blue-700";
  const textThemeBlue = "text-blue-600";

  useEffect(() => {
    if (screen === 'welcome') {
      const timer = setTimeout(() => setScreen('auth'), 3000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // ==========================================
  // Bookmark (Save Page) Logic
  // ==========================================
  const startReading = (comic) => {
    // LocalStorage එකෙන් කලින් නවත්තපු පිටුව බලනවා
    const savedPage = localStorage.getItem(`bookmark_${loggedUserEmail}_${comic.id}`);
    const startPage = savedPage ? parseInt(savedPage, 10) : 1;
    
    setReadingComic(comic);
    setCurrentPage(startPage);
    setScreen('reader');
  };

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= readingComic.totalPages) {
      setCurrentPage(newPage);
      // අලුත් පිටුව LocalStorage එකේ සේව් කරනවා (Bookmark වෙනවා)
      localStorage.setItem(`bookmark_${loggedUserEmail}_${readingComic.id}`, newPage);
    }
  };

  const closeReader = () => {
    setReadingComic(null);
    setScreen('profile');
  };

  // ==========================================
  // Payment Logic
  // ==========================================
  const handlePayment = (e) => {
    e.preventDefault();
    // සල්ලි ගෙව්වට පස්සේ Comic එක Library එකට දානවා
    if (pendingPurchase === 'subscription') {
      setBoughtComics(COMICS_DATA); // VIP අරගත්තම ඔක්කොම unlock වෙනවා
      alert("Payment Successful! VIP Premium Pass Unlocked. 🎉");
    } else if (pendingPurchase) {
      setBoughtComics([...boughtComics, pendingPurchase]);
      alert(`Payment Successful! "${pendingPurchase.title}" unlocked. 📖`);
    }
    
    setShowPayment(false);
    setSelectedComic(null);
    setPendingPurchase(null);
    setScreen('profile');
  };

  const Sidebar = () => (
    <>
      {isMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />}
      <div className={`fixed top-0 left-0 h-full w-72 bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl flex flex-col`}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="h-8 w-28 overflow-hidden rounded-md cursor-pointer flex items-center" onClick={() => { setScreen('discover'); setIsMenuOpen(false); }}>
            <span className="text-xl font-black text-blue-500">PIXI COMICS</span>
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
            <User size={20} className={textThemeBlue} /> My Library
          </button>
          <button onClick={() => { setScreen('settings'); setIsMenuOpen(false); }} className="flex items-center gap-4 w-full p-3 hover:bg-slate-800 rounded-xl transition">
            <Settings size={20} className={textThemeBlue} /> Settings
          </button>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => { setLoggedUserEmail(''); setCart([]); setBoughtComics([]); setScreen('welcome'); }} className="flex items-center gap-4 w-full p-3 hover:bg-red-500/20 text-red-400 rounded-xl transition">
            <LogOut size={20} /> Log Out
          </button>
        </div>
      </div>
    </>
  );

  // Views Render Start ==============================
  if (screen === 'welcome') {
    return (
      <div className="h-screen w-full bg-[#38B6FF] flex flex-col items-center justify-center text-white">
        <h1 className="text-6xl font-black tracking-tighter mb-4 shadow-sm">PIXI.</h1>
        <p className="text-white/80 text-sm font-medium tracking-wide">Loading your universe...</p>
      </div>
    );
  }

  if (screen === 'auth') {
    return (
      <div className="h-screen w-full bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <h2 className="text-3xl font-black text-center mb-2 text-blue-600">PIXI.</h2>
          <p className="text-center text-slate-500 mb-8 text-sm">
            {isLoginModal ? 'Sign in to read your favorite comics' : 'Create an account to start exploring'}
          </p>

          <div className="space-y-4">
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
                if (!emailInput) return alert("Please enter email!");
                setLoggedUserEmail(emailInput);
                setScreen('discover');
              }}
              className={`w-full py-3.5 text-white font-bold rounded-xl mt-4 ${themeBlue} transition shadow-lg shadow-blue-500/20`}
            >
              {isLoginModal ? 'Log In & Continue' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Comic Reader View (Bookmark System)
  if (screen === 'reader' && readingComic) {
    return (
      <div className="h-screen w-full bg-slate-900 text-white flex flex-col">
        <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
          <button onClick={closeReader} className="flex items-center gap-2 text-slate-400 hover:text-white transition">
            <ArrowLeft size={20} /> Back to Library
          </button>
          <div className="text-center">
            <h3 className="font-bold">{readingComic.title}</h3>
            <p className="text-xs text-slate-400">Page {currentPage} of {readingComic.totalPages}</p>
          </div>
          <div className="w-20"></div> {/* Spacer */}
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden flex items-center justify-center h-[80vh] relative">
             {/* මෙතන තමයි සැබෑ PDF viewer එක එන්නේ. දැනට අපි dummy පිටුවක් පෙන්නමු */}
             <div className="text-slate-900 text-center p-10">
                <BookOpen size={64} className="text-blue-200 mx-auto mb-4" />
                <h2 className="text-2xl font-black mb-2">Simulated PDF Viewer</h2>
                <p className="text-slate-500">Currently reading page <strong className="text-blue-600">{currentPage}</strong></p>
                <p className="text-xs text-slate-400 mt-6">(Your progress is auto-saved as a bookmark)</p>
             </div>
          </div>
        </div>

        <div className="p-4 bg-slate-950 flex justify-center gap-6 border-t border-slate-800">
          <button 
            onClick={() => changePage(currentPage - 1)} 
            disabled={currentPage === 1}
            className="p-3 bg-slate-800 rounded-full disabled:opacity-50 hover:bg-slate-700 transition"
          >
            <ArrowLeft size={24} />
          </button>
          <button 
            onClick={() => changePage(currentPage + 1)} 
            disabled={currentPage === readingComic.totalPages}
            className="p-3 bg-blue-600 rounded-full disabled:opacity-50 hover:bg-blue-500 transition"
          >
            <ArrowRight size={24} />
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
          <span className="text-xl font-black text-blue-600 cursor-pointer" onClick={() => setScreen('discover')}>PIXI.</span>
        </div>
      </header>

      <Sidebar />

      {screen === 'discover' && (
        <main className="max-w-5xl mx-auto p-4 py-8">
          <h2 className="text-2xl font-black mb-6">Discover Comics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {COMICS_DATA.map((comic) => (
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
        </main>
      )}

      {screen === 'profile' && (
        <main className="max-w-3xl mx-auto p-4 py-8">
          <div className="flex items-center gap-6 mb-10 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold ${themeBlue} text-white shadow-lg`}>
              {loggedUserEmail.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{loggedUserEmail}</h2>
              <p className="text-slate-500 text-sm">Pixi Reader</p>
            </div>
          </div>

          <h3 className="text-xl font-black mb-4">My Library</h3>
          {boughtComics.length === 0 ? (
            <p className="text-sm text-slate-500 mb-10">You haven't unlocked any comics yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              {boughtComics.map((comic) => {
                // Check if there is a saved bookmark for UI display
                const savedPage = localStorage.getItem(`bookmark_${loggedUserEmail}_${comic.id}`);
                return (
                  <div key={comic.id} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                    <img src={comic.image} alt={comic.title} className="w-full h-40 object-cover" />
                    <div className={`p-3 flex-1 flex flex-col ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                      <p className="text-sm font-bold line-clamp-1 mb-1">{comic.title}</p>
                      {savedPage && savedPage > 1 && (
                        <p className="text-[10px] text-amber-500 font-bold mb-2">Resumes at page {savedPage}</p>
                      )}
                      <button 
                        onClick={() => startReading(comic)}
                        className="mt-auto w-full py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-black rounded-lg transition"
                      >
                        {savedPage && savedPage > 1 ? 'Continue Reading' : 'Read PDF'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      )}

      {screen === 'settings' && (
        <main className="max-w-2xl mx-auto p-4 py-8">
          <h2 className="text-3xl font-bold mb-8">Settings</h2>
          <div className={`p-6 rounded-2xl mb-6 border shadow-sm flex items-center justify-between ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center gap-3">
              {darkMode ? <Moon size={24} className={textThemeBlue}/> : <Sun size={24} className={textThemeBlue}/>}
              <div>
                <h3 className="font-bold text-lg">App Theme</h3>
                <p className="text-sm text-slate-500">Toggle dark or light mode</p>
              </div>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className={`w-14 h-8 rounded-full flex items-center p-1 transition-colors ${darkMode ? 'bg-blue-600' : 'bg-slate-300'}`}>
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </main>
      )}

      {/* Comic Details Modal */}
      {selectedComic && !showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="md:w-2/5 h-64 md:h-auto relative">
              <img src={selectedComic.image} alt={selectedComic.title} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedComic(null)} className="absolute top-4 left-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70">
                <X size={20} />
              </button>
            </div>
            <div className="md:w-3/5 p-6 flex flex-col justify-center">
              <h2 className="text-3xl font-black mb-2">{selectedComic.title}</h2>
              <p className="text-sm text-slate-500 mb-6">PDF Length: {selectedComic.totalPages} Pages</p>

              <div className="space-y-4">
                {/* Buy Single Option */}
                <div onClick={() => { setPendingPurchase(selectedComic); setShowPayment(true); }} className={`border-2 rounded-2xl p-4 cursor-pointer transition hover:border-blue-500 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold">Buy this issue</h4>
                      <p className="text-xs text-slate-500 mt-1">Unlock this PDF permanently</p>
                    </div>
                    <span className="text-xl font-black">{selectedComic.price}</span>
                  </div>
                </div>

                {/* VIP Subscription Option */}
                <div onClick={() => { setPendingPurchase('subscription'); setShowPayment(true); }} className="relative border-2 border-amber-500 bg-amber-50 dark:bg-amber-500/10 rounded-2xl p-4 cursor-pointer transform hover:scale-[1.02] transition">
                  <div className="absolute -top-3 -right-3 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">Best Value</div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-amber-600 dark:text-amber-400 text-lg flex items-center gap-2">
                        Premium VIP Pass <CheckCircle size={16} />
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">Read ALL comics instantly</p>
                    </div>
                    <span className="text-xl font-black text-amber-600">$4.99<span className="text-sm">/mo</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`max-w-md w-full rounded-3xl overflow-hidden shadow-2xl p-6 ${darkMode ? 'bg-slate-900 text-white' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black">Checkout</h3>
              <button onClick={() => { setShowPayment(false); setPendingPurchase(null); }} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full">
                <X size={20} />
              </button>
            </div>

            <p className="text-sm font-bold mb-4 text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
              Purchasing: {pendingPurchase === 'subscription' ? 'VIP Premium Pass ($4.99/mo)' : `${pendingPurchase.title} (${pendingPurchase.price})`}
            </p>

            <div className="flex gap-2 mb-6">
              <button onClick={() => setPaymentMethod('card')} className={`flex-1 py-3 border-2 rounded-xl flex items-center justify-center gap-2 font-bold transition ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 'border-slate-200 text-slate-500'}`}>
                <CreditCard size={18} /> Card
              </button>
              <button onClick={() => setPaymentMethod('paypal')} className={`flex-1 py-3 border-2 rounded-xl flex items-center justify-center gap-2 font-bold transition ${paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 'border-slate-200 text-slate-500'}`}>
                PayPal
              </button>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              {paymentMethod === 'card' ? (
                <>
                  <input type="text" placeholder="Cardholder Name" required className={`w-full p-3 border rounded-xl outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
                  <input type="text" placeholder="Card Number (0000 0000 0000 0000)" required className={`w-full p-3 border rounded-xl outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
                  <div className="flex gap-4">
                    <input type="text" placeholder="MM/YY" required className={`w-1/2 p-3 border rounded-xl outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
                    <input type="text" placeholder="CVC" required className={`w-1/2 p-3 border rounded-xl outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-slate-500 mb-4">You will be redirected to PayPal to complete your purchase securely.</p>
                  <input type="email" placeholder="PayPal Email" required className={`w-full p-3 border rounded-xl outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`} />
                </div>
              )}
              
              <button type="submit" className={`w-full py-4 text-white font-black rounded-xl mt-4 ${themeBlue} shadow-lg flex items-center justify-center gap-2`}>
                <Lock size={16} /> Pay Securely Now
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}