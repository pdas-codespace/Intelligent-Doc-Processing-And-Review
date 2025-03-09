import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Row, Col, Button, Alert, Spinner, Badge, Table } from 'react-bootstrap';

const DocumentDetails = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This would be replaced with an actual API call
    const fetchDocumentDetails = () => {
      // Simulate API call
      setTimeout(() => {
        try {
          // Mock data based on the ID
          const mockDocument = {
            id,
            name: `Document-${id}.pdf`,
            type: ['1', '2', '5'].includes(id) ? 'invoice' : ['3'].includes(id) ? 'medical' : 'contract',
            status: ['1', '5'].includes(id) ? 'approved' : ['4'].includes(id) ? 'rejected' : ['2'].includes(id) ? 'review' : 'analyzing',
            uploadedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
            uploadedBy: 'John Smith',
            imageUrl: 'https://example.com/sample-document.jpg',
            aiAnalysis: {
              confidence: ['1', '5'].includes(id) ? 0.95 : ['4'].includes(id) ? 0.45 : 0.65,
              processingTime: `${Math.floor(Math.random() * 5) + 2} seconds`,
              extractedData: {
                documentType: ['1', '2', '5'].includes(id) ? 'Invoice' : ['3'].includes(id) ? 'Medical Record' : 'Contract',
                date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
                amount: ['1', '2', '5'].includes(id) ? `$${(Math.random() * 10000).toFixed(2)}` : null,
                parties: ['2'].includes(id) ? ['ABC Corp', 'XYZ LLC'] : null,
                uncertain: ['1', '5'].includes(id) ? [] : ['4'].includes(id) ? ['amount', 'date', 'documentType'] : ['amount']
              },
              visionModelVersion: 'GPT-4 Vision v2.1',
              fallbackReason: ['4'].includes(id) ? 'Low quality image, poor contrast' : null
            },
            reviewHistory: ['1', '4', '5'].includes(id) ? [
              {
                reviewer: 'Alice Johnson',
                action: ['1', '5'].includes(id) ? 'approved' : 'rejected',
                timestamp: new Date(Date.now() - Math.random() * 500000000).toISOString(),
                notes: ['1', '5'].includes(id) ? 'All information correctly extracted' : 'Document is illegible, request rescan'
              }
            ] : []
          };
          
          setDocument(mockDocument);
          setLoading(false);
        } catch (err) {
          setError(`Failed to load document details for ID: ${id}`);
          setLoading(false);
        }
      }, 1000);
    };

    fetchDocumentDetails();
  }, [id]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved': return 'status-badge status-approved';
      case 'rejected': return 'status-badge status-rejected';
      case 'review': return 'status-badge status-review';
      case 'analyzing': return 'status-badge status-analyzing';
      default: return 'status-badge status-pending';
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return (
    <div className="text-center my-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p className="mt-3">Loading document details...</p>
    </div>
  );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Document Details</h2>
        <div>
          <Button as={Link} to="/" variant="outline-secondary" className="me-2">Back to Dashboard</Button>
          {document.status === 'review' && (
            <Button as={Link} to="/review" variant="primary">Go to Review Queue</Button>
          )}
        </div>
      </div>

      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>
            <strong>{document.name}</strong> 
          </span>
          <span className={getStatusBadgeClass(document.status)}>
            {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
          </span>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <div className="review-image-container">
                {/* In a real app, this would show the actual document image */}
                <div className="p-5 text-center bg-light">
                  <p className="mb-2">[Document Image Preview]</p>
                  <p className="text-muted small">
                    (In a real implementation, this would display the actual document image)
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <h5>Document Information</h5>
                <Table bordered hover size="sm">
                  <tbody>
                    <tr>
                      <th>Document ID</th>
                      <td>{document.id}</td>
                    </tr>
                    <tr>
                      <th>File Name</th>
                      <td>{document.name}</td>
                    </tr>
                    <tr>
                      <th>Uploaded</th>
                      <td>{formatDate(document.uploadedAt)}</td>
                    </tr>
                    <tr>
                      <th>Uploaded By</th>
                      <td>{document.uploadedBy}</td>
                    </tr>
                    <tr>
                      <th>Document Type</th>
                      <td>{document.type.charAt(0).toUpperCase() + document.type.slice(1)}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>

            <Col md={6}>
              <h5>AI Analysis Results</h5>
              <div className="d-flex align-items-center mb-3">
                <div className="me-3">
                  <strong>Confidence Score:</strong> 
                </div>
                <div className="progress flex-grow-1" style={{ height: '25px' }}>
                  <div 
                    className={`progress-bar ${document.aiAnalysis.confidence < 0.7 ? 'bg-warning' : 'bg-success'}`}
                    role="progressbar" 
                    style={{ width: `${document.aiAnalysis.confidence * 100}%` }}
                    aria-valuenow={document.aiAnalysis.confidence * 100}
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  >
                    {(document.aiAnalysis.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="bg-light p-3 mb-4 rounded">
                <h6>Extracted Information:</h6>
                {Object.entries(document.aiAnalysis.extractedData).map(([key, value]) => {
                  if (key === 'uncertain') return null;
                  if (value === null) return null;
                  
                  const isUncertain = document.aiAnalysis.extractedData.uncertain?.includes(key);
                  
                  return (
                    <div key={key} className="mb-2">
                      <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> 
                      <span className={isUncertain ? 'text-warning' : ''}>
                        {' '}
                        {Array.isArray(value) ? value.join(', ') : value}
                        {isUncertain && (
                          <Badge bg="warning" text="dark" className="ms-2">Uncertain</Badge>
                        )}
                      </span>
                    </div>
                  );
                })}

                <div className="mt-2 small">
                  <strong>Processing Time:</strong> {document.aiAnalysis.processingTime}<br/>
                  <strong>Vision Model:</strong> {document.aiAnalysis.visionModelVersion}
                </div>

                {document.aiAnalysis.fallbackReason && (
                  <Alert variant="warning" className="mt-3">
                    <strong>Reason for Human Review:</strong> {document.aiAnalysis.fallbackReason}
                  </Alert>
                )}
              </div>

              {document.reviewHistory.length > 0 && (
                <div className="mt-3">
                  <h5>Review History</h5>
                  {document.reviewHistory.map((review, index) => (
                    <Card key={index} className="mb-2" border={review.action === 'approved' ? 'success' : 'danger'}>
                      <Card.Body>
                        <div className="d-flex justify-content-between">
                          <div>
                            <strong>{review.reviewer}</strong> {review.action} this document
                          </div>
                          <Badge bg={review.action === 'approved' ? 'success' : 'danger'}>
                            {review.action}
                          </Badge>
                        </div>
                        <div className="mt-2 small text-muted">
                          {formatDate(review.timestamp)}
                        </div>
                        {review.notes && (
                          <div className="mt-2">
                            <strong>Notes:</strong> {review.notes}
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default DocumentDetails;