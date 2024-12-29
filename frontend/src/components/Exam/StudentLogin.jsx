import React from 'react';
import {
    Card,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';

const StudentLogin = () => {
    const navigate = useNavigate();

    const generateKeyPair = async () => {
        const { publicKey, privateKey } = await crypto.subtle.generateKey(
            {
                name: "RSA-PSS",
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: "SHA-256"
            },
            true,
            ["sign", "verify"]
        );

        const exportedPublicKey = await crypto.subtle.exportKey("spki", publicKey);
        const exportedPrivateKey = await crypto.subtle.exportKey("pkcs8", privateKey);

        const publicKeyBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(exportedPublicKey)));
        const privateKeyBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(exportedPrivateKey)));

        console.log("keys: ", privateKeyBase64, publicKeyBase64);
        localStorage.setItem('privateKey', privateKeyBase64);
        localStorage.setItem('publicKey', publicKeyBase64);

        return publicKeyBase64;
    };

    const sendPublicKeyToServer = async (publicKey, enrollmentNumber) => {
        try {
            await axios.post(`${config.baseURL}/users/api/v1/save-public-key`, {
                publicKey,
                enrollmentNumber,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
        } catch (error) {
            console.error('Error sending public key:', error);
        }
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        const emailOrUsername = event.target.emailOrUsername.value;
        const password = event.target.password.value;

        try {
            // Log in the user
            const loginResponse = await axios.post(`${config.baseURL}/users/api/v1/login`, {
                emailOrUsername,
                password,
            });

            const { token } = loginResponse.data;

            if (token) {
                localStorage.setItem('token', token);

                // Get user details
                const userDetailsResponse = await axios.get(`${config.baseURL}/users/api/v1/user/details`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const { username } = userDetailsResponse.data.user;

                // Get student details
                const studentDetailsResponse = await axios.get(`${config.baseURL}/users/api/v1/student-details/${username}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const { enrollmentNumber } = studentDetailsResponse.data;
                localStorage.setItem('username', username);
                localStorage.setItem('enrollmentNumber', enrollmentNumber);

                // Generate key pair and send public key to server
                const publicKey = await generateKeyPair();
                await sendPublicKeyToServer(publicKey, enrollmentNumber);

                // Navigate to exam window
                navigate('/exam-window');
            } else {
                console.error('Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="w-[90%] m-auto flex justify-center py-2 ">
            <Card color="transparent" shadow={false}>
                <Typography variant="h4" color="blue-gray">
                    Student Sign In
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
};

export default StudentLogin;
