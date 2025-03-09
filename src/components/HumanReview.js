import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Form, Alert, Tabs, Tab, Badge, Spinner } from 'react-bootstrap';

const HumanReview = () => {
  const [documents, setDocuments] = useState([]);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    // This would be replaced with an actual API call
    const fetchDocumentsForReview = () => {
      // Simulate API call
      setTimeout(() => {
        try {
          // Mock data
          const mockDocuments = [
            {
              id: '1',
              name: 'Invoice-123.pdf',
              type: 'invoice',
              uploadedAt: '2023-08-14T10:15:00Z',
              imageUrl: 'https://example.com/sample-invoice.jpg',
              aiAnalysis: {
                confidence: 0.65,
                extractedData: {
                  invoiceNumber: 'INV-12345',
                  date: '2023-08-01',
                  amount: '$1,234.56',
                  vendor: 'ABC Company',
                  uncertain: ['amount', 'vendor']
                }
              }
            },
            {
              id: '2',
              name: 'Contract-456.pdf',
              type: 'contract',
              uploadedAt: '2023-08-14T09:30:00Z',
              imageUrl: 'https://example.com/sample-contract.jpg',
              aiAnalysis: {
                confidence: 0.52,
                extractedData: {
                  contractType: 'Service Agreement',
                  effectiveDate: '2023-09-01',
                  parties: ['XYZ Corp', 'Unknown Party'],
                  value: '$50,000',
                  uncertain: ['parties', 'value']
                }
              }
            },
            {
              id: '3',
              name: 'Medical-789.jpg',
              type: 'medical',
              uploadedAt: '2023-08-14T08:45:00Z',
              imageUrl: 'https://example.com/sample-medical.jpg',
              aiAnalysis: {
                confidence: 0.58,
                extractedData: {
                  patientName: 'John Doe',
                  patientID: 'P-78901',
                  date: '2023-07-15',
                  diagnosis: 'Unclear',
                  uncertain: ['diagnosis']
                }
              }
            },
            {
              id: '4',
              name: 'Receipt-101.jpg',
              type: 'receipt',
              uploadedAt: '2023-08-13T16:20:00Z',
              imageUrl: 'https://example.com/sample-receipt.jpg',
              aiAnalysis: {
                confidence: 0.61,
                extractedData: {
                  merchant: 'Retail Store',
                  date: '2023-08-10',
                  items: [
                    { name: 'Item 1', price: '$10.99' },
                    { name: 'Unknown Item', price: '?' }
                  ],
                  total: '$45.67',
                  uncertain: ['items', 'total']
                }
              }
            },
            {
              id: '5',
              name: 'ID-Document-202.jpg',
              type: 'identification',
              uploadedAt: '2023-08-13T14:30:00Z',
              imageUrl: 'https://example.com/sample-id.jpg',
              aiAnalysis: {
                confidence: 0.63,
                extractedData: {
                  documentType: 'Driver License',
                  name: 'Jane Smith',
                  idNumber: '???????',
                  expirationDate: '2025-10-31',
                  uncertain: ['idNumber']
                }
              }
            }
          ];
          
          setDocuments(mockDocuments);
          setLoading(false);
        } catch (err) {
          setError('Failed to load documents for review');
          setLoading(false);
        }
      }, 1000);
    };

    fetchDocumentsForReview();
  }, []);

  const handleApprove = () => {
    // In a real app, you would send an API request to approve the document
    const updatedDocuments = [...documents];
    updatedDocuments[currentDocumentIndex] = {
      ...updatedDocuments[currentDocumentIndex],
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      reviewNotes: reviewNotes
    };

    setDocuments(updatedDocuments);
    setReviewNotes('');
    moveToNextDocument();
  };

  const handleReject = () => {
    // In a real app, you would send an API request to reject the document
    const updatedDocuments = [...documents];
    updatedDocuments[currentDocumentIndex] = {
      ...updatedDocuments[currentDocumentIndex],
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewNotes: reviewNotes
    };

    setDocuments(updatedDocuments);
    setReviewNotes('');
    moveToNextDocument();
  };

  const moveToNextDocument = () => {
    const pendingDocs = documents.filter(doc => !doc.status);
    if (pendingDocs.length > 0) {
      const nextIndex = documents.findIndex(doc => !doc.status);
      setCurrentDocumentIndex(nextIndex);
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
      <p className="mt-3">Loading documents for review...</p>
    </div>
  );

  if (error) return <Alert variant="danger">{error}</Alert>;

  const pendingDocuments = documents.filter(doc => !doc.status);
  const reviewedDocuments = documents.filter(doc => doc.status);
  
  const currentDocument = documents[currentDocumentIndex];
  
  return (
    <>
      <h2 className="mb-4">Human Review Queue</h2>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab 
          eventKey="pending" 
          title={
            <span>
              Pending Review
              {pendingDocuments.length > 0 && (
                <Badge bg="warning" text="dark" pill className="ms-2">
                  {pendingDocuments.length}
                </Badge>
              )}
            </span>
          }
        >
          {pendingDocuments.length === 0 ? (
            <Alert variant="success">
              <Alert.Heading>All caught up!</Alert.Heading>
              <p>There are no documents waiting for human review at the moment.</p>
            </Alert>
          ) : (
            <div>
              <p>
                <strong>{pendingDocuments.length}</strong> documents requiring human review. 
                Documents are presented in order of upload date.
              </p>

              <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span>
                    <strong>{currentDocument.name}</strong> (Uploaded {formatDate(currentDocument.uploadedAt)})
                  </span>
                  <span className="status-badge status-review">
                    Needs Review
                  </span>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <div className="review-image-container">
                        {/* In a real app, this would show the actual document image */}
                                    <div className="p-5 text-center bg-light">
                                      <p className="mb-2 text-dark">[Document Image Preview]</p>
                                      <p className="text-dark small">
                                      (In a real implementation, this would display the actual document image)
                                      </p>
                                    </div>
                                    </div>
                                  </Col>
                                  <Col md={6}>
                                    <h5 className="text-white">AI Analysis Results</h5>
                                    <p>
                                    <span className="text-muted">Confidence Score:</span> 
                                    <span className={currentDocument.aiAnalysis.confidence < 0.7 ? 'text-warning' : 'text-success'}>
                                      {(currentDocument.aiAnalysis.confidence * 100).toFixed(1)}%
                                    </span>
                                    </p>
                                    
                                    <h6 className="text-white">Extracted Information:</h6>
                                    <div className="bg-dark p-3 mb-3 rounded">
                                    {Object.entries(currentDocument.aiAnalysis.extractedData).map(([key, value]) => {
                          if (key === 'uncertain') return null;
                          
                          const isUncertain = currentDocument.aiAnalysis.extractedData.uncertain.includes(key);
                          
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
                      </div>

                      <Form.Group className="mb-3">
                        <Form.Label>Review Notes</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={3}
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          placeholder="Add any notes or corrections here..."
                        />
                      </Form.Group>

                      <div className="d-flex gap-2 justify-content-end">
                        <Button 
                          variant="danger" 
                          onClick={handleReject}
                          className="d-flex align-items-center"
                        >
                          <i className="bi bi-x-circle me-2"></i> Reject
                        </Button>
                        <Button 
                          variant="success" 
                          onClick={handleApprove}
                          className="d-flex align-items-center"
                        >
                          <i className="bi bi-check-circle me-2"></i> Approve
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted">
                    Reviewing document {currentDocumentIndex + 1} of {documents.length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Tab>
        <Tab 
          eventKey="reviewed" 
          title={
            <span>
              Reviewed Documents
              {reviewedDocuments.length > 0 && (
                <Badge bg="secondary" pill className="ms-2">
                  {reviewedDocuments.length}
                </Badge>
              )}
            </span>
          }
        >
          {reviewedDocuments.length === 0 ? (
            <Alert variant="info">
              <p>No documents have been reviewed yet.</p>
            </Alert>
          ) : (
            <div>
              <p>
                <strong>{reviewedDocuments.length}</strong> documents have been reviewed.
              </p>
              
              <Row xs={1} md={2} className="g-4">
                {reviewedDocuments.map((doc, index) => (
                  <Col key={doc.id}>
                    <Card>
                      <Card.Header className="d-flex justify-content-between align-items-center">
                        <span>{doc.name}</span>
                        <span className={`status-badge status-${doc.status}`}>
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </span>
                      </Card.Header>
                      <Card.Body>
                        <p><strong>Reviewed:</strong> {formatDate(doc.reviewedAt)}</p>
                        {doc.reviewNotes && (
                          <div>
                            <p><strong>Notes:</strong></p>
                            <p className="bg-dark p-2 rounded">{doc.reviewNotes}</p>
                          </div>
                        )}
                        <div className="d-flex justify-content-end">
                          <Button variant="outline-primary" size="sm">View Details</Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Tab>
      </Tabs>
    </>
  );
};

export default HumanReview;