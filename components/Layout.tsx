import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';
import { LogOut, LayoutDashboard, PlusCircle, List, PieChart, FileSpreadsheet, User as UserIcon, Shield, Activity, Globe, Euro, Upload, Camera, X } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface LayoutProps {
  children: React.ReactNode;
  currentPath: string;
  navigate: (path: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPath, navigate }) => {
  const { user, logout, updateUserAvatar } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return <>{children}</>;

  const isManager = user.role === UserRole.MANAGER;
  const isAdmin = user.role === UserRole.ADMIN;
  const isManagerOrAdmin = isManager || isAdmin;

  const handleAvatarClick = () => {
    setIsAvatarModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      updateUserAvatar(user.id, base64String);
      setIsAvatarModalOpen(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar / Mobile Nav */}
      <aside className="bg-white border-r border-gray-200 md:w-64 md:h-screen sticky top-0 z-30">
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center gap-2 text-blue-600">
            <Euro className="h-7 w-7" />
            <span className="text-xl font-bold tracking-tight">{t('nav.dashboard')}</span>
          </div>
        </div>

        <div className="p-4 flex flex-col justify-between h-[calc(100vh-4rem)]">
          <nav className="space-y-1 overflow-y-auto">
            {isManagerOrAdmin ? (
              <>
                <div className="px-3 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {t('nav.management')}
                </div>
                <NavItem 
                  icon={<PieChart />} 
                  label={t('nav.teamDashboard')} 
                  active={currentPath === '/dashboard'} 
                  onClick={() => navigate('/dashboard')} 
                />
                 <NavItem 
                  icon={<List />} 
                  label={t('nav.allExpenses')} 
                  active={currentPath === '/all-expenses'} 
                  onClick={() => navigate('/all-expenses')} 
                />
                <NavItem 
                  icon={<FileSpreadsheet />} 
                  label={t('nav.expenseReports')} 
                  active={currentPath === '/expense-report'} 
                  onClick={() => navigate('/expense-report')} 
                />
                {isAdmin && (
                  <NavItem 
                    icon={<Shield />} 
                    label={t('nav.userManagement')} 
                    active={currentPath === '/user-management'} 
                    onClick={() => navigate('/user-management')} 
                  />
                )}

                <div className="mt-6 px-3 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {t('nav.personal')}
                </div>
                <NavItem 
                  icon={<Activity />} 
                  label={t('nav.myDashboard')} 
                  active={currentPath === '/my-expenses'} 
                  onClick={() => navigate('/my-expenses')} 
                />
                 <NavItem 
                  icon={<PlusCircle />} 
                  label={t('nav.addExpense')} 
                  active={currentPath === '/add-expense'} 
                  onClick={() => navigate('/add-expense')} 
                />
              </>
            ) : (
              <>
                <NavItem 
                  icon={<List />} 
                  label={t('nav.myDashboard')} 
                  active={currentPath === '/my-expenses'} 
                  onClick={() => navigate('/my-expenses')} 
                />
                <NavItem 
                  icon={<PlusCircle />} 
                  label={t('nav.addExpense')} 
                  active={currentPath === '/add-expense'} 
                  onClick={() => navigate('/add-expense')} 
                />
                <NavItem 
                  icon={<FileSpreadsheet />} 
                  label={t('nav.expenseReports')} 
                  active={currentPath === '/expense-report'} 
                  onClick={() => navigate('/expense-report')} 
                />
              </>
            )}
          </nav>

          <div className="border-t pt-4 mt-auto space-y-4">
            {/* Language Selector */}
            <div className="px-3">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Globe className="h-4 w-4" />
                    <span>Language</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setLanguage('en')} className={`px-2 py-1 text-xs rounded border ${language === 'en' ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' : 'border-gray-200 text-gray-600'}`}>EN</button>
                    <button onClick={() => setLanguage('es')} className={`px-2 py-1 text-xs rounded border ${language === 'es' ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' : 'border-gray-200 text-gray-600'}`}>ES</button>
                    <button onClick={() => setLanguage('fr')} className={`px-2 py-1 text-xs rounded border ${language === 'fr' ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' : 'border-gray-200 text-gray-600'}`}>FR</button>
                </div>
            </div>

            <div 
              className="flex items-center gap-3 px-3 py-2 mb-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors group relative"
              onClick={handleAvatarClick}
              title={t('profile.changeAvatar')}
            >
               <div className="relative">
                 {user.avatar ? (
                   <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                 ) : (
                   <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                     <UserIcon className="w-6 h-6 text-gray-500" />
                   </div>
                 )}
                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all">
                    <Camera className="w-4 h-4 text-white opacity-0 group-hover:opacity-100" />
                 </div>
               </div>
               <div className="overflow-hidden">
                 <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                 <p className="text-xs text-gray-500 capitalize">{user.role}</p>
               </div>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              {t('nav.signOut')}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {children}
      </main>

      {/* Avatar Upload Modal */}
      <Modal 
        isOpen={isAvatarModalOpen} 
        onClose={() => setIsAvatarModalOpen(false)}
        title={t('profile.changeAvatar')}
      >
        <div className="flex flex-col items-center space-y-6 py-4">
           <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg relative bg-gray-50">
             {user.avatar ? (
               <img src={user.avatar} alt="current avatar" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center">
                 <UserIcon className="w-12 h-12 text-gray-300" />
               </div>
             )}
           </div>
           
           <div className="w-full flex flex-col gap-3">
             <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               accept="image/*"
               onChange={handleFileChange}
             />
             <Button onClick={() => fileInputRef.current?.click()} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                {t('profile.uploadNew')}
             </Button>
             
             {/* Optional: Button to remove avatar if needed in future */}
             {/* <Button onClick={() => { updateUserAvatar(user.id, ''); setIsAvatarModalOpen(false); }} variant="outline" className="w-full text-red-600 hover:bg-red-50 border-red-200">
                {t('profile.remove')}
             </Button> */}
           </div>
        </div>
      </Modal>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
      active 
        ? 'bg-blue-50 text-blue-700' 
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "h-5 w-5" })}
    {label}
  </button>
);