import React, { useState, useEffect } from 'react';
import { DataTable } from './DataTable';
import { MessageDisplay } from './MessageDisplay';

interface Cv {
  id: number;
  name: string;
}

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

interface JobSpecManagerProps {
  cvs: Cv[];
}

export function JobSpecManager({ cvs }: JobSpecManagerProps) {
  const [jobSpecContent, setJobSpecContent] = useState('');
  const [selectedCvId, setSelectedCvId] = useState<number | ''>('');
  const [isSubmittingJobSpec, setIsSubmittingJobSpec] = useState(false);
  const [message2, setMessage2] = useState('');
  const [jobSpecs, setJobSpecs] = useState<JobSpec[]>([]);

  useEffect(() => {
    fetchJobSpecs();
  }, []);

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

  const jobSpecColumns = [
    { key: 'id', header: 'ID' },
    { key: 'cvId', header: 'CV ID' },
    { key: 'job_spec_content', header: 'Job Spec Content' },
    { key: 'location', header: 'Location' },
    { key: 'salary', header: 'Salary' },
    { key: 'score', header: 'Score' },
    { key: 'company', header: 'Company' },
    { key: 'jobTitle', header: 'Job Title' },
  ];

  const formatValue = (value: any, _row: JobSpec) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'number') {
      return `$${value}`;
    }
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
        emptyMessage="No job specs submitted yet."
        formatValue={formatValue}
      />
    </div>
  );
}
