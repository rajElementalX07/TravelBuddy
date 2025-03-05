import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import AuthCard from '../components/AuthCard'

function AuthPage() {

   // const bgImg = '/images/farmbg.jpg'

    const secStyle = {
       
      //  backgroundImage: `url(${bgImg})`,
       // backgroundSize: 'cover'
    }
    
  return (
    <section style={secStyle} className='custom-section'>
        <Container  >
            <Row  className='d-flex justify-content-center'>
                <Col md={5}>
                <AuthCard/>
                </Col>
            </Row>
        </Container>
    </section>
  )
}

export default AuthPage