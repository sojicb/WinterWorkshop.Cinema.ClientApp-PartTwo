import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';
import { withRouter } from 'react-router-dom';
import { Row, Card, Button, Table } from 'react-bootstrap';
import Spinner from '../Spinner';



class AllProjectionsForCinema extends Component {
    constructor(props) {
      super(props);
      this.state = {
          movies: [],
          movie: '',
          isLoading: false
      };
      this.getProjections = this.getProjections.bind(this);


    }

    componentDidMount() {
       this.getProjections();
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
  
    navigateToProjectionDetails(id) {
      this.props.history.push(`projectiondetails/getProjection/${id}`);
    }

    fillTableWithProjectionsData(projections, movie) { 
      
      return projections.map(projection => 
        {
         return <Button 
                key={movie.projections} 
                onClick={() => this.navigateToProjectionDetails(projection.id)} 
                className="mr-1 mb-2"
              >
                {projection.projectionTime}
        </Button>
        });
      }

    fillTableWithDaata() {
      return this.state.movies.map(movie => {
        console.log(movie);
          return <tr> 
        <Card className="mt-5 card-width">
            <Card.Body>
               <Card.Title>
                 <span className="card-title-font"><td>{movie.title}</td></span> <span><img className="img-responsive" src="https://source.unsplash.com/random" alt="logo" align="right" width="500" height="350" /></span></Card.Title>
                  <hr/>
                    <Card.Subtitle className="mb-2 text-muted">IMDb Rating: <td>{Math.round(movie.rating)}/10</td></Card.Subtitle>
                      <hr/>
                    <Card.Subtitle className="mb-2 text-muted">Year of production: <td>{movie.year}</td></Card.Subtitle>
                      <hr/>
                    <Card.Text>
                      <span className="mb-2 font-weight-bold">
                            Projection times: 
                      </span>
                 </Card.Text>
                 {this.fillTableWithProjectionsData(movie.projections, movie)}
            </Card.Body>
         </Card>
    </tr>
      })
  }

  
    render() {
      
      const { isLoading } = this.state;
        const rowsData = this.fillTableWithDaata();
        const table = (<Table striped bordered hover size="bg" data-colors='red,green,blue' variant="">
                            <thead>
                            </thead>
                            <tbody>
                            {rowsData}
                            </tbody>
                        </Table>);
        const showTable = isLoading ? <Spinner></Spinner> : table;
        return (
         <React.Fragment>
                <Row className="no-gutters pt-2">
                    <h1 className="form-header ml-2">New Movies in our Nine Cinema:</h1>
                </Row>
                
                <Row className="no-gutters pr-5 pl-5">
                    {showTable}
                </Row>
            </React.Fragment>
        );
      }
}

export default withRouter(AllProjectionsForCinema);

/*<ul class="slides">
    <input type="radio" name="radio-btn" id="img-1" checked />
    <li class="slide-container">
		<div class="slide">
			<img src="https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SY999_CR0,0,673,999_AL_.jpg" />
        </div>
		<div class="nav">
			<label for="img-6" class="prev">&#x2039;</label>
			<label for="img-2" class="next">&#x203a;</label>
		</div>
    </li>

    <input type="radio" name="radio-btn" id="img-2" />
    <li class="slide-container">
        <div class="slide">
          <img src="https://m.media-amazon.com/images/M/MV5BMTU0NTEzMTIzM15BMl5BanBnXkFtZTcwMDQxMzU1MQ@@._V1_.jpg" />
        </div>
		<div class="nav">
			<label for="img-1" class="prev">&#x2039;</label>
			<label for="img-3" class="next">&#x203a;</label>
		</div>
    </li>

    <input type="radio" name="radio-btn" id="img-3" />
    <li class="slide-container">
        <div class="slide">
          <img src="https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_CR0,0,666,1000_AL_.jpg" />
        </div>
		<div class="nav">
			<label for="img-2" class="prev">&#x2039;</label>
			<label for="img-4" class="next">&#x203a;</label>
		</div>
    </li>

    <input type="radio" name="radio-btn" id="img-4" />
    <li class="slide-container">
        <div class="slide">
          <img src="https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SY1000_SX675_AL_.jpg" />
        </div>
		<div class="nav">
			<label for="img-3" class="prev">&#x2039;</label>
			<label for="img-5" class="next">&#x203a;</label>
		</div>
    </li>

    <input type="radio" name="radio-btn" id="img-5" />
    <li class="slide-container">
        <div class="slide">
          <img src="https://m.media-amazon.com/images/M/MV5BNDc1ZTlmOWUtNDY2YS00OGU5LTg2MTYtYTk2MmQzMGE2NzUwXkEyXkFqcGdeQXVyODkzNTgxMDg@._V1_SY1000_CR0,0,675,1000_AL_.jpg" />
        </div>
		<div class="nav">
			<label for="img-4" class="prev">&#x2039;</label>
			<label for="img-6" class="next">&#x203a;</label>
		</div>
    </li>

    <input type="radio" name="radio-btn" id="img-6" />
    <li class="slide-container">
        <div class="slide">
          <img src="https://m.media-amazon.com/images/M/MV5BMjFlZjZkMTYtODM2Zi00OTM4LWIwYTktOTFjMmQzZDEzZDc4XkEyXkFqcGdeQXVyNDg4NjY5OTQ@._V1_SY1000_CR0,0,675,1000_AL_.jpg" />
        </div>
		<div class="nav">
			<label for="img-5" class="prev">&#x2039;</label>
			<label for="img-1" class="next">&#x203a;</label>
		</div>
    </li>

    <li class="nav-dots">
      <label for="img-1" class="nav-dot" id="img-dot-1"></label>
      <label for="img-2" class="nav-dot" id="img-dot-2"></label>
      <label for="img-3" class="nav-dot" id="img-dot-3"></label>
      <label for="img-4" class="nav-dot" id="img-dot-4"></label>
      <label for="img-5" class="nav-dot" id="img-dot-5"></label>
      <label for="img-6" class="nav-dot" id="img-dot-6"></label>
    </li>
</ul>*/