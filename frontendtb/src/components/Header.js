import React from "react";
import {
  Button,
  Container,
  Dropdown,
  DropdownButton,
  Nav,
  Navbar,
} from "react-bootstrap";
import { FaUser } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import './Header.css'
import { logout } from "../features/logoutSlice";

function Header() {
  const navigate = useNavigate();
 const dispatch = useDispatch();
  const userToken = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  console.log(userToken);

  const userIcon = (
    <span>
      <FaUser />
    </span>
  );

   const handleLogout= () =>{
       dispatch(logout());
       navigate('/')
   }
  return (
    <Navbar className="bg-body-transparent " style={{ height: "60px",backdropFilter:'blur(20px)',background: "rgba( 255, 255, 255, 0.1 )",boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )", }}>
      <Container>
        <Navbar.Brand
          className="fw-bold fs-3"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          LOGO
        </Navbar.Brand>
        <Nav>
          <Nav.Link onClick={() => navigate("/")} className="fw-bold fs-5">
            Home
          </Nav.Link>
          {userToken && 
          <>
          { user?.role ==='traveller'?
            <Nav.Link onClick={() => navigate("/mytrips")} className="fw-bold fs-5">
            My Trips
           </Nav.Link>
          :

          <Nav.Link onClick={() => navigate("/trips")} className="fw-bold fs-5">
            Trips
          </Nav.Link>
          }
              </>
          }
        
          {/* <Nav.Link
            onClick={() => navigate("/pricing")}
            className="fw-bold fs-5"
          >
            Pricing
          </Nav.Link> */}
        </Nav>

         {userToken ? (
          <div>
          <DropdownButton variant="transparent"  id="dashboard-dropdown"  title={userIcon}>
            <Dropdown.ItemText className="fw-bold text-muted">{user?.firstname + " " +user?.lastname}</Dropdown.ItemText>
            {/* Update Profile Link */}
          <Dropdown.Item as={Link} to="/auth/update-profile" className="fw-bold">
            Update Profile
          </Dropdown.Item>
            <Dropdown.Item className="fw-bold " as="button" onClick={handleLogout}>Log Out</Dropdown.Item>
          </DropdownButton>
          </div>
        ) : (
          <Button
            variant="dark"
            onClick={() => navigate("/auth/user-login")}
            className="rounded-pill px-4 fw-bold"
          >
            Login
          </Button>
        )} 

        
      </Container>
    </Navbar>
  );
}

export default Header;
