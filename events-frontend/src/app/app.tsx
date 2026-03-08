import React, { useState, useEffect } from 'react';
import { CvManager } from '../components/CvManager';
import { JobSpecManager } from '../components/JobSpecManager';

export function App() {
  const [cvs, setCvs] = useState<any[]>([]);

  useEffect(() => {
    fetchCvs();
  }, []);

  const fetchCvs = async () => {
    try {
      const response = await fetch('/api/cv');
      if (response.ok) {
        const data = await response.json();
        setCvs(data);
      }
    } catch (error) {
      console.error('Error fetching CVs:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <CvManager cvs={cvs} />
      <JobSpecManager cvs={cvs} />
    </div>
  );
}

export default App;
