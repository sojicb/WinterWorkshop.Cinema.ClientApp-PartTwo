import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../appSettings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation, faVideo, faChartLine, faFingerprint } from '@fortawesome/free-solid-svg-icons';


class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      user: [],
      submitted: false,
      canLogIn: false
  };
  this.handleChange = this.handleChange.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
  this.getUser = this.getUser.bind(this);
}

  handleChange(e) {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.getUser();

    this.setState({ submitted: true });
    const { username, canLogIn } = this.state;
    if (canLogIn) {
    } else {
      this.setState({ submitted: false });
    }
  }

  getUser() {
    const { username, user, canLogIn } = this.state;
  
    console.log(username);
    const requestOptions = {
      method: 'GET'
    };
  
    fetch(`${serviceConfig.baseURL}/api/Users/byusername/${username}`, requestOptions)
      .then(response => {
         if (!response.ok) {
           return Promise.reject(response);
      }
       return response.json();
      })
       .then(data => {
         if(data) {
           this.login();
          this.setState({ user: data.username, canLogIn: true });
         }
      })
       .catch(response => {
          NotificationManager.error("No such user");
          this.setState({ submitted: false, canLogIn: false});
      });
  
          
  }

  login() {
    const { username } = this.state;

    const requestOptions = {
      method: 'GET'
    };

    fetch(`${serviceConfig.baseURL}/get-token?name=${username}&admin=true`, requestOptions)
      .then(response => {
        if (!response.ok) {
          return Promise.reject(response);
        }
        return response.json();
      })
      .then(data => {
        NotificationManager.success('Successfuly signed in!');
        if (data.token) {
          localStorage.setItem("jwt", data.token);
        }
      })
      .catch(response => {
        NotificationManager.error(response.message || response.statusText);
        this.setState({ submitted: false });
      });
  }
  render() {
    const { username } = this.state;
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand className="text-info font-weight-bold text-capitalize"><Link className="text-decoration-none" to='/projectionlist'><FontAwesomeIcon className="text-black mr-2 fa-1x" icon={faVideo} />Cinema 9</Link></Navbar.Brand>
        <Navbar.Brand className="text-info font-weight-bold text-capitalize"><Link className="text-decoration-none" to='/dashboard'><FontAwesomeIcon className="text-black mr-2 fa-1x" icon={faExclamation} />Dashboard</Link></Navbar.Brand>
        <Navbar.Brand className="text-info font-weight-bold text-capitalize"><Link className="text-decoration-none" to='/topmovies'><FontAwesomeIcon className="text-black mr-2 fa-1x" icon={faChartLine} />Top Movies</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="text-white" />
        <Navbar.Collapse id="basic-navbar-nav" className="text-white">
          <Nav className="mr-auto text-white" >
          </Nav>
          <Form inline onSubmit={this.handleSubmit}>
            <FormControl type="text" placeholder="Username"
              id="username"
              value={username}
              onChange={this.handleChange}
              className="mr-sm-2" />
            <Button type="submit" variant="outline-primary" className="mr-1">Log In <FontAwesomeIcon className="text-black mr-2 fa-1x" icon={faFingerprint} /></Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;