
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DB } from './services/db.ts';
import { User } from './types.ts';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Dashboard from './pages/Dashboard.tsx';
import CourseDetails from './pages/CourseDetails.tsx';
import Profile from './pages/Profile.tsx';
import JoinHandler from './pages/JoinHandler.tsx';
import Navbar from './components/Navbar.tsx';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(DB.getAuthUser());

  const handleLogin = (u: User) => {
    setUser(u);
    DB.setAuthUser(u);
  };

  const handleLogout = () => {
    setUser(null);
    DB.setAuthUser(null);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    setUser(updatedUser);
    DB.setAuthUser(updatedUser);
    const users = await DB.getUsers();
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    await DB.saveUsers(updatedUsers);
  };

  useEffect(() => {
    const color = user?.themeColor || '#D4AF37';
    document.documentElement.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--primary-color-light', color + '22');
  }, [user?.themeColor]);

  return (
    <HashRouter>
      <style>{`
        :root { 
          --primary-color: #D4AF37; 
          --primary-color-light: rgba(212, 175, 55, 0.1); 
        }
        .bg-primary { background-color: var(--primary-color); }
        .text-primary { color: var(--primary-color); }
        .border-primary { border-color: var(--primary-color); }
        input, select, textarea { 
          color: #ffffff !important; 
          background: rgba(255,255,255,0.05) !important; 
          border: 1px solid rgba(212, 175, 55, 0.1) !important; 
        }
        input:focus, textarea:focus { 
          border-color: var(--primary-color) !important; 
          box-shadow: 0 0 10px var(--primary-color-light); 
          outline: none;
        }
        input::placeholder, textarea::placeholder { 
          color: #64748b !important; 
          opacity: 1; 
        }
      `}</style>
      <div className="min-h-screen flex flex-col relative selection:bg-amber-500/30">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
          <Routes>
            <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register onLogin={handleLogin} /> : <Navigate to="/" />} />
            <Route path="/join/:code" element={<JoinHandler user={user} />} />
            <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/course/:id" element={user ? <CourseDetails user={user} /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile user={user} onUpdateUser={handleUpdateUser} /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="bg-slate-950/80 backdrop-blur-xl border-t border-white/5 py-10 text-center text-slate-500 z-10">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.4em] text-amber-500 font-black mb-4">Precision in Attendance, Excellence in Education</p>
            <p className="font-black text-white text-lg tracking-tighter">Safi Ullah</p>
            <p className="font-bold text-slate-400 text-sm">IMSciences Academic Representative</p>
            <div className="flex justify-center items-center gap-x-6 mt-4">
              <a href="mailto:safiu2543@gmail.com" className="text-amber-500/80 hover:text-amber-400 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                safiu2543@gmail.com
              </a>
              <span className="text-slate-800">|</span>
              <a href="tel:+923065083083" className="text-amber-500/80 hover:text-amber-400 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.405 5.405l.773-1.548a1 1 0 011.06-.539l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
                +92 306 5083083
              </a>
            </div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-slate-600 mt-8">&copy; {new Date().getFullYear()} The Gold Standard Management Portal</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
