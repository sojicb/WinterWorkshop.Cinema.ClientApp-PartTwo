import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';
import { Row, Table, Container, FormGroup, FormControl, Button, Col, FormText} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../Spinner';
import {Typeahead} from 'react-bootstrap-typeahead';


class ShowAllProjections extends Component {
    constructor(props) {
      super(props);
      this.state = {
        projections: [],
        cinemaId: '',
        cinema: '',
        cinemas: [],
        cinemaIdError: '',
        auditoriumId: '',
        auditorium: '',
        auditoriums: [],
        auditoriumIdError: '',
        movieId: '',
        movie: '',
        movies: [],
        movieIdError: '',
        isLoading: true,
        submitted: false,
        canSubmit: true
      };
      this.editProjection = this.editProjection.bind(this);
      this.removeProjection = this.removeProjection.bind(this);
      this.getProjections = this.getProjections.bind(this);
      this.getAuditoriums = this.getAuditoriums.bind(this);
      this.getMovies = this.getMovies.bind(this);
      this.filteringProjectionsByCinema = this.filteringProjectionsByCinema.bind(this);
      this.filteringProjectionsByAudit = this.filteringProjectionsByAudit.bind(this);
      this.filteringProjectionsByMovie = this.filteringProjectionsByMovie.bind(this);
      this.filteringProjectionsByOption = this.filteringProjectionsByOption.bind(this);

      this.getAuditoriumsByCinemas = this.getAuditoriumsByCinemas.bind(this);
    }

    componentDidMount() {
      this.getProjections();
      this.getCinemas();
      //this.getAuditoriums();
      //this.getMovies();
      //this.filteringProjectionsByCinema();
      //this.filteringProjectionsByAudit();
      //this.filteringProjectionsByMovie();
    }

    handleChange(checked) {
        this.setState({ checked });
      }


    validate(id, value) {
        if (id === 'cinemaId') {
            if (!value) {
                this.setState({cinemaIdError: 'Please chose cinema from dropdown',
                                canSubmit: false})
            } else {
                this.setState({cinemaIdError: '',
                                canSubmit: true});
            }
        }
        if (id === 'auditoriumId') {
            if (!value) {
                this.setState({auditoriumIdError: 'Please chose auditorium from dropdown',
                                canSubmit: false})
            } else {
                this.setState({auditoriumIdError: '',
                                canSubmit: true});
            }
        }
        if (id === 'movieId') {
            if (!value) {
                this.setState({movieIdError: 'Please chose movie from dropdown',
                                canSubmit: false})
            } else {
                this.setState({movieIdError: '',
                                canSubmit: true});
            }
        }
    }

    getCinemas() {
        const requestOptions = {
          method: 'GET',
          headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };
  
        fetch(`${serviceConfig.baseURL}/api/Cinemas/all`, requestOptions)
          .then(response => {
            if (!response.ok) {
              return Promise.reject(response);
          }
          return response.json();
          })
          .then(data => {
            if (data) {
              this.setState({ cinemas: data });
              }
          })
          .catch(response => {
              NotificationManager.error(response.message || response.statusText);
              this.setState({ submitted: false });
          });
      }
     
    getProjections() {
      const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
      };

