import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const error = searchParams.get('error');
        if(error){
            alert(`Authentication Failed: ${error}`);

            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [searchParams]);

    const handleSpotifyLogin = () => {
        window.location.href = 'http://localhost:8080/api/spotify-login';
    }

    const handleLocalLogin = async (event) => {
        event.preventDefault();

        const form = event.target;

        const formData = {
            name: form.name.value,
            email: form.email.value,
            password: form.password.value,
        }

        try{
            const response = await axios.post('http://localhost:8080/api/local-login', formData);

            if(response.ok){
                console.log('Successfull Login!');
            }
        }catch(err){
            console.log("Login error: ", err);
            throw new Error('Login Error!', err);
        }

    }

    return (
        <>
            <div className="login-container">
                <h1>Login Page!</h1>
                <Form onSubmit={handleLocalLogin}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Full Name!</Form.Label>
                    <Form.Control name="name" type="text" placeholder="John Doe" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control name="email" type="email" placeholder="Enter email" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control name="password" type="password" placeholder="Password" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
                </Form>
                <button onClick={handleSpotifyLogin} className="spotify-oauth-btn">
                    Login with Spotify
                </button>
            </div>
        </>
    );
}

export default Login;
