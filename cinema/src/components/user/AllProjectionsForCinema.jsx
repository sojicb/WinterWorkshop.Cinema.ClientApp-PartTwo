import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../appSettings';
import Projection from './Projection';
import { Row } from 'react-bootstrap';

class AllProjectionsForCinema extends Component {
    constructor(props) {
      super(props);
      this.state = {
          movies: []
      };
    }

    componentDidMount() {
       this.getProjections();
    }

    getProjections() {
      // TO DO here you need to change this part and query, and fetch movies with projections, and in future add fetch by cinema name
      const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
      };

      fetch(`${serviceConfig.baseURL}/api/Movies/current`, requestOptions)
        .then(response => {
          if (!response.ok) {
            return Promise.reject(response);
        }
        return response.json();
        })
        .then(data => {
          NotificationManager.success('Successfuly fetched data');
          if (data) {
            }
        })
        .catch(response => {
            NotificationManager.error(response.message || response.statusText);
            this.setState({ submitted: false });
        });
    }
    render() {
        return (
          <div className="no-gutters">
            <Row className="no-gutters">
            </Row>
            <Row className="no-gutters set-overflow-y">
              <Projection></Projection>
              <Projection></Projection>
              <Projection></Projection>
              <Projection></Projection>
              <Projection></Projection>
            </Row>
          </div>
        );
      }
}

export default AllProjectionsForCinema;