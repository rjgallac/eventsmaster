import React, { useState, useEffect } from 'react';
import { CvForm } from './CvForm';
import { CvList } from './CvList';
import { CvModal } from './CvModal';
import { SuggestionModal } from './SuggestionModal';
import { Cv } from '../types/Cv';

export function CvManager() {
  const [view, setView] = useState<'form' | 'list'>('form');
  const [cvs, setCvs] = useState<Cv[]>([]);
  const [selectedCv, setSelectedCv] = useState<Cv | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);

  useEffect(() => {
    fetchCvs();
  }, []);

  const fetchCvs = async () => {
    try {
      const response = await fetch('/api/cv');
      if (response.ok) {
        const data: Cv[] = await response.json();
        setCvs(data);
      }
    } catch (error) {
      console.error('Error fetching CVs:', error);
    }
  };

  const handleSubmitCv = async (name: string, content: string) => {
    try {
      const response = await fetch('/api/cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, curriculum_vitae_content: content }),
      });

      if (response.ok) {
        fetchCvs();
      } else {
        throw new Error('Failed to submit CV');
      }
    } catch (error) {
      console.error('Submission error:', error);
      throw error;
    }
  };

  const handleDeleteCv = async (id: number) => {
    try {
      const response = await fetch(`/api/cv/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCvs();
      } else {
        throw new Error('Failed to delete CV');
      }
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  };

  const handleViewClick = (cv: Cv) => {
    setSelectedCv(cv);
    setShowModal(true);
  };

  const handleSuggestCv = async (id: number) => {
    try {
      const response = await fetch(`/api/cv/${id}/suggest`);
      if (!response.ok) {
        throw new Error('Failed to get suggestion');
      }
      const data: Cv = await response.json();
      // setSelectedCv(data);
      // setShowSuggestionModal(true);
    } catch (error) {
      console.error('Suggest error:', error);
      throw error;
    }
  };

  const handleSuggestClick = (cv: Cv) => {
    setSelectedCv(cv);
    setShowSuggestionModal(true);
  };

  const handleViewSuggestionsClick = async (cv: Cv) => {
    try {
      const response = await fetch(`/api/cv/${cv.id}`);
      if (!response.ok) {
        throw new Error('Failed to get CV details');
      }
      const data: Cv = await response.json();
      setSelectedCv(data);
      setShowSuggestionModal(true);
    } catch (error) {
      console.error('View suggestions error:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <nav className="flex space-x-4 border-b">
        <button
          onClick={() => setView('form')}
          className={`px-4 py-2 font-medium ${
            view === 'form'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Add CV
        </button>
        <button
          onClick={() => {
            setView('list');
            fetchCvs();
          }}
          className={`px-4 py-2 font-medium ${
            view === 'list'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          CV List
        </button>
      </nav>

      {view === 'form' ? (
        <CvForm
          onSubmitCv={handleSubmitCv}
          onNavigateToList={() => setView('list')}
        />
      ) : (
        <CvList
          cvs={cvs}
          onView={handleViewClick}
          onDelete={handleDeleteCv}
          onSuggest={handleSuggestCv}
          onViewSuggestions={handleViewSuggestionsClick}
        />
      )}

      {showModal && selectedCv && (
        <CvModal cv={selectedCv} onClose={() => setShowModal(false)} />
      )}

      {showSuggestionModal && selectedCv && (
        <SuggestionModal
          cv={selectedCv}
          onClose={() => setShowSuggestionModal(false)}
        />
      )}
    </div>
  );
}
