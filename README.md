# CyberXplore File Scanner

A full-stack web application that allows users to upload documents, simulates malware scanning in the background, and displays results in a responsive dashboard.

## Live Demo

- **Frontend**: [https://silver-crisp-1f28ed.netlify.app](https://silver-crisp-1f28ed.netlify.app)
- **Backend**: [https://cyberxplore-project.onrender.com](https://cyberxplore-project.onrender.com)

## Tech Stack

- **Frontend**: React, CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas
- **Queue**: Custom in-memory queue
- **Deployment**: Netlify (frontend), Render (backend)

## Features

### Core Functionality

- Upload files (.pdf, .docx, .jpg, .png) up to 5MB
- Store metadata in MongoDB
- Background job queue to simulate malware scanning
- Malware scan simulation (2–5 sec delay with keyword detection)
- Dashboard displays:
  - Filename
  - Scan status (pending, scanned)
  - Scan result (clean, infected)
  - Uploaded and scanned timestamps

### Bonus Features Implemented

- Responsive UI for all devices
- Upload progress indicator
- Filter by scan result (clean, infected, pending)
- Pagination (5 files per page)
- View file details in modal
- Toast alerts for newly scanned files




## Getting Started


Deployment (Already Hosted)
Frontend: Deployed via Netlify from GitHub or built folder
Backend: Deployed via Render with MongoDB Atlas URI hardcoded in server.js


How Malware Scanning Works
When a file is uploaded, its metadata is stored with status pending.

A background worker simulates scanning using setTimeout() (2–5 seconds).

If any malicious keywords (e.g., rm -rf, eval, bitcoin) are found in the file, it's marked as infected. Otherwise, it's marked clean.

The MongoDB document is updated with the result and timestamp.

















