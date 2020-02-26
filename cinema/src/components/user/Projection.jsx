import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

class Projection extends Component {
  constructor(props) {
    super(props);
    this.state = {
        movies: []
    };
  }

  componentDidMount() {
  }
  
  getRoundedRating(rating) {
      const result = Math.round(rating);
      return <span className="float-right">Rating: {result}/10</span>
  }

  navigateToProjectionDetails() {
    this.props.history.push('projectiondetails/getMovie')
  }

  getProjections() {
    const projectionTimes = ['11:45', '12:25', '14:52', '17:30', '12:25', '14:52', '17:30', '12:25', '14:52', '17:30', '12:25', '14:52', '17:30', '12:25', '14:52', '17:30', '12:25', '14:52', '17:30'];
    return projectionTimes.map((time, index) => {
      return <Button key={index} onClick={() => this.navigateToProjectionDetails()} className="mr-1 mb-2">{time}</Button>
    })
  }
  render() {
      const rating = this.getRoundedRating(5.9);
      const projectionTimes = this.getProjections();
      return (
        <Container>
          <Row className="justify-content-center">
            <Col>
              <Card className="mt-5 card-width">
                <Card.Body>
                    <Card.Title><span className="card-title-font">Star Wars: Last jedi</span> {rating}</Card.Title>
                    <hr/>
                    <Card.Subtitle className="mb-2 text-muted">Year of production: 2012</Card.Subtitle>
                    <hr/>
                    <Card.Text>
                        <span className="mb-2 font-weight-bold">
                          Projection times: 
                        </span>
                    </Card.Text>
                        {projectionTimes}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      );
    }
}

export default withRouter(Projection);