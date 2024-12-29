import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import config from '../../config';

export function AdminLogin() {
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();

    const emailOrUsername = event.target.emailOrUsername.value;
    const password = event.target.password.value;

    fetch(`${config.baseURL}/users/api/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailOrUsername,
        password,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          navigate('/admin-dashboard');
        } else {
          console.error('Login failed');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="w-[90%] m-auto flex justify-center py-2 ">
      <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
          Admin Sign In
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Nice to meet you! Enter your details to login.
        </Typography>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleLogin}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Username/Email
            </Typography>
            <Input
              name="emailOrUsername"
              size="lg"
              placeholder="name@mail.com or username"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Password
            </Typography>
            <Input
              name="password"
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <Button type="submit" className="mt-6" fullWidth>
            Log In
          </Button>
        </form>
      </Card>
    </div>
  );
}
