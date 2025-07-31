import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function Dashboard() {
  const [files, setFiles] = useState([]);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFiles, setTotalFiles] = useState(0);
  const filesPerPage = 5;
  const [selectedFile, setSelectedFile] = useState(null);
  const prevResults = useRef({});

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`https://cyberxplore-project.onrender.com/api/files?page=${currentPage}&limit=${filesPerPage}`);
      const newFiles = res.data.files;
      setTotalFiles(res.data.total || 0);

      // Alert for newly scanned files
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
  }, [currentPage]);

  const filteredFiles = files.filter(file => {
    if (filter === 'all') return true;
    return file.result === filter || (filter === 'pending' && file.status === 'pending');
  });

  const totalPages = Math.ceil(totalFiles / filesPerPage);

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
            {filteredFiles.map((f) => (
              <tr key={f._id}>
                <td data-label="Filename">{f.filename}</td>
                <td data-label="Status" className={f.status}>{f.status}</td>
                <td data-label="Result" className={f.result}>{f.result || '-'}</td>
                <td data-label="Uploaded At">{new Date(f.uploadedAt).toLocaleString()}</td>
                <td data-label="Scanned At">{f.scannedAt ? new Date(f.scannedAt).toLocaleString() : '-'}</td>
                <td data-label="Actions"><button onClick={() => setSelectedFile(f)}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, i) => (
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
