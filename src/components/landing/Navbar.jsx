import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <span className="text-[#1E3A8A] font-bold text-2xl mr-2">TIM</span>
              <span className="text-[#00AEEF] font-bold text-2xl">DEVELOPERS</span>
            </a>
          </div>

          {/* Desktop menu */}
          <div className="hidden lg:flex lg:items-center">
            <a href="#" className="text-[#1E3A8A] hover:text-[#00AEEF] px-6 py-2 font-medium text-lg transition-colors">
              Beranda
            </a>
            <a href="#team" className="text-[#1E3A8A] hover:text-[#00AEEF] px-6 py-2 font-medium text-lg transition-colors">
              Tim
            </a>
            <a href="#mulai" className="text-[#1E3A8A] hover:text-[#00AEEF] px-6 py-2 font-medium text-lg transition-colors">
              Mulai
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-[#1E3A8A] hover:text-[#00AEEF] focus:outline-none text-2xl"
            onClick={toggleMenu}
          >
            ☰
          </button>

          {/* Mobile menu */}
          <div className={`${isMenuOpen ? 'block' : 'hidden'} lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-200 z-50`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="block px-3 py-2 text-[#1E3A8A] hover:text-[#00AEEF] font-medium text-lg transition-colors">
                Beranda
              </a>
              <a href="#team" className="block px-3 py-2 text-[#1E3A8A] hover:text-[#00AEEF] font-medium text-lg transition-colors">
                Tim
              </a>
              <a href="#mulai" className="block px-3 py-2 text-[#1E3A8A] hover:text-[#00AEEF] font-medium text-lg transition-colors">
                Mulai
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
