import React, { useState, useEffect } from 'react';
import { DataTable } from './DataTable';
import { MessageDisplay } from './MessageDisplay';

interface JobSpec {
  cvId: number | null;
  id: number;
  job_spec_content: string;
  location: string | null;
  salary: number | null;
  score: number | null;
  company: string | null;
  jobTitle: string | null;
}

export function JobSpecManager() {
  const [jobSpecContent, setJobSpecContent] = useState('');
  const [selectedCvId, setSelectedCvId] = useState<number | ''>('');
  const [isSubmittingJobSpec, setIsSubmittingJobSpec] = useState(false);
  const [message2, setMessage2] = useState('');
  const [jobSpecs, setJobSpecs] = useState<JobSpec[]>([]);
  const [cvs, setCvs] = useState<any[]>([]);
  const [selectedJobSpec, setSelectedJobSpec] = useState<JobSpec | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCvs();
    fetchJobSpecs();
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

  const fetchJobSpecs = async () => {
    try {
      const response = await fetch('/api/jobspec');
      if (response.ok) {
        const data = await response.json();
        setJobSpecs(data);
      }
    } catch (error) {
      console.error('Error fetching job specs:', error);
    }
  };

  const handleSubmitJobSpec = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobSpecContent.trim()) return;

    setIsSubmittingJobSpec(true);
    setMessage2('');

    try {
      const response = await fetch('/api/jobspec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvId: selectedCvId === '' ? null : Number(selectedCvId),
          job_spec_content: jobSpecContent,
        }),
      });

      if (response.ok) {
        setMessage2('Job spec submitted successfully!');
        setJobSpecContent('');
        setSelectedCvId('');
        fetchJobSpecs();
      } else {
        setMessage2('Failed to submit job spec');
      }
    } catch (error) {
      setMessage2('Error connecting to backend');
    } finally {
      setIsSubmittingJobSpec(false);
    }
  };

  const handleDeleteJobSpec = async (id: number) => {
    try {
      const response = await fetch(`/api/jobspec/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage2('Job spec deleted successfully!');
        fetchJobSpecs();
      } else {
        setMessage2('Failed to delete job spec');
      }
    } catch (error) {
      setMessage2('Error deleting job spec');
    }
  };

  const handleViewClick = (jobSpec: JobSpec) => {
    setSelectedJobSpec(jobSpec);
    setShowModal(true);
  };

  const jobSpecColumns = [
    { key: 'id', header: 'ID' },
    { key: 'cvId', header: 'CV ID' },
    { key: 'location', header: 'Location' },
    { key: 'salary', header: 'Salary' },
    { key: 'score', header: 'Score' },
    { key: 'company', header: 'Company' },
    { key: 'jobTitle', header: 'Job Title' },
  ];

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'number') return `${value}`;
    return value;
  };

  return (
    <div>
      <h1>Add Job Spec</h1>
      <form onSubmit={handleSubmitJobSpec}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="cvId">CV:</label>
          <select
            id="cvId"
            name="cvId"
            value={selectedCvId}
            onChange={(e) =>
              setSelectedCvId(
                e.target.value === '' ? '' : Number(e.target.value),
              )
            }
            required
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="">Select a CV</option>
            {cvs.map((cv) => (
              <option key={cv.id} value={cv.id}>
                {cv.name} ({cv.id})
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="job_spec_content">Job Spec Content:</label>
          <textarea
            id="job_spec_content"
            name="job_spec_content"
            value={jobSpecContent}
            onChange={(e) => setJobSpecContent(e.target.value)}
            required
            rows={5}
            style={{ marginLeft: '10px', padding: '5px', width: '300px' }}
          />
        </div>
        <button type="submit" disabled={isSubmittingJobSpec}>
          {isSubmittingJobSpec ? 'Adding...' : 'Add Job Spec'}
        </button>
      </form>
      <MessageDisplay message={message2} marginTop="10px" />

      <h1 style={{ marginTop: '40px' }}>Job Spec List</h1>
      <DataTable
        data={jobSpecs}
        columns={jobSpecColumns}
        onDelete={handleDeleteJobSpec}
        onActionClick={handleViewClick}
        actionLabel="View/Edit"
        emptyMessage="No job specs submitted yet."
        formatValue={formatValue}
      />

      {showModal && selectedJobSpec && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '700px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
          >
            <h2>Job Spec Details</h2>
            <div style={{ marginBottom: '15px' }}>
              <strong>ID:</strong> {selectedJobSpec.id}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>CV ID:</strong> {selectedJobSpec.cvId || '-'}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Job Title:</strong> {selectedJobSpec.jobTitle || '-'}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Company:</strong> {selectedJobSpec.company || '-'}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Location:</strong> {selectedJobSpec.location || '-'}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Salary:</strong> ${selectedJobSpec.salary ?? '-'}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Score:</strong> {selectedJobSpec.score ?? '-'}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Job Spec Content:</strong>
              <pre
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '10px',
                  borderRadius: '4px',
                  marginTop: '5px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {selectedJobSpec.job_spec_content}
              </pre>
            </div>
            <button
              onClick={() => setShowModal(false)}
              style={{ padding: '10px 20px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
