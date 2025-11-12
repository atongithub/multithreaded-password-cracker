import React, { useEffect, useState } from 'react';

type ResultsProps = {
  jobId: number;
};

const Results: React.FC<ResultsProps> = ({ jobId }) => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/result/${jobId}`);
        if (response.ok) {
          const data = await response.json();
          setResult(data.crackedPassword || 'No password found.');
        } else {
          setResult('Result not found or job still in progress.');
        }
      } catch (error) {
        console.error('Error fetching result:', error);
        setResult('An error occurred while fetching the result.');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [jobId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Results</h2>
      <p>{result}</p>
    </div>
  );
};

export default Results;
