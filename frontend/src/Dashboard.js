import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function Dashboard() {
  const [files, setFiles] = useState([]);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 5;
  const [selectedFile, setSelectedFile] = useState(null);
  const prevResults = useRef({});

  const fetchFiles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/files');
      const newFiles = res.data.files; 

      // Alert when scan completes
      newFiles.forEach(file => {
        if (
          file.status === 'scanned' &&
          prevResults.current[file._id] !== 'scanned'
        ) {
          alert(`Scan complete: ${file.filename} → ${file.result.toUpperCase()}`);
        }
      });

      const statusMap = {};
      newFiles.forEach(file => {
        statusMap[file._id] = file.status;
      });
      prevResults.current = statusMap;

      setFiles(newFiles);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  useEffect(() => {
    fetchFiles();
    const interval = setInterval(fetchFiles, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredFiles = files.filter(file => {
    if (filter === 'all') return true;
    return file.result === filter || (filter === 'pending' && file.status === 'pending');
  });

  const indexOfLast = currentPage * filesPerPage;
  const indexOfFirst = indexOfLast - filesPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirst, indexOfLast);

  return (
    <div className="dashboard">
      <h2>File Scan Dashboard</h2>

      <div className="filter-bar">
        <label htmlFor="statusFilter">Filter by status:</label>
        <select
          id="statusFilter"
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
        >
          <option value="all">All</option>
          <option value="clean">Clean</option>
          <option value="infected">Infected</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Filename</th>
              <th>Status</th>
              <th>Result</th>
              <th>Uploaded At</th>
              <th>Scanned At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentFiles.length > 0 ? (
              currentFiles.map((f) => (
                <tr key={f._id}>
                  <td>{f.filename}</td>
                  <td className={f.status}>{f.status}</td>
                  <td className={f.result}>{f.result || '-'}</td>
                  <td>{new Date(f.uploadedAt).toLocaleString()}</td>
                  <td>{f.scannedAt ? new Date(f.scannedAt).toLocaleString() : '-'}</td>
                  <td><button onClick={() => setSelectedFile(f)}>View</button></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No files found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredFiles.length / filesPerPage) }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedFile && (
        <div className="modal">
          <div className="modal-content">
            <h3>File Details</h3>
            <p><strong>Filename:</strong> {selectedFile.filename}</p>
            <p><strong>Status:</strong> {selectedFile.status}</p>
            <p><strong>Result:</strong> {selectedFile.result}</p>
            <p><strong>Uploaded At:</strong> {new Date(selectedFile.uploadedAt).toLocaleString()}</p>
            <p><strong>Scanned At:</strong> {selectedFile.scannedAt ? new Date(selectedFile.scannedAt).toLocaleString() : '-'}</p>
            <button onClick={() => setSelectedFile(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
