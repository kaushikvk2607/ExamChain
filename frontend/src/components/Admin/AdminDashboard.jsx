import React, { useState } from 'react';
import { Card, Input, Button, Typography, Alert, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import config from '../../config';
import { OrganizationList } from './OrganizationList';

const AdminDashboard = () => {
    const [examTitle, setExamTitle] = useState('');
    const [examContent, setExamContent] = useState('');
    const [organizationIds, setOrganizationIds] = useState('');
    const [threshold, setThreshold] = useState('');
    const [alert, setAlert] = useState(null);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [id, setId] = useState('');

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    const handleCreateExam = async () => {
        try {
            const response = await fetch(`${config.baseURL}/exam/create-exam`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    title: examTitle,
                    content: examContent,
                    organizationIds: organizationIds.split(','),
                    threshold: parseInt(threshold, 10),
                }),
            });

            if (response.ok) {
                setAlert({ type: 'success', message: 'Exam created successfully!' });
                resetExamFields();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create exam');
            }
        } catch (error) {
            setAlert({ type: 'error', message: error.message });
        }
    };

    const handleCreateOrganization = async () => {
        try {
            if (password !== passwordConfirmation) {
                throw new Error('Passwords do not match');
            }

            const response = await fetch(`${config.baseURL}/users/api/v1/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    passwordConfirmation,
                    email,
                    name,
                    id,
                    role: 'ORGANIZATION',
                }),
            });

            if (response.ok) {
                setAlert({ type: 'success', message: 'Organization created successfully!' });
                resetOrganizationFields();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create organization');
            }
        } catch (error) {
            setAlert({ type: 'error', message: error.message });
        }
    };

    const resetExamFields = () => {
        setExamTitle('');
        setExamContent('');
        setOrganizationIds('');
        setThreshold('');
    };

    const resetOrganizationFields = () => {
        setUsername('');
        setPassword('');
        setPasswordConfirmation('');
        setEmail('');
        setName('');
        setId('');
    };

    const handleConfirm = () => {
        if (confirmAction === 'createExam') {
            handleCreateExam();
        } else if (confirmAction === 'createOrganization') {
            handleCreateOrganization();
        }
        setShowConfirmDialog(false);
    };

    const openConfirmDialog = (action) => {
        setConfirmAction(action);
        setShowConfirmDialog(true);
    };

    return (
        <div className="w-full min-h-screen bg-white text-black p-8">
            <OrganizationList/>
            
            {alert && (
                <Alert color={alert.type === 'success' ? 'green' : 'red'} className="mb-4">
                    {alert.message}
                </Alert>
            )}
            <div className='flex flex-col flex-wrap justify-between w-full md:flex-row h-3/4'>
                <Card className="mb-8 p-4 w-[50%]">
                    <Typography variant="h4" color="blue-gray">
                        Create Exam
                    </Typography>
                    <form className="mt-4 flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                        <Input
                            label="Title"
                            size="lg"
                            value={examTitle}
                            onChange={(e) => setExamTitle(e.target.value)}
                        />
                        <Input
                            label="Content"
                            size="lg"
                            value={examContent}
                            onChange={(e) => setExamContent(e.target.value)}
                        />
                        <Input
                            label="Organization IDs (comma separated)"
                            size="lg"
                            value={organizationIds}
                            onChange={(e) => setOrganizationIds(e.target.value)}
                        />
                        <Input
                            label="Threshold"
                            size="lg"
                            value={threshold}
                            onChange={(e) => setThreshold(e.target.value)}
                        />
                        <Button onClick={() => openConfirmDialog('createExam')} className="mt-6">
                            Create Exam
                        </Button>
                    </form>
                </Card>

                <Card className="p-4 w-[40%]">
                    <Typography variant="h4" color="blue-gray">
                        Create Organization
                    </Typography>
                    <form className="mt-4 flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                        <Input
                            label="Username"
                            size="lg"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input
                            label="Organization Id"
                            size="lg"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        />
                        <Input
                            label="Email"
                            size="lg"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            label="Name"
                            size="lg"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            label="Password"
                            size="lg"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Input
                            label="Confirm Password"
                            size="lg"
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                        />
                        <Button onClick={() => openConfirmDialog('createOrganization')} className="mt-6">
                            Create Organization
                        </Button>
                    </form>
                </Card>
            </div>

            <Dialog open={showConfirmDialog} handler={setShowConfirmDialog}>
                <DialogHeader>Confirmation</DialogHeader>
                <DialogBody>
                    Are you sure you want to proceed?
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={() => setShowConfirmDialog(false)}>
                        Cancel
                    </Button>
                    <Button variant="gradient" color="green" onClick={handleConfirm}>
                        Confirm
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default AdminDashboard;
