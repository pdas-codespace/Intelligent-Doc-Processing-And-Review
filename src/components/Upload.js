import React, { useState, useRef } from 'react';
import { Card, Button, Form, ProgressBar, Alert, Row, Col } from 'react-bootstrap';

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef();

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    // Filter for only document types
    const validFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/tiff', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    const validFiles = newFiles.filter(file => validFileTypes.includes(file.type));
    
    if (validFiles.length !== newFiles.length) {
      setMessage({
        type: 'warning',
        text: 'Some files were skipped. Only PDF, Word documents, and images are supported.'
      });
    }

    // Create preview URLs for the files
    const newFilesWithPreviews = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type
    }));

    setFiles([...files, ...newFilesWithPreviews]);
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      setMessage({
        type: 'warning',
        text: 'Please select at least one file to upload.'
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload process with progress
    const totalFiles = files.length;
    let completedFiles = 0;

    // In a real app, you would use FormData and send files to your backend
    for (let i = 0; i < totalFiles; i++) {
      await new Promise(resolve => {
        // Simulate API call with delay
        setTimeout(() => {
          completedFiles++;
          setUploadProgress(Math.round((completedFiles / totalFiles) * 100));
          resolve();
        }, 500);
      });
    }

    // Simulate upload completion
    setTimeout(() => {
      setIsUploading(false);
      setMessage({
        type: 'success',
        text: `${totalFiles} document${totalFiles > 1 ? 's' : ''} uploaded successfully and queued for AI analysis.`
      });
      setFiles([]);
    }, 500);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <h2 className="mb-4">Upload Documents for Analysis</h2>

      {message && (
        <Alert 
          variant={message.type} 
          dismissible 
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Body>
          <div 
            className={`drop-zone ${isDragging ? 'active' : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <div>
              <i className="bi bi-cloud-arrow-up fs-1"></i>
              <h4>Drag and drop files here</h4>
              <p>or click to browse</p>
              <p className="text-muted small">Supported formats: PDF, Word, JPEG, PNG, TIFF</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileInput} 
              style={{ display: 'none' }}
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.tiff"
            />
          </div>

          {isUploading && (
            <div className="mt-3">
              <ProgressBar 
                now={uploadProgress} 
                label={`${uploadProgress}%`} 
                animated 
              />
              <div className="mt-2 text-center">
                Uploading documents... Please wait.
              </div>
            </div>
          )}

          {files.length > 0 && (
            <div className="mt-4">
              <h5>Selected Documents ({files.length})</h5>
              <Row className="g-3">
                {files.map((file, index) => (
                  <Col md={6} lg={4} key={index}>
                    <Card className="document-card h-100">
                      <Card.Body>
                        <div className="d-flex justify-content-between">
                          <div className="flex-grow-1">
                            {file.type.startsWith('image/') && (
                              <img 
                                src={file.preview} 
                                alt={file.name} 
                                className="document-preview mb-2" 
                              />
                            )}
                            {!file.type.startsWith('image/') && (
                              <div className="document-preview mb-2 d-flex align-items-center justify-content-center bg-light">
                                <i className="bi bi-file-earmark-text fs-1"></i>
                              </div>
                            )}
                            <h6 className="text-truncate">{file.name}</h6>
                            <div className="small text-muted">
                              {formatFileSize(file.size)}
                            </div>
                          </div>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            className="ms-2"
                            onClick={() => removeFile(index)}
                          >
                            &times;
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          <div className="d-flex justify-content-end mt-4">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={uploadFiles} 
              disabled={isUploading || files.length === 0}
            >
              {isUploading ? 'Uploading...' : 'Upload for Analysis'}
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>What happens after upload?</Card.Header>
        <Card.Body>
          <ol>
            <li>
              <strong>AI Analysis:</strong> All uploaded documents are processed by GPT vision models 
              to extract information and categorize the content.
            </li>
            <li>
              <strong>Confidence Scoring:</strong> Each document receives a confidence score based on 
              the AI's ability to analyze it correctly.
            </li>
            <li>
              <strong>Automatic Processing:</strong> Documents with high confidence scores are 
              automatically processed and approved.
            </li>
            <li>
              <strong>Human Review Queue:</strong> Documents that cannot be analyzed with high 
              confidence are sent to the human review queue.
            </li>
            <li>
              <strong>Notification:</strong> You'll be notified when documents require your review.
            </li>
          </ol>
        </Card.Body>
      </Card>
    </>
  );
};

export default Upload;