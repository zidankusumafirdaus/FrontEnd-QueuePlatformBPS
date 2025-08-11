const Footer = () => {
  return (
    <footer className="bg-navy-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Kontak Kami</h3>
            <div className="space-y-2">
              <p className="flex items-center">
                <i className="fas fa-map-marker-alt mr-2"></i>
                250 Jalan Raya Gelam 61271 Candi East Java
              </p>
              <p className="flex items-center">
                <i className="fas fa-phone mr-2"></i>
                +62 82143372593
              </p>
              <p className="flex items-center">
                <i className="fas fa-envelope mr-2"></i>
                zidankusumafirdaus.school@gmail.com
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-electric-blue transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#team" className="hover:text-electric-blue transition-colors">
                  Tim Kami
                </a>
              </li>
              <li>
                <a href="#mulai" className="hover:text-electric-blue transition-colors">
                  Mulai
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4">Media Sosial</h3>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/raihan_rz9/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-electric-blue hover:bg-opacity-80 transition-colors"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href="https://www.youtube.com/shorts/eTWB6cKPxvc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-electric-blue hover:bg-opacity-80 transition-colors"
              >
                <i className="fab fa-youtube"></i>
              </a>
              <a 
                href="https://github.com/BIT-B03"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-electric-blue hover:bg-opacity-80 transition-colors"
              >
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; {new Date().getFullYear()} BIT-03 + Haselinda. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
