import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getError } from "../utils/getError";
import { hideLoading, showLoading } from "../features/loadingSlice";
import api from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";

function TripPosts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.user); 

  const [trips, setTrips] = useState([]);
  const [message, setMessage] = useState(null);


  const getTrips = async () => {
    try {
      dispatch(showLoading());
      const response = await api.get("/api/trips/get-trips", {
        headers: {
          Authorization: `${token}`,
        },
      });

      setTrips(response?.data?.trips || []);
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      getError(error);
    }
  };

  useEffect(() => {
    if (token) {
      getTrips();
    }
  }, [token]);


  const sendJoinRequest = async (tripId) => {
    try {
      dispatch(showLoading());
      await api.post(
        `/api/trips/${tripId}/request`,
        {},
        {
          headers: { Authorization: ` ${token}` },
        }
      );

      setMessage({ type: "success", text: "Join request sent successfully!" });
      getTrips(); 
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      setMessage({ type: "danger", text: getError(error) });
    }
  };


  const getButtonStatus = (trip) => {
    
    if (trip?.participants?.some((p) => p === user?._id)) {
      return { text: "Already Joined", disabled: true, variant: "secondary" };
    }
    if (trip?.requests?.some((r) => r?.user === user?._id)) {
      return { text: "Request Pending", disabled: true, variant: "warning" };
    }
    if(trip?.participants?.length === trip?.slots){
      return { text: "Slots Full", disabled: true, variant: "secondary" };
    }
    return { text: "Join Trip", disabled: false, variant: "success" };
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col className="d-flex justify-content-between align-items-center">
          <h2 className="text-white">Available Trips</h2>
          {/* <Button onClick={() => navigate("/trips/create-trip")} variant="primary">
            Create Trip
          </Button> */}
        </Col>
      </Row>

      {/* Success/Error Message */}
      {message && <Alert variant={message.type}>{message.text}</Alert>}

      {/* Trips Table */}
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Date & Time</th>
            <th>Location</th>
            <th>Slots <br/><span>(booked/total)</span></th>
            <th>Actions</th>
            <th>Chat</th>
            <th>Traveller Profile</th>
          </tr>
        </thead>
        <tbody>
          {trips?.length > 0 ? (
            trips?.map((trip, index) => {
              const { text, disabled, variant } = getButtonStatus(trip);
              return (
                <tr key={trip._id}>
                  <td>{index + 1}</td>
                  <td>{trip.title}</td>
                  <td>{trip.description}</td>
                  <td>{new Date(trip.when).toLocaleString()}</td>
                  <td>{trip.where?.coordinates?.join(", ") || "N/A"}</td>
                  <td>{trip?.participants?.length}/{trip?.slots}</td>
                  <td>
                    <Button
                      variant={variant}
                      size="sm"
                      disabled={disabled}
                      onClick={() => sendJoinRequest(trip._id)}
                    >
                      {text}
                    </Button>
                  </td>
                  <td>
                  <Link to={"/chat/" + trip?.createdBy?._id}>
                    <button className="btn btn-primary">Chat</button>
                  </Link>
                  </td>
                  <td>
                    <Link to={"/traveller-profile/" + trip?.createdBy?._id}>
                      <button className="btn btn-info">View Profile</button>
                    </Link>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No trips available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default TripPosts;
