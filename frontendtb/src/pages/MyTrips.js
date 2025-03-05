import React, { useEffect, useState } from "react";
import { Button, Container, Table, Alert, Modal, Row, ModalTitle, ModalHeader, ModalBody, Spinner, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getError } from "../utils/getError";
import { hideLoading, showLoading } from "../features/loadingSlice";
import api from "../utils/axios";
import { FaTrash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

function TripRequests() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.user);
  const {isLoading} = useSelector((state)=>state.loading)
  const [trips, setTrips] = useState([]);
  const [message, setMessage] = useState(null);
   const [open,setOpen] = useState(false);
   const [id,setId] = useState(null);

   const handleClose = ()=>{
    setOpen(false)
    setId(null)
   }

  const getMyTrips = async () => {
    try {
      dispatch(showLoading());
      const response = await api.get("/trips/get-my-trips", {
        headers: { Authorization: ` ${token}` },
      });
      setTrips(response?.data?.trips || []);
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      setMessage({ type: "danger", text: getError(error) });
    }
  };

  useEffect(() => {
    if (token) {
      getMyTrips();
    }
  }, [token]);


  const handleAccept = async (tripId, requestId) => {
    try {
      dispatch(showLoading());
      await api.patch(
        `/trips/${tripId}/requests/${requestId}`,
        {status:"accepted"},
        { headers: { Authorization: `${token}` } }
      );
      setMessage({ type: "success", text: "Request accepted!" });
      getMyTrips(); 
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      setMessage({ type: "danger", text: getError(error) });
    }
  };

  const handleReject = async (tripId,requestId) => {
    try {
      dispatch(showLoading());
      await api.patch(
        `/trips/${tripId}/requests/${requestId}`,
        {status:"rejected"},
        { headers: { Authorization: ` ${token}` } }
      );
      setMessage({ type: "success", text: "Request rejected!" });
      getMyTrips(); 
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      setMessage({ type: "danger", text: getError(error) });
    }
  };
  const handleDelete = async () => {
    try {
      dispatch(showLoading());
      await api.delete(
        `/trips/${id}`,
        { headers: { Authorization: ` ${token}` } }
      );
      setMessage({ type: "success", text: "Trip deleted!" });
      getMyTrips(); 
      handleClose();
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      setMessage({ type: "danger", text: getError(error) });
    }
  };

  return (
    <Container className="mt-4">
        <Row>
            <Col>
      <h2 className="text-white">Manage Trip Requests</h2>
            </Col>
            <Col className="text-end"
            >
             <Button onClick={() => navigate("/trips/create-trip")} variant="primary">
                        Create Trip
                      </Button>
            </Col>
        </Row>


      {message && <Alert variant={message.type}>{message.text}</Alert>}

      {trips?.length > 0 ? (
        trips?.map((trip) => (
            <div className="border border-2 mb-4 rounded glass p-3 ">
                <div className="d-flex justify-content-between">
            <h4 className="text-white ">Trip name: {trip?.title}</h4>
            <Button variant="transparent" onClick={()=>{
                setId(trip?._id)
                setOpen(true)
                
            }}>
                <FaTrash color="red"/>
            </Button>
            </div>
            <h6 className="text-white">Slots: {trip?.participants?.length}/{trip?.slots}</h6>
            <h6 className="text-white text-capitalize " >Status: <span className="px-2 rounded-pill" style={{background:`${trip?.status == 'closed'?'red':'green'}`}}>{trip?.status}</span></h6>
          <div key={trip?._id} className="mb-4">
            <h4 className="text-white">Requests</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trip?.requests?.length > 0 ? (
                  trip.requests.map((reqUser, index) => (
                    <tr key={reqUser._id}>
                      <td>{index + 1}</td>
                      <td>{reqUser?.user?.firstname} {reqUser?.user?.lastname}</td>
                      <td>{reqUser?.user?.email}</td>
                      <td>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleAccept(trip?._id, reqUser?._id)}
                        >
                          Accept
                        </Button>{" "}
                        {/* <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleReject(trip?._id, reqUser?._id)}
                        >
                          Reject
                        </Button> */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No requests for this trip.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          
            <div>
              <h5 className="text-white">Participants</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Sr.no</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Chat</th>
                    <th>User Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {trip?.participants?.length > 0 ? trip?.participants?.map((user,index) => (
                    <tr key={user._id}>
                        <td>{index+1}</td>
                      <td>{user?.firstname} {user?.lastname}</td>
                      <td>{user?.email}</td>
                      <td>
                        <Link to={"/chat/" + user?._id}>
                          <button className="btn btn-primary">Chat</button>
                        </Link>
                      </td>
                      <td>
                        <Link to={"/user-profile/" + user?._id}>
                        <button className="btn btn-info">View Profile</button>
                        </Link>
                      </td>
                    </tr>
                  ))
                :
                <tr>
                <td colSpan="3" className="text-center">
                  No requests for this trip.
                </td>
              </tr>
                }
                </tbody>
              </Table>
            </div>
          
          </div>
        ))
      ) : (
        <Alert variant="info">You have not created any trips yet.</Alert>
      )}

        <Modal show={open} onHide={handleClose} >
            <ModalHeader className="p-2 border-0" closeButton>
                
            </ModalHeader>
            <ModalBody >
            <h5>Are you sure you want to delete this trip?</h5>
             <p>This can't be undone.</p>   

            <div className="d-flex gap-3 ">
                <Button variant="primary" onClick={handleClose}
                disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    {isLoading?
                <Spinner size="sm"/>
                :    
                    "Confirm"
                    }
                </Button>
            </div>
            </ModalBody>
        </Modal>

    </Container>
  );
}

export default TripRequests;
