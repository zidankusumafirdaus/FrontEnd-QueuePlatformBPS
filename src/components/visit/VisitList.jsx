import React, { useEffect, useState } from 'react';

// Importing the fetchVisits function from the API service
import { fetchVisits } from '../../service/api/api';

const VisitList = () => {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    const getVisits = async () => {
      try {
        const response = await fetchVisits();
        setVisits(response.data);
      } catch (error) {
        console.error('Error fetching visits:', error);
      }
    };

    getVisits();
  }, []);

  return (
    <div>
      <h1>List of Visits</h1>
      <ul>
        {visits.map((visit) => (
          <li key={visit.id}>{visit.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default VisitList;
