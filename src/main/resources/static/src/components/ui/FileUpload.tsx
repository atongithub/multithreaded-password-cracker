import React, { useState } from 'react';

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [wordlist, setWordlist] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !wordlist) {
      alert('Please select a file and provide a wordlist.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('wordlist', wordlist);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json(); // Assuming backend returns JSON
        setResult(result.crackedPassword || 'No password found.');
      } else {
        alert('Failed to upload file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred while uploading the file.');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Enter wordlist"
        value={wordlist}
        onChange={(e) => setWordlist(e.target.value)}
      />
      <button onClick={handleUpload}>Upload</button>
      {result && <div>Result: {result}</div>}
    </div>
  );
};

export default FileUpload;
