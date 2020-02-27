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
        cinemas: [],
        cinemaIdError: '',
        isLoading: true,
        submitted: false,
        canSubmit: true
      };
      this.editProjection = this.editProjection.bind(this);
      this.removeProjection = this.removeProjection.bind(this);
      this.getProjections = this.getProjections.bind(this);
    }

    componentDidMount() {
      this.getProjections();
      this.getCinemas();
     this.filteringProjections();
    }

    validate(id, value) {
        if (id === 'cinemaId') {
            if (!value) {
                this.setState({cinemaIdError: 'Please chose cineam from dropdown',
                                canSubmit: false})
            } else {
                this.setState({cinemaIdError: '',
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

      onCinemaChange(cinema) {
        if(cinema[0]){
            this.setState({cinemaId: cinema[0].id});
            this.validate('cinemaId', cinema[0]);
            this.filteringProjections();
        } else {
            this.validate('cinemaId', null);
        }
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

    filteringProjections(cinemaId) {
           
        const requestOptions = {
          method: 'GET',
          headers: {'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
        };
  
        this.setState({isLoading: true});
        fetch(`${serviceConfig.baseURL}/api/projections/filtering/${cinemaId}`, requestOptions)
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
        const {isLoading, cinemas, cinemaIdError} = this.state;
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