      this.setState({isLoading: true});
      fetch(`${serviceConfig.baseURL}/api/Projections/all`, requestOptions)
        .then(response => {
          if (!response.ok) {
            return Promise.reject(response);
        }
        return response.json();
        })
        .then(data => {
          if (data) {
            this.setState({ projections: data, isLoading: false });
            }
        })
        .catch(response => {
            this.setState({isLoading: false});
            NotificationManager.error(response.message || response.statusText);
        });
    }

    getAuditoriums() {
        const requestOptions = {
          method: 'GET',
          headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };
  
        this.setState({isLoading: true});
        fetch(`${serviceConfig.baseURL}/api/Auditoriums/all`, requestOptions)
          .then(response => {
            if (!response.ok) {
              return Promise.reject(response);
          }
          return response.json();
          })
          .then(data => {
            if (data) {
              this.setState({ auditoriums: data, isLoading: false });
              }
          })
          .catch(response => {
              NotificationManager.error(response.message || response.statusText);
              this.setState({ isLoading: false });
          });
      }

    getMovies() {
      const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
      };

      this.setState({isLoading: true});
      fetch(`${serviceConfig.baseURL}/api/Movies/all`, requestOptions)
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

    getAuditoriumsByCinemas() {

        let {cinemaId} = this.state;

        if(!cinemaId) {
			return;
		}  

        const requestOptions = {
          method: 'GET',
          headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };
  
        this.setState({isLoading: true});
        
        fetch(`${serviceConfig.baseURL}/api/Auditoriums/filter/${cinemaId}`, requestOptions)
          .then(response => {
            if (!response.ok) {
              return Promise.reject(response);
          }
          return response.json();
          })
          .then(data => {
            if (data) {
                console.log(data);
                
              this.setState({ auditoriums: data, isLoading: false });
              }
          })
          .catch(response => {
              NotificationManager.error(response.message || response.statusText);
              this.setState({ isLoading: false });
          });
      }

    filteringProjectionsByCinema() {
        const { cinemaId } = this.state;
		
		if(!cinemaId) {
			return;
		}  

        const requestOptions = {
          method: 'GET',
          headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };
  
        this.setState({isLoading: true});
        fetch(`${serviceConfig.baseURL}/api/projections/filtering/?cinemaId=${cinemaId}`, requestOptions)
          .then(response => {
            this.forceUpdate();
            if (!response.ok) {
              return Promise.reject(response);
          }
          return response.json();
          })
          .then(data => {
            if (data) {
              this.setState({ projections: data, isLoading: false });
              }
          })
          .catch(response => {
              this.setState({isLoading: false});
              NotificationManager.error(response.message || response.statusText);
          });
      }

    filteringProjectionsByAudit() {
        const { cinemaId, auditoriumId } = this.state;
		
		if(!cinemaId && !auditoriumId) {
			return;
		}  

        const requestOptions = {
          method: 'GET',
          headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };
  
        this.setState({isLoading: true});
        fetch(`${serviceConfig.baseURL}/api/projections/filtering/?cinemaId=${cinemaId}&auditoriumId=${auditoriumId}`, requestOptions)
          .then(response => {
            this.forceUpdate();
            if (!response.ok) {
              return Promise.reject(response);
          }
          return response.json();
          })
          .then(data => {
            if (data) {
              this.setState({ auditoriums: data, isLoading: false });
              }
          })
          .catch(response => {
              this.setState({isLoading: false});
              NotificationManager.error(response.message || response.statusText);
          });
      }

    filteringProjectionsByMovie() {
        const { cinemaId, auditoriumId, movieId } = this.state;
		
		if(!cinemaId && !auditoriumId && !movieId) {
			return;
		}  

        const requestOptions = {
          method: 'GET',
          headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };
  
        this.setState({isLoading: true});
        fetch(`${serviceConfig.baseURL}/api/projections/filtering/?cinemaId=${cinemaId}&auditoriumId=${auditoriumId}&movieId=${movieId}`, requestOptions)
          .then(response => {
            this.forceUpdate();
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
          });
      }
    
     filteringProjectionsByOption(option) {
        const { cinemaId, auditoriumId, movieId } = this.state;
		
		let url = "";
		
		switch(option) {
			case 1:
				url = `/api/projections/filtering/?cinemaId=${cinemaId}`
				break;
			case 2:
				url = `/api/projections/filtering/?auditoriumId=${auditoriumId}`
				break;
			case 3:
                url = `/api/projections/filtering/?movieId=${movieId}`
				break;
			default:
				url = `/api/projections/filtering/?cinemaId=${cinemaId}&auditoriumId=${auditoriumId}&movieId=${movieId}`;
				break;
		}
		
		if(!cinemaId && !auditoriumId && !movieId) {
			return;
		}  

        const requestOptions = {
          method: 'GET',
          headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };
  
        this.setState({isLoading: true});
        fetch(`${serviceConfig.baseURL}` + url, requestOptions)
          .then(response => {
            this.forceUpdate();
            if (!response.ok) {
              return Promise.reject(response);
          }
          return response.json();
          })
          .then(data => {
            if (data) {
              this.setState({ projections: data, isLoading: false });
              }
          })
          .then(() => {
            this.getAuditoriumsByCinemas();

          })
          .catch(response => {
              this.setState({isLoading: false});
              NotificationManager.error(response.message || response.statusText);
          });
      }

    onCinemaChange(cinema) {
        if(cinema[0]){
            this.state['cinemaId'] = cinema[0].id;
            this.validate('cinemaId', cinema[0]);
            this.filteringProjectionsByOption();
            this.forceUpdate();
        } else {
            this.validate('cinemaId', null);
            this.setState({cinemaId: null});
        }
    }

    onAuditChange(auditorium) {
        console.log(auditorium)
        if(auditorium[0]){
            this.state['auditoriumId'] = auditorium[0].id;
            this.validate('auditoriumId', auditorium[0]);
            this.filteringProjectionsByOption();
            this.forceUpdate();
        } else {
            this.validate('auditoriumId', null);
            this.setState({auditoriumId: null});
        }
    }

    onMovieChange(movie) {
        console.log(movie)
        if(movie[0]){
            console.log('CHOSEN ID: ', movie[0].id);
            this.state['movieId'] = movie[0].id;
            console.log('movie: ', movie[0]);
            this.validate('movieId', movie[0]);
            this.filteringProjectionsByMovie();
            this.forceUpdate();
        } else {
            this.validate('movieId', null);
            this.setState({movieId: null});
        }
    }
      

    removeProjection(id) {
      const requestOptions = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
    };

    fetch(`${serviceConfig.baseURL}/api/projections/delete/${id}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response);
            }
            return response.statusText;
        })
        .then(result => {
            NotificationManager.success('Successfuly removed projection with id:', id);
            const newState = this.state.projections.filter(projection => {
                return projection.id !== id;
            })
            this.setState({projections: newState});
        })
        .catch(response => {
            NotificationManager.error(response.message || response.statusText);
            this.setState({ submitted: false });
        });
    }

    fillTableWithDaata() {
        return this.state.projections.map(projection => {
            return <tr key={projection.id}>
                        <td width="18%">{projection.id}</td>
                        <td width="18%">{projection.movieId}</td>
                        <td width="18%">{projection.movieTitle}</td>
                        <td width="18%">{projection.auditoriumId}</td>
                        <td width="18%">{projection.projectionTime}</td>
                        <td width="5%" className="text-center cursor-pointer" onClick={() => this.editProjection(projection.id)}><FontAwesomeIcon className="text-info mr-2 fa-1x" icon={faEdit}/></td>
                        <td width="5%" className="text-center cursor-pointer" onClick={() => this.removeProjection(projection.id)}><FontAwesomeIcon className="text-danger mr-2 fa-1x" icon={faTrash}/></td>
                    </tr>
        })
    }

    editProjection(id) {
        // to be implemented
        this.props.history.push(`editProjection/${id}`);
    }

    render() {
        const {isLoading, cinemas, cinemaIdError, auditoriums, auditoriumIdError, movies, movieIdError} = this.state;
        const rowsData = this.fillTableWithDaata();
        const table = (<Table striped bordered hover size="sm" variant="dark">
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>Movie Id</th>
                                <th>Movie Title</th>
                                <th>Auditorium Id</th>
                                <th>Projection Time</th>
                                <th></th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                                {rowsData}
                            </tbody>
                        </Table>);
        const showTable = isLoading ? <Spinner></Spinner> : table;
        return (
            <div>
            <Container>
                <Row>
                    <Col>
                    <h1 className = "form-header">Filters for Projections</h1>
                    <FormGroup>
                    <Typeahead
                                labelKey="name"
                                options={cinemas}
                                placeholder="Chose a cinema"
                                id="browser"
                                onChange={e => {this.onCinemaChange(e)}}
                                />
                    <FormText className="text-danger">{cinemaIdError}</FormText>
                    </FormGroup>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row>
                    <Col>
                    <FormGroup>
                    <Typeahead
                                labelKey="name"
                                options={auditoriums}
                                placeholder="Chose a auditorium"
                                id="browser"
                                onChange={e => {this.onAuditChange(e)}}
                                />
                    <FormText className="text-danger">{auditoriumIdError}</FormText>
                    </FormGroup>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row>
                    <Col>
                    <FormGroup>
                    <Typeahead
                                labelKey="name"
                                options={movies}
                                placeholder="Chose a movie"
                                id="browser"
                                onChange={e => {this.onMovieChange(e)}}
                                />
                    <FormText className="text-danger">{movieIdError}</FormText>
                    </FormGroup>
                    </Col>
                </Row>
            </Container>
            <React.Fragment>
                <Row className="no-gutters pt-2">
                    <h1 className="form-header ml-2">All Projections</h1>
                </Row>
                <Row className="no-gutters pr-5 pl-5">
                    {showTable}
                </Row>
            </React.Fragment>
            </div>
        );
      }
}

export default ShowAllProjections;