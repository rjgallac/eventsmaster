import React, { useState, useEffect } from 'react';

interface CvStatus {
  id: string;
  status: string;
}

interface Cv {
  id: number;
  name: string;
  curriculum_vitae_content: string;
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

export function App() {
  const [name, setName] = useState('');
  const [cvContent, setCvContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [cvs, setCvs] = useState<Cv[]>([]);

  const [jobSpecContent, setJobSpecContent] = useState('');
  const [selectedCvId, setSelectedCvId] = useState<number | ''>('');
  const [isSubmittingJobSpec, setIsSubmittingJobSpec] = useState(false);
  const [message2, setMessage2] = useState('');
  const [jobSpecs, setJobSpecs] = useState<JobSpec[]>([]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !cvContent.trim()) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, curriculum_vitae_content: cvContent }),
      });

      if (response.ok) {
        setMessage('CV submitted successfully!');
        setName('');
        setCvContent('');
        fetchCvs();
      } else {
        setMessage('Failed to submit CV');
      }
    } catch (error) {
      setMessage('Error connecting to backend');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCvContent(e.target.value);
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

  const handleJobSpecContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setJobSpecContent(e.target.value);
  };

  const handleCvIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCvId(e.target.value === '' ? '' : Number(e.target.value));
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

  const handleDeleteCv = async (id: number) => {
    try {
      const response = await fetch(`/api/cv/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('CV deleted successfully!');
        fetchCvs();
      } else {
        setMessage('Failed to delete CV');
      }
    } catch (error) {
      setMessage('Error deleting CV');
    }
  };

  return (
    <div>
      <h1>Add CV</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleNameChange}
            required
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="curriculum_vitae_content">
            Curriculum Vitae Content:
          </label>
          <textarea
            id="curriculum_vitae_content"
            name="curriculum_vitae_content"
            value={cvContent}
            onChange={handleChange}
            required
            rows={5}
            style={{ marginLeft: '10px', padding: '5px', width: '300px' }}
          />
        </div>
        <button type="submit" disabled={isSubmitting || !cvContent.trim()}>
          {isSubmitting ? 'Submitting...' : 'Submit CV'}
        </button>
      </form>
      {message && (
        <p
          style={{
            color: message.includes('success') ? 'green' : 'red',
            marginTop: '20px',
          }}
        >
          {message}
        </p>
      )}

      <h1 style={{ marginTop: '40px' }}>CV List</h1>
      {cvs.length === 0 ? (
        <p>No CVs submitted yet.</p>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'left',
                }}
              >
                ID
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'left',
                }}
              >
                Name
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'left',
                }}
              >
                CV Content
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'center',
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {cvs.map((cv) => (
              <tr key={cv.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {cv.id}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {cv.name}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {cv.curriculum_vitae_content}
                </td>
                <td
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    textAlign: 'center',
                  }}
                >
                  <button
                    onClick={() => handleDeleteCv(cv.id)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h1 style={{ marginTop: '40px' }}>Add Job Spec</h1>
      <form onSubmit={handleSubmitJobSpec}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="cvId">CV:</label>
          <select
            id="cvId"
            name="cvId"
            value={selectedCvId}
            onChange={handleCvIdChange}
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
            onChange={handleJobSpecContentChange}
            required
            rows={5}
            style={{ marginLeft: '10px', padding: '5px', width: '300px' }}
          />
        </div>
        <button type="submit" disabled={isSubmittingJobSpec}>
          {isSubmittingJobSpec ? 'Adding...' : 'Add Job Spec'}
        </button>
      </form>
      {message2 && (
        <p
          style={{
            color: message2.includes('success') ? 'green' : 'red',
            marginTop: '10px',
          }}
        >
          {message2}
        </p>
      )}

      <h1 style={{ marginTop: '40px' }}>Job Spec List</h1>
      {jobSpecs.length === 0 ? (
        <p>No job specs submitted yet.</p>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'left',
                }}
              >
                ID
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'left',
                }}
              >
                CV ID
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'left',
                }}
              >
                Job Spec Content
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'left',
                }}
              >
                Location
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'left',
                }}
              >
                Salary
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'left',
                }}
              >
                Score
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'left',
                }}
              >
                Company
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'left',
                }}
              >
                Job Title
              </th>
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: 'center',
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {jobSpecs.map((js) => (
              <tr key={js.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {js.id}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {js.cvId ?? '-'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {js.job_spec_content}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {js.location ?? '-'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {js.salary != null ? `$${js.salary}` : '-'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {js.score ?? '-'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {js.company ?? '-'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {js.jobTitle ?? '-'}
                </td>
                <td
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    textAlign: 'center',
                  }}
                >
                  <button
                    onClick={() => handleDeleteJobSpec(js.id)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
