import React, { useState, useEffect, useRef } from 'react';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { DataTable } from './DataTable';
import { MessageDisplay } from './MessageDisplay';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [submittingJobSpecIds, setSubmittingJobSpecIds] = useState<number[]>(
    [],
  );
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    fetchCvs();
    fetchJobSpecs();
    connectWebSocket();
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  const connectWebSocket = () => {
    const stompClient: Client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
    });

    stompClient.onConnect = (frame: any) => {
      console.log('Connected to WebSocket:', frame);
      const subscription: StompSubscription = stompClient.subscribe(
        '/topic/status',
        (message: any) => {
          try {
            const statusMessage: any = JSON.parse(message.body);
            updateJobSpecInList(statusMessage);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        },
      );
    };

    stompClient.onStompError = (frame: any) => {
      console.error('WebSocket connection error:', frame);
    };

    stompClient.activate();

    stompClientRef.current = stompClient;
  };

  const updateJobSpecInList = (statusMessage: any) => {
    toast.success(`Job Spec ${statusMessage.jobSpecId} updated`, {
      autoClose: 3000,
    });

    setJobSpecs((prevJobSpecs) =>
      prevJobSpecs.map((jobSpec) => {
        if (jobSpec.id === statusMessage.jobSpecId) {
          return {
            ...jobSpec,
            score: statusMessage.score,
            location: statusMessage.location,
            jobTitle: statusMessage.title,
            company: statusMessage.company,
            salary: statusMessage.salary
              ? parseInt(statusMessage.salary)
              : null,
          };
        }
        return jobSpec;
      }),
    );

    setSubmittingJobSpecIds((prev) =>
      prev.filter((id) => id !== statusMessage.jobSpecId),
    );
  };

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

        const existingIds = data.map((js: JobSpec) => js.id);
        setSubmittingJobSpecIds((prev) =>
          prev.filter((id) => existingIds.includes(id)),
        );
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
        let parsedSuccessfully = false;
        try {
          const data = await response.json();
          if (data && data.id) {
            setSubmittingJobSpecIds((prev) => [...prev, data.id]);
            parsedSuccessfully = true;
          } else {
            console.log('Response received but no ID:', data);
          }
        } catch (parseError) {
          console.log('Response not JSON, refreshing list');
          const tempId = Date.now();
          setSubmittingJobSpecIds((prev) => [...prev, tempId]);

          setTimeout(() => {
            fetchJobSpecs();
          }, 500);
        }

        setMessage2('Job spec submitted successfully!');
        setJobSpecContent('');
        setSelectedCvId('');

        if (parsedSuccessfully) {
          fetchJobSpecs();
        }
      } else {
        setMessage2('Failed to submit job spec');
      }
    } catch (error) {
      console.error('Submission error:', error);
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

  const isSubmitting = (id: number) => submittingJobSpecIds.includes(id);

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'number') return `${value}`;
    return value;
  };

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-4">Add Job Spec</h1>
      <form
        onSubmit={handleSubmitJobSpec}
        className="bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <div>
          <label
            htmlFor="cvId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            CV:
          </label>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a CV</option>
            {cvs.map((cv) => (
              <option key={cv.id} value={cv.id}>
                {cv.name} ({cv.id})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="job_spec_content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Job Spec Content:
          </label>
          <textarea
            id="job_spec_content"
            name="job_spec_content"
            value={jobSpecContent}
            onChange={(e) => setJobSpecContent(e.target.value)}
            required
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmittingJobSpec}
          className={`w-full px-4 py-2 text-white rounded-md ${isSubmittingJobSpec ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'}`}
        >
          {isSubmittingJobSpec ? 'Adding...' : 'Add Job Spec'}
        </button>
      </form>
      <MessageDisplay message={message2} marginTop="10px" />

      <h1 className="text-2xl font-bold mt-8 mb-4">Job Spec List</h1>
      <DataTable
        data={jobSpecs}
        columns={jobSpecColumns}
        onDelete={handleDeleteJobSpec}
        onActionClick={handleViewClick}
        actionLabel="View/Edit"
        emptyMessage="No job specs submitted yet."
        formatValue={formatValue}
        isSubmitting={isSubmitting}
      />

      {showModal && selectedJobSpec && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-[700px] w-[90%] max-h-[80vh] overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Job Spec Details</h2>
            <div className="mb-3">
              <strong>ID:</strong> {selectedJobSpec.id}
            </div>
            <div className="mb-3">
              <strong>CV ID:</strong> {selectedJobSpec.cvId || '-'}
            </div>
            <div className="mb-3">
              <strong>Job Title:</strong> {selectedJobSpec.jobTitle || '-'}
            </div>
            <div className="mb-3">
              <strong>Company:</strong> {selectedJobSpec.company || '-'}
            </div>
            <div className="mb-3">
              <strong>Location:</strong> {selectedJobSpec.location || '-'}
            </div>
            <div className="mb-3">
              <strong>Salary:</strong> ${selectedJobSpec.salary ?? '-'}
            </div>
            <div className="mb-3">
              <strong>Score:</strong> {selectedJobSpec.score ?? '-'}
            </div>
            <div className="mb-3">
              <strong>Job Spec Content:</strong>
              <pre className="bg-gray-100 p-3 rounded mt-1 whitespace-pre-wrap break-word">
                {selectedJobSpec.job_spec_content}
              </pre>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
