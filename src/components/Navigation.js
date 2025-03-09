import React from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  // This would typically come from an API call or context
  const pendingReviewCount = 5;

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/">Document Analysis System</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">Dashboard</Nav.Link>
            <Nav.Link as={NavLink} to="/upload">Upload Documents</Nav.Link>
            <Nav.Link as={NavLink} to="/review">
              Human Review
              {pendingReviewCount > 0 && (
                <Badge bg="warning" text="dark" pill className="ms-2">
                  {pendingReviewCount}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;