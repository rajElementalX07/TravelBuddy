import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import api from "../utils/axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateTrip = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    when: "",
    where: { type: "Point", coordinates: [] }, 
    slots: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const {token} = useSelector((state)=>state.user)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); 
    return now.toISOString().slice(0, 16);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {

      const response = await api.post(
        "/api/trips/create-trip",
        formData,
        { headers: { Authorization: `${token}` } }
      );
      console.log(response);

      setMessage({ type: "success", text: "Trip created successfully!" });
      setFormData({ title: "", description: "", when: "",   where: { type: "Point", coordinates: [] } 
        , slots: "" });
        
        navigate('/mytrips')
    } catch (error) {
      setMessage({ type: "danger", text: "Failed to create trip. Please try again." });
    }

    setLoading(false);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={8} lg={6}>
          <h2 className="text-center mb-4">Create a New Trip</h2>
          {message && <Alert variant={message.type}>{message.text}</Alert>}

          <Form onSubmit={handleSubmit} className="p-4 shadow rounded bg-light">

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter trip title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe your trip"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>When</Form.Label>
              <Form.Control
                type="datetime-local"
                name="when"
                value={formData.when}
                onChange={handleChange}
                min={getMinDateTime()}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Where</Form.Label>
              <ReactGoogleAutocomplete
                
                apiKey="AIzaSyDBOVm6aEh2ANPna0JwaC8FRl9pYMeAMA0"
                onPlaceSelected={(place) => {
                  if (place.geometry) {
                    const lat = place.geometry.location.lat();
                    const lng = place.geometry.location.lng();
                    // setFormData({ ...formData, where: { type: "Point", coordinates: [lng, lat] } });
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      where: { type: "Point", coordinates: [lng, lat] }
                    }));
                  }
                }}
                options={{ types: ["geocode"] }}
                className="form-control"
                placeholder="Enter a location"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Slots Available</Form.Label>
              <Form.Control
                type="number"
                min="1"
                name="slots"
                value={formData.slots}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="text-center">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? <Spinner as="span" animation="border" size="sm" /> : "Create Trip"}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateTrip;
