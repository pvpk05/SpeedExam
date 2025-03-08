/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React from "react";
import { Button, Card, Container, Form, InputGroup, Row, Col } from "react-bootstrap";
import { Clipboard, Share } from "react-bootstrap-icons";

const ExamSummary = ({ examSummary, onBack }) => {

  const examDetails = [
    { label: "Exam Name", value: examSummary.examName },
    { label: "Questions", value: examSummary.questions },
    { label: "Duration", value: examSummary.duration },
    { label: "Negative Marks", value: examSummary.negativeMarks },
    { label: "Auto Submit", value: examSummary.autoSubmit },
    { label: "Exam Availability", value: examSummary.examAvailability },
    { label: "Count Down", value: examSummary.countDown },
    { label: "Domain Name", value: examSummary.domainName },
    { label: "Section", value: examSummary.section },
    { label: "EndDate Time", value: examSummary.endDateTime },
    { label: "StartDate Time", value: examSummary.startDateTime },
    { label: "Exam Type", value: examSummary.examType },
    { label: "Batches", value: examSummary.batches },
    { label: "Conducted On", value: examSummary.conductedOn },
  ]
  const handleCopy = () => {
    navigator.clipboard.writeText(examSummary.examLink);
    alert("Test link copied!");
  };

  return (
    <Container className="mt-3" style={{ maxWidth: "1000px", padding: "10px" }}>

      <Button variant="contained" color="primary" onClick={onBack} style={{ marginBottom: "20px" }}>
        Back
      </Button>
      {/* Combined Header & Test Link Section */}
      <Card className="text-center shadow-sm p-3 w-100" style={{ borderRadius: "10px" }}>
        <div
          className="mx-auto d-flex justify-content-center align-items-center"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#d4edda",
          }}
        >
          <div className="text-success" style={{ fontSize: "32px", fontWeight: "bold" }}>✔</div>
        </div>
        <h4 className="text-danger mt-2" style={{ fontSize: "18px" }}>Exam Summary</h4>

        {/* Test Link Section */}
        <h6 className="mt-3" style={{ fontSize: "14px" }}>Your Test Link</h6>
        <InputGroup className="mt-2">
          <Form.Control
            value={examSummary.examLink}
            readOnly
            style={{
              fontSize: "12px",
              backgroundColor: "#f8f9fa",
              height: "32px",
              borderRadius: "5px",
            }}
          />
          <Button
            variant="primary"
            onClick={handleCopy}
            style={{ padding: "6px 12px", fontSize: "14px" }}
          >
            <Clipboard size={16} />
          </Button>
        </InputGroup>
        <Button
          variant="primary"
          className="mt-2 w-100"
          style={{ fontSize: "14px", padding: "6px 10px", borderRadius: "5px" }}
        >
          <Share size={16} className="me-2" /> Share Test
        </Button>
      </Card>

      {/* Exam Details - 4 Column Layout */}
      <Card className="mt-3 p-3 shadow-sm w-100" style={{ borderRadius: "10px" }}>
        <h6 className="mb-3" style={{ fontSize: "16px" }}>Exam Details</h6>
        <Row>
          {examDetails.map((item, index) => (
            <Col md={3} sm={6} xs={12} key={index} className="mb-3">
              <div className="fw-bold" style={{ fontSize: "12px", color: "#555" }}>
                {item.label}
              </div>
              <Form.Control
                type="text"
                value={item.value}
                readOnly
                style={{
                  fontSize: "12px",
                  height: "30px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "5px",
                }}
              />
            </Col>
          ))}
        </Row>
      </Card>

      {/* Total Questions */}
      <div className="text-end mt-2 fw-bold fs-6 w-100" style={{ fontSize: "14px" }}>
        Total Questions: <span className="text-primary">{examSummary.questions}</span>
      </div>
    </Container>
  );
};

export default ExamSummary;
