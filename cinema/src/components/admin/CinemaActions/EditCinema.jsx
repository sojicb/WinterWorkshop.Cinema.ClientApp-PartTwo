import React from 'react';
import { withRouter } from 'react-router-dom';
import { FormGroup, FormControl, Button, Container, Row, Col, FormText, } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import { serviceConfig } from '../../../appSettings';

class EditCinema extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            id: '',
            cinemaId: '',
            nameError: '',
            submitted: false,
            canSubmit: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const { id } = this.props.match.params; 
        this.getCinema(id);
    }

    handleChange(e) {
        const { id, value } = e.target;
        this.setState({ [id]: value });
        this.validate(id, value);
    }

    validate(id, value) {
        if (id === 'name') {
            if (value === '') {
                this.setState({nameError: 'Fill in Cinema name', 
                                canSubmit: false});
            } else {
                this.setState({nameError: '',
                                canSubmit: true});
            }
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { name } = this.state;
        if (name) {
            this.updateCinema();
        } else {
            NotificationManager.error('Please fill in name of cinema');
            this.setState({ submitted: false });
        }
    }


    getCinema(cinemaId) {
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('jwt')}
    };

    fetch(`${serviceConfig.baseURL}/api/cinemas/get/${cinemaId}` , requestOptions)
        .then(response => {
        if (!response.ok) {
            return Promise.reject(response);
        }
        return response.json();
        })
        .then(data => {
            if (data) {
                this.setState({name: data.name,
                               id: data.id});
            }
        })
        .catch(response => {
            NotificationManager.error(response.message || response.statusText);
            this.setState({ submitted: false });
        });
    }

    updateCinema() {
        const { name, id } = this.state;

        const data = {
            Name: name
        };

        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('jwt')},
            body: JSON.stringify(data)
        };

        fetch(`${serviceConfig.baseURL}/api/cinemas/${id}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    return Promise.reject(response);
                }
                return response.statusText;
            })
            .then(result => {
                this.props.history.goBack();
                NotificationManager.success('Successfuly edited cinema!');
            })
            .catch(response => {
                NotificationManager.error(response.message || response.statusText);
                this.setState({ submitted: false });
            });
    }

    render() {
        const { name, nameError, submitted, canSubmit } = this.state;
        return (
            <Container>
                <Row>
                    <Col>
                        <h1 className="form-header">Edit Existing Cinema</h1>
                        <form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <FormControl
                                    className = "editCinema"
                                    id="name"
                                    type="text"
                                    placeholder="Cinema Name"
                                    value={name}
                                    onChange={this.handleChange}
                                />
                                <FormText className="text-danger">{nameError}</FormText>
                            </FormGroup>
                            <Button className = "editCinema" type="submit" disabled={submitted || !canSubmit} block>Edit Cinema</Button>
                        </form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default withRouter(EditCinema);