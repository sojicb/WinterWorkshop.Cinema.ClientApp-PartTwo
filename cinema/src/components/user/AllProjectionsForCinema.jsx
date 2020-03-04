import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';
import Projection from './Projection';
import { withRouter } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';



class AllProjectionsForCinema extends Component {
    constructor(props) {
      super(props);
      this.state = {
          movies: [],
          movie: '', 
          title: ''
      };
      this.getProjections = this.getProjections.bind(this);
      this.getProjectionsById = this.getProjectionsById.bind(this);


    }

    componentDidMount() {
       this.getProjections();
       this.getProjectionsById();
    }

    getProjections() {
      const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
      };
  
      this.setState({isLoading: true});
      fetch(`${serviceConfig.baseURL}/api/Movies/futureProjections`, requestOptions)
        .then(response => {
          if (!response.ok) {
            return Promise.reject(response);
        }
        return response.json();
        })
        .then(data => {
          if (data) {
            this.setState({ movies: data, isLoading: false });
            }
        })
        .catch(response => {
            this.setState({isLoading: false});
            NotificationManager.error(response.message || response.statusText);
            this.setState({ submitted: false });
        });
    }

    getProjectionsById(id) {

      const { movies} = this.state;
      
      if(!id) {
        return;
      }

      const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
      };
      this.setState({isLoading: true});
      fetch(`${serviceConfig.baseURL}/api/Movies/${movies[0].id}`, requestOptions)
        .then(response => {
          if (!response.ok) {
            return Promise.reject(response);
        }
        return response.json();
        })
        .then(data => {
          if (data) {
            this.setState({ movie: data, isLoading: false });
            }
        })
        .catch(response => {
            this.setState({isLoading: false});
            NotificationManager.error(response.message || response.statusText);
            this.setState({ submitted: false });
        });
  
      const projectionTimes = ['11:45', '12:25', '14:52', '17:30', '12:25', '14:52', '17:30', '12:25', '14:52', '17:30', '12:25', '14:52', '17:30', '12:25', '14:52', '17:30', '12:25', '14:52', '17:30'];
      return projectionTimes.map((time, index) => {
        return <Button key={index} onClick={() => this.navigateToProjectionDetails()} className="mr-1 mb-2">{time}</Button>
      })
    }
    
    getRoundedRating(rating) {
        const result = Math.round(rating);
        return <span className="float-right">Rating: {result}/10</span>
    }
  
    /*navigateToProjectionDetails() {
      this.props.history.push('projectiondetails/getMovie')
    }*/
    

    render() {
      const {title, projectionTimes, movie} = this.state;
      const rating = this.getRoundedRating(9);
      console.log(movie);
        return (
          <div className="no-gutters">
            <Container>
          <Row className="justify-content-center">
            <Col>
              <Card className="mt-5 card-width">
                <Card.Body>
                <Card.Title>
                   <span className="card-title-font">{movie.title}</span> {rating}</Card.Title>
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
          </div>
        );
      }
}

export default AllProjectionsForCinema;