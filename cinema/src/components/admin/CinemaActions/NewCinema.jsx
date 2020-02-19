import React from 'react';
import { withRouter } from 'react-router-dom';
import { FormGroup, FormControl, Button, Container, Row, Col, FormText, } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';
 
class NewCinema extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        name: '',
        cinemaNameError: '',
        submitted: false,
        canSubmit: true
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { id, value } = e.target;
    this.setState({ [id]: value });
    this.validate(id, value);
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });
    const { name } = this.state;
    if (name) {
        this.addCinema();
    } else {
        NotificationManager.error('Please fill form with data.');
        this.setState({ submitted: false });
    }
}

validate(id, value) {
  if (id === 'name') {
      if(value === ''){
          this.setState({cinemaNameError: 'Fill in cinema name',
                          canSubmit: false})
      } else {
          this.setState({cinemaNameError: '',
                          canSubmit: true});
      }
    }
}

  addCinema() {
    const { name } = this.state;

    const data = {
      Name: name
    };

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + localStorage.getItem('jwt')},
        body: JSON.stringify(data)
    };

    fetch(`${serviceConfig.baseURL}/api/cinemas`, requestOptions)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response);
            }
            return response.statusText;
        })
        .then(result => {
            NotificationManager.success('Successfuly added new cinema!');
            this.props.history.push('AllCinemas');
        })
        .catch(response => {
            NotificationManager.error(response.message || response.statusText);
            this.setState({ submitted: false });
        });
}


  render() {
    const {name, submitted, canSubmit, cinemaNameError} = this.state;
    return (
      <Container>
        <Row>
          <Col>
            <h1 className='form-header'>Add Cinema</h1>
            <form onSubmit={this.handleSubmit}>
              <FormGroup>
                    <FormControl
                      id="name"
                      type="text"
                      placeholder="Cinema Name"
                      defaultValue={name}
                      onChange={this.handleChange}
                    />
                <FormText className="text-danger">{cinemaNameError}</FormText>
              </FormGroup>
              <Button type="submit" disabled={submitted || !canSubmit} block>Add Cinema</Button>
            </form>
          </Col>
        </Row>

      </Container>
    );
  }
}

export default withRouter(NewCinema);