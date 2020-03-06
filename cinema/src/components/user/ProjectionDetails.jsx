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
        numOfRows: [],
        seatsForReservation: []
    };

    this.getProjection = this.getProjection.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params; 
    this.getProjection(id);
    //this.getAuditorium();

  }

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
      .then(() => {
        this.getAuditorium();
      })
      .catch(response => {
          this.setState({ submitted: false });
          NotificationManager.error(response.message || response.statusText);
      });
  }

  getAuditorium() {
    let {auditoriumId} = this.state;
    console.log("Auditorium Id is: " + auditoriumId);

    if(!auditoriumId) {
			return;
		}  
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

  handleReservation(seatId) {
    const {seatsForReservation} = this.state;
    seatsForReservation.push(seatId);
    this.setState({seatsForReservation});
}

  maxRows() {
    const {seats} = this.state;
    let row;
    for(let i = 0; i < seats.length; i++){
       row = Math.max(seats[i].row);
    }
    return row;
  }

  maxSeatsPerRow() {
    const {seats} = this.state;
    let seat;
    for(let i = 0; i < seats.length; i++){
       seat = Math.max(seats[i].number);
    }
    return seat;
  } 
  
  // renderRows(rows, seats) {
  //   const rowsRendered = [];
  //   for (let i = 0; i < rows; i++) {
  //     console.log(seats[i]);
  //       rowsRendered.push( <tr key={i} >
  //           {this.renderSeats(seats, i)}
  //       </tr>);
  //   }
  //   return rowsRendered;
  // }

  // renderSeats(seats, row) {
  //     let renderedSeats = [];
  //     for (let i = 0; i < seats; i++) {
  //       console.log(seats[i]);
  //         renderedSeats.push(<td key={'row: ' + row + ', seat: ' + i}></td>);
  //     }
  //     return renderedSeats;
  // }

  renderRows(rows, seats, seatsPerRow) {
    const rowsRendered = [];
    for (let i = 1; i <= rows; i++) {
    //console.log(i);
    rowsRendered.push( <tr key={i} >
    {this.renderSeats(seats, i, seatsPerRow)}
    </tr>);
    }
    return rowsRendered;
    }

  renderSeats(seats, row, seatsPerRow) {
    let renderedSeats = [];
    for (let i = 0; i < seats.length; i++) {
      //console.log(row);
      if(seats[i].row === row){
        //console.log(seats[i]);
        renderedSeats.push(<td key={'row: ' + row + ', seat: ' + i} onClick={() => this.handleReservation(seats[i].id)}></td>);
      }
    }
    return renderedSeats;
    }

  render() {
    const { title, auditoriumName, projectionTime, seats, seatsForReservation } = this.state;
    const numOfSeatsPerRow = this.maxSeatsPerRow();
    const rows = this.maxRows();
    console.log(seatsForReservation);
      return (
        <Container>
          <Row className="justify-content-center">
            <Col>
            <Card className="mt-5 card-width">
      <Card.Body>
    <Card.Title><span className="card-title-font">{title}</span> <span className="float-right">Auditorium Name: {auditoriumName}</span></Card.Title>
          <hr/>
          <Card.Subtitle className="mb-2 text-muted">Time of Projection: {projectionTime} </Card.Subtitle>
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
                  {this.renderRows(rows , seats, numOfSeatsPerRow)}
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