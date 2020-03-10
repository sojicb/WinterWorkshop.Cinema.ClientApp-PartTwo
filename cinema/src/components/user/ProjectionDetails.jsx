import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';
import { Container, Row, Col, Card , Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair, faCouch, faAlignCenter } from '@fortawesome/free-solid-svg-icons';


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
        seatsForReservation: [],
        userId: '',
        projectionId: '',
        color: '',
        ticketPrice: 0,
        reservedSeats: ''
    };

    this.getProjection = this.getProjection.bind(this);
    this.insertingReservation = this.insertingReservation.bind(this);
    this.getReservedSeats = this.getReservedSeats.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params; 
    this.getProjection(id);
    this.getReservedSeats();

  }

  getProjection(id) {
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
      .then(() => {
        this.getReservedSeats();
      })
      .catch(response => {
          this.setState({ submitted: false });
          NotificationManager.error(response.message || response.statusText);
      });
  }

  getAuditorium() {
    let {auditoriumId} = this.state;
    
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
    seats: data.seatsList, isLoading: false }, () => {
        this.state.seats.forEach( seat => {
            seat.seatColor = 'yellow';
        });
    });
    
    }
    })
    .catch(response => {
    this.setState({ submitted: false });
    NotificationManager.error(response.message || response.statusText);
    });
  }
  
  getReservedSeats() {

      let {auditoriumId, reservedSeats, projectionTime} = this.state;
      
      if(!auditoriumId) {
      return;
      }
      
      const requestOptions = {
      method: 'GET',
      headers: {'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
      };
      this.setState({isLoading: true});
      fetch(`${serviceConfig.baseURL}/api/seats/reserved/?id=${auditoriumId}&projectiontime=${projectionTime}`, requestOptions)
      .then(response => {
      if (!response.ok) {
      return Promise.reject(response);
      }
      return response.json();
      })
      .then(data => {
      if (data) {
        console.log("Log123123: " + JSON.stringify(data));
        console.log('vec postojeca sedista: ', this.state.seats);
        data.forEach(seat => {
          console.log('seat Id is: ' + seat.id);
      })
      this.setState({
      reservedSeats: data, isLoading: false });
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

  handleReservation(seatId) {
  const {seats} = this.state;
  const seatTocolorIndex = seats.indexOf(seats.find(seat => seat.id === seatId));
  const seatTocolor = seats.find(seat => seat.id === seatId);
  seatTocolor.seatColor = 'black';
  seats[seatTocolorIndex] = seatTocolor;
  const {seatsForReservation} = this.state;
  seatsForReservation.push(seatId);
  this.setState({seatsForReservation, seats: seats});
  }

  handleSubmit(e) {
  e.preventDefault();

  this.setState({ submitted: true });
  const { seatsForReservation } = this.state;
  if (seatsForReservation) {
      this.insertingReservation();
  } else {
      NotificationManager.error('Please choose seats.');
      this.setState({ submitted: false });
   }
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
  renderRows(rows, seats, seatsPerRow) {
    const rowsRendered = [];
    for (let i = 1; i <= rows; i++) {
    rowsRendered.push(<tr key={i} >
    {this.renderSeats(seats, i, seatsPerRow)}
    </tr>);
    }
    return rowsRendered;
    }

  renderSeats(seats, row, seatsPerRow) {
      let renderedSeats = [];
      for (let i = 0; i < seats.length; i++) {
      if(seats[i].row === row){
      renderedSeats.push(<span className="fa-2x text-black"><td style={{backgroundColor: seats[i].seatColor}} key={'row: ' + row + ', seat: ' + i}
      onClick={() => this.handleReservation(seats[i].id)}>
      <FontAwesomeIcon className="text-black mr-2 fa-1x" icon={faCouch}/>
      </td></span>);
      }
      }
      return renderedSeats;
      }

  returnReservedSeats() {
        const {seats, reservedSeats} = this.state;
        console.log('all seats: ', seats);
        console.log('all reserved seats: ', reservedSeats);
        const allSeatsWithReservations = [];
        seats.forEach(seat => {
            const isReserved = reservedSeats.some(reserved => reserved.id === seat.id);
            if (isReserved) {
                seat.seatColor='gray';
                seat.isReserved = true;
            } else {
                seat.isReserved = false;
            }
            allSeatsWithReservations.push(seat);
        });
    return allSeatsWithReservations;
    }
  
  insertingReservation() {
      const { auditoriumId, id, projectionTime, seatsForReservation  } = this.state;

      const data = {
          AuditoriumId: auditoriumId,
          UserId : "206F083A-1080-4EA3-92E4-62105C33FCB9",
          ProjectionId : id,
          ProjectionTime: projectionTime,
          SeatIds: seatsForReservation
      };
      console.log('Here is this log: ' + JSON.stringify(data));

      const requestOptions = {
          method: 'POST',
          headers: {'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')},
          body: JSON.stringify(data)
      };

      fetch(`${serviceConfig.baseURL}/api/reservations`, requestOptions)
          .then(response => {
              if (!response.ok) {
                  return Promise.reject(response);
              }
              return response.statusText;
          })
          .then(() => {
            this.simulatingPayment();
          })
          .then(result => {
              NotificationManager.success('Successfull reservation, processing payment!');
              this.setState({seatsForReservation: []});
              const timer = setTimeout(() => {
                window.location.reload();
                console.log('This will run after 5 seconds!')
              }, 5000);
              return () => clearTimeout(timer);
          })
          .catch(response => {
              NotificationManager.error('Seats that you have chosen are not consecutive or they are already reserved, please try again.');
              this.setState({submitted: false, seatsForReservation: []});
                const timer = setTimeout(() => {
                  window.location.reload();
                }, 4000);
                return () => clearTimeout(timer);
              });
  }
  
  simulatingPayment(){

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
    };
    fetch(`${serviceConfig.baseURL}/api/Levi9Payment`, requestOptions)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response);
            }
            return response.statusText;
        })
        .then(result => {
          NotificationManager.success('Successfull payment!');
        })
        .catch(response => {
            NotificationManager.error('Insuficient funds, please try again!');
              });
        /*.then(result => {
          NotificationManager.success('Successfull reservation, processing payment!');
              this.setState({seatsForReservation: []});
          NotificationManager.success('Successfull payment!');
              const timer = setTimeout(() => {
                window.location.reload();
                console.log('This will run after 5 seconds!')
              }, 5000);
              return () => clearTimeout(timer);
        })
        .catch(response => {
           NotificationManager.error('Seats that you have chosen are not consecutive or they are already reserved, please try again.');
              this.setState({ submitted: false, seatsForReservation: []});
            NotificationManager.error('Insuficient funds, please try again!');
                const timer = setTimeout(() => {
                  window.location.reload();
                }, 4000);
                return () => clearTimeout(timer);
              });*/
  }


  render() {
    const { title, auditoriumName, projectionTime, seats, seatsForReservation } = this.state;
    const numOfSeatsPerRow = this.maxSeatsPerRow();
    const rows = this.maxRows();
    const ticketPrice = seatsForReservation.length * 800;
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
                  {this.renderRows(rows , this.returnReservedSeats(), numOfSeatsPerRow)}
                  </tbody>
                  </table>
              </Row>
              </div>
          </Col>
        </Row>
        <hr/>
        </Card.Text>
        <Row className="justify-content-center font-weight-bold">
          Price for reserved seats: {ticketPrice} RSD
        </Row>
        <Row className="justify-content-center font-weight-bold">
        
        <Button 
            type="submit"
            onClick={() => this.insertingReservation()}
            className="mr-1 mb-2"
            >
             Reserve seat/s
        </Button>
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