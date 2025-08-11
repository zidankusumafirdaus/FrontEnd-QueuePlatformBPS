import React from 'react';

const TeamModal = ({ member, onClose }) => {
  if (!member) return null;

  const { name, role, image, description, email, instagram, github } = member;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-lg text-gray-600 hover:text-gray-900 transition-colors z-10"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Left side - Image */}
            <div className="md:w-2/5 p-0 flex items-stretch">
              <img 
                src={image} 
                alt={name} 
                className="rounded-xl w-full h-full object-cover object-center border border-gray-200 shadow-md"
              />
            </div>

            {/* Right side - Content */}
            <div className="p-6 md:w-3/5 bg-white">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-navy-900 mb-2">{name}</h2>
                <p className="text-lg text-electric-blue font-medium">{role}</p>
              </div>

              <div className="mb-8">
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>

              <div className="space-y-4">
                {email && (
                  <p className="flex items-center text-gray-600">
                    <i className="fas fa-envelope mr-3 text-navy-900"></i>
                    {email}
                  </p>
                )}
                {instagram && (
                  <p className="flex items-center text-gray-600">
                    <i className="fab fa-instagram mr-3 text-navy-900"></i>
                    {instagram.split('/').pop()}
                  </p>
                )}
                {github && (
                  <p className="flex items-center text-gray-600">
                    <i className="fab fa-github mr-3 text-navy-900"></i>
                    {github.split('/').pop()}
                  </p>
                )}
              </div>

              {/* Social Links */}
              <div className="mt-8 flex gap-4">
                <a 
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-4 bg-navy-900 text-white rounded-full text-center hover:bg-electric-blue transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fab fa-github"></i>
                  <span>Github</span>
                </a>
                <a 
                  href={`mailto:${email}`}
                  className="flex-1 py-2 px-4 bg-navy-900 text-white rounded-full text-center hover:bg-electric-blue transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fas fa-envelope"></i>
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamModal;
