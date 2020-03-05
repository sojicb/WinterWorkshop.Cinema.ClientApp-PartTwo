import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';
import { Container, Row, Col, Card } from 'react-bootstrap';

class ProjectionDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
        title: '',
        rating: '',
        yearOfProduction: '',
        timeOfProjection: [],
        movies: []
    };

    this.getProjection = this.getProjection.bind(this);
  }

  componentDidMount() {
    //this.getMovie();
    const { id } = this.props.match.params; 
    this.getProjection(id);

  }

  /*getMovie(){
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
  }*/
  getProjection(id) {
    console.log(id);
    // TO DO: here you need to fetch movie with projection details using ID from router
    const requestOptions = {
      method: 'GET',
      headers: {'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
    };
    this.setState({isLoading: true});
    fetch(`${serviceConfig.baseURL}/api/movies/${id}`, requestOptions)
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
          this.setState({ submitted: false });
          NotificationManager.error(response.message || response.statusText);
      });
  }
  
  renderRows(rows, seats) {
    const rowsRendered = [];
    for (let i = 0; i < rows; i++) {
        rowsRendered.push( <tr key={i}>
            {this.renderSeats(seats, i)}
        </tr>);
    }
    return rowsRendered;
  }

  renderSeats(seats, row) {
      let renderedSeats = [];
      for (let i = 0; i < seats; i++) {
          renderedSeats.push(<td key={'row: ' + row + ', seat: ' + i}></td>);
      }
      return renderedSeats;
  }

  fillCardWithInformations(movie) {
      return <Card className="mt-5 card-width">
      <Card.Body>
    <Card.Title><span className="card-title-font">{movie}</span> <span className="float-right">Rating: {Math.round(movie)}/10</span></Card.Title>
          <hr/>
          <Card.Subtitle className="mb-2 text-muted">Year of production: {movie} <span className="float-right">Time of projection: {movie} </span></Card.Subtitle>
          <hr/>
        <Card.Text>
        <Row className="mt-2">
          <Col className="justify-content-center align-content-center">
              <h4>Chose your seat(s)</h4>
              <div>
              <Row className="justify-content-center mb-4">
                  <div className="text-center text-white font-weight-bold cinema-screen">
                      CINEMA SCREEN
                  </div>
              </Row>
              <Row className="justify-content-center">
                  <table className="table-cinema-auditorium">
                  <tbody>
                  {this.renderRows(5, 26)}
                  </tbody>
                  </table>
              </Row>
              </div>
          </Col>
        </Row>
        <hr/>
        </Card.Text>
        <Row className="justify-content-center font-weight-bold">
          Price for reserved seats:  800 RSD
        </Row>
      </Card.Body>
    </Card>
  }

  render() {
      return (
        <Container>
          <Row className="justify-content-center">
            <Col>
              {this.fillCardWithInformations()}
            </Col>
          </Row>
        </Container>
      );
    }
}

export default ProjectionDetails;