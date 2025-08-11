const TeamCard = ({ member, onClick }) => {
  const { name, title, image, description, instagram, github, email, phone, IgUsername } = member;

  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:shadow-xl cursor-pointer hover:scale-105"
      onClick={() => onClick(member)}
    >
      <div className="aspect-w-4 aspect-h-5 bg-gray-100">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#1E3A8A] mb-1">{name}</h3>
        <p className="text-[#00AEEF] font-medium mb-3">{title}</p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
        <div className="flex gap-3 justify-start items-end">
          <div className="relative group">
            <a 
              href={instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1E3A8A] text-white hover:bg-[#00AEEF] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <i className="fab fa-instagram"></i>
            </a>
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {IgUsername}
            </span>
          </div>
          <a 
            href={github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1E3A8A] text-white hover:bg-[#00AEEF] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <i className="fab fa-github"></i>
          </a>
          <a 
            href={`mailto:${email}`}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1E3A8A] text-white hover:bg-[#00AEEF] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <i className="fas fa-envelope"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
