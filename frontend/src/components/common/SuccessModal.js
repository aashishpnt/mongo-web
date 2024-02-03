import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function SuccessModal({ show, onHide }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>User Registered Successfully</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Congratulations! Your registration was successful.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SuccessModal;
