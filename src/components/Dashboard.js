import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, ProgressBar, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDocuments: 0,
    completedAnalysis: 0,
    pendingReview: 0,
    approved: 0,
    rejected: 0
  });
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This would be replaced with an actual API call
    const fetchDashboardData = () => {
      // Simulate API call
      setTimeout(() => {
        try {
          // Mock data
          setStats({
            totalDocuments: 1250,
            completedAnalysis: 950,
            pendingReview: 87,
            approved: 800,
            rejected: 63
          });
          
          setRecentDocuments([
            { id: '1', name: 'Invoice-123.pdf', status: 'approved', uploadedAt: '2023-08-15', confidence: 0.98 },
            { id: '2', name: 'Contract-456.pdf', status: 'review', uploadedAt: '2023-08-14', confidence: 0.65 },
            { id: '3', name: 'Report-789.docx', status: 'analyzing', uploadedAt: '2023-08-14', confidence: null },
            { id: '4', name: 'Statement-101.pdf', status: 'rejected', uploadedAt: '2023-08-13', confidence: 0.45 },
            { id: '5', name: 'License-202.pdf', status: 'approved', uploadedAt: '2023-08-12', confidence: 0.95 }
          ]);
          
          setLoading(false);
        } catch (err) {
          setError('Failed to load dashboard data');
          setLoading(false);
        }
      }, 1000);
    };

    fetchDashboardData();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved': return 'status-badge status-approved';
      case 'rejected': return 'status-badge status-rejected';
      case 'review': return 'status-badge status-review';
      case 'analyzing': return 'status-badge status-analyzing';
      default: return 'status-badge status-pending';
    }
  };

  if (loading) return <div className="text-center mt-5">Loading dashboard data...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  const completionPercentage = Math.round((stats.completedAnalysis / stats.totalDocuments) * 100) || 0;

  return (
    <>
      <h2 className="mb-4">Document Processing Dashboard</h2>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Total Documents</Card.Title>
              <Card.Text className="display-4">{stats.totalDocuments.toLocaleString()}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>AI Analyzed</Card.Title>
              <Card.Text className="display-4">{stats.completedAnalysis.toLocaleString()}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Pending Review</Card.Title>
              <Card.Text className="display-4 text-warning">{stats.pendingReview.toLocaleString()}</Card.Text>
              <Link to="/review" className="btn btn-sm btn-warning">Review Documents</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Processing Rate</Card.Title>
              <ProgressBar now={completionPercentage} label={`${completionPercentage}%`} />
              <div className="mt-2 small text-muted">
                {stats.approved.toLocaleString()} approved / {stats.rejected.toLocaleString()} rejected
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>Recent Documents</Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Status</th>
                <th>Upload Date</th>
                <th>Confidence Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentDocuments.map(doc => (
                <tr key={doc.id}>
                  <td>{doc.name}</td>
                  <td>
                    <span className={getStatusBadgeClass(doc.status)}>
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                  </td>
                  <td>{doc.uploadedAt}</td>
                  <td>
                    {doc.confidence !== null 
                      ? `${(doc.confidence * 100).toFixed(1)}%` 
                      : 'N/A'}
                  </td>
                  <td>
                    <Link to={`/document/${doc.id}`} className="btn btn-sm btn-primary">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default Dashboard;