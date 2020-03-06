import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';
import { Container, Row, Col, Card , Button } from 'react-bootstrap';

class ProjectionDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
        title: '',
        rating: '',
        yearOfProduction: '',
        timeOfProjection: [],
        movies: [],
        movie: '', 
        id: '',
        projection: '',
        auditoriumName: '',
        projectionTime: '',
        auditoriumId: '',
        seats: [],
        row: [],
        number: []
    };

    this.getProjection = this.getProjection.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params; 
    this.getProjection(id);
    this.getAuditorium();

  }
  /*getProjection(id) {
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
          this.setState({ id: data.id,
             title: data.title, 
             year: data.year, 
             rating: data.rating, isLoading: false });
          }
      })
      .catch(response => {
          this.setState({ submitted: false });
          NotificationManager.error(response.message || response.statusText);
      });
  }*/

  getProjection(id) {
    console.log(id);
    const requestOptions = {
      method: 'GET',
      headers: {'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
    };
    this.setState({isLoading: true});
    fetch(`${serviceConfig.baseURL}/api/projections/get/${id}`, requestOptions)
      .then(response => {
        if (!response.ok) {
          return Promise.reject(response);
      }
      return response.json();
      })
      .then(data => {
          if (data) {
          this.setState({ id: data.id,
             title: data.movieTitle,
             auditoriumName: data.aditoriumName,
             projectionTime: data.projectionTime,
             auditoriumId: data.auditoriumId, year: data.year, 
             rating: data.rating, isLoading: false });
          }
      })
      .catch(response => {
          this.setState({ submitted: false });
          NotificationManager.error(response.message || response.statusText);
      });
  }

  getAuditorium() {
    const auditoriumId = this.state;
    console.log(auditoriumId);
    // TO DO: here you need to fetch movie with projection details using ID from router
    const requestOptions = {
      method: 'GET',
      headers: {'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
    };
    this.setState({isLoading: true});
    fetch(`${serviceConfig.baseURL}/api/auditoriums/get/${auditoriumId}`, requestOptions)
      .then(response => {
        if (!response.ok) {
          return Promise.reject(response);
      }
      return response.json();
      })
      .then(data => {
          if (data) {
          this.setState({ auditId: data.id,
             seats: data.seatsList, isLoading: false });
          }
      })
      .catch(response => {
          this.setState({ submitted: false });
          NotificationManager.error(response.message || response.statusText);
      });
  }

  fillingRows() {
    return this.state.seats.map(seat => {
      return <li>
        {seat.row}
      </li>
    });
  }

  fillingNumbers() {
    return this.state.seats.map(seat => {
      return <li>
        {seat.number}
      </li>
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

  render() {
    const { title, auditoriumName, projectionTime, seats } = this.state;
    const seatRows = this.fillingRows();
    const seatNumbers = this.fillingNumbers();
      return (
        <Container>
          <Row className="justify-content-center">
            <Col>
            <Card className="mt-5 card-width">
      <Card.Body>
    <Card.Title><span className="card-title-font">{title}</span> <span className="float-right">Auditorium Name: {auditoriumName}</span></Card.Title>
          <hr/>
          <Card.Subtitle className="mb-2 text-muted">Projection Time: {projectionTime} </Card.Subtitle>
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
                  {this.renderRows(seatRows, seatNumbers)}
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
        <img className="img-responsive" src="https://source.unsplash.com/random" alt="logo" align="center" width="500" height="350" />
      </Card.Body>
    </Card>
            </Col>
          </Row>
        </Container>
      );
    }
}

export default ProjectionDetails;

//Time of projection: {projection} 