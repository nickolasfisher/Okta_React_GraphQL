import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import Header from '../Components/Header'
import { Container, Row, Col, Card } from 'react-bootstrap'


import { useOktaAuth } from '@okta/okta-react';

const Home = () => {

  const { authState } = useOktaAuth();

  return (authState.isAuthenticated ?
    <Redirect to={{ pathname: '/ExchangeRates' }} /> :

    <Container>

      <Header></Header>

      <Row>

        <Col sm={12} className="text-center">
          <h3>Let's Escape</h3>
          <h4>Connect.  Exchange.  Move.</h4>

          <h5>A React Demo Use Okta and GraphGL</h5>
          <h5><a href="https://www.everbase.co/editor">GraphQL Data Available here</a></h5>
        </Col>
      </Row>

      <br></br>

      <Row >
        <Col sm={12} className="text-center">
          <Card style={{ width: '21.5em', margin: '0 auto' }}>
            <Card.Header>
              Already have an Okta Account?
              </Card.Header>
            <Card.Body>
              <Link to='/ExchangeRates'>Login Here</Link>
            </Card.Body>
          </Card>

        </Col>

      </Row>


    </Container>
  );
};
export default Home;