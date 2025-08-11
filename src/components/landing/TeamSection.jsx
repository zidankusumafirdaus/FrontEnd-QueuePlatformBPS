import { useState } from 'react';
import { teamMembers } from './teamData';
import TeamCard from './TeamCard';
import TeamModal from './TeamModal';

const TeamSection = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  const handleCardClick = (member) => {
    setSelectedMember(member);
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
  };

  return (
    <section id="team" className="py-20 bg-pearl-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-navy-900 text-center mb-16">
          KENALI TIM KAMI
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <TeamCard 
              key={member.id}
              member={member}
              onClick={handleCardClick}
            />
          ))}
        </div>
      </div>

      {selectedMember && (
        <TeamModal 
          member={selectedMember} 
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
};

export default TeamSection;
