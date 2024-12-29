import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemSuffix,
  Card,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Alert,
} from '@material-tailwind/react';
import config from '../../config';
import TruncatedShare from '../Utils/TruncatedShare';



function TrashIcon() {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5"
    >
      <path
        fillRule="evenodd"
        d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
        clipRule="evenodd"
        />
    </svg>
  );
}

export function OrganizationList() {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState(null);
  
  const confirmDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      handleDelete(id);
    }
  };

  useEffect(() => {
    async function fetchOrganizations() {
      try {
        const response = await fetch(`${config.baseURL}/exam/organizations`);
        const data = await response.json();
        setOrganizations(data);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    }

    fetchOrganizations();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${config.baseURL}/exam/organizations/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAlert({ type: 'success', message: 'Organization deleted successfully!' });
        setOrganizations(organizations.filter(org => org._id !== id));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete organization');
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  };
  const handleOpen = () => setOpen(!open);
  
  const handleListItemClick = (organization) => {
    setSelectedOrganization(organization);
    handleOpen();
  };

  const closeModal = () => {
    handleOpen();
    setSelectedOrganization(null);
  };

  return (
    <div className=" bg-white text-black p-8">
      {alert && (
        <Alert onClose={() => setOpen(false)} color='green' className={`alert alert-${alert.type}`}>
          {alert.message}
        </Alert>
      )}
      <br />
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Registered Organizations
      </Typography>
      <Card className="w-96">
        <List>
          {organizations.map((organization) => (
            <ListItem
              key={organization._id}
              ripple={false}
              className="py-1 pr-1 pl-4"
              onClick={() => handleListItemClick(organization)}
            >
              {organization.name}
              <ListItemSuffix>
                <IconButton
                  variant="text"
                  color="blue-gray"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(organization.id);
                  }}
                >
                  <TrashIcon />
                </IconButton>
              </ListItemSuffix>
            </ListItem>
          ))}
        </List>
      </Card>

      <Dialog size="lg" open={open} onClick={closeModal}>
        <DialogHeader onClick={closeModal}>
          {selectedOrganization?.name}
        </DialogHeader>
        <DialogBody>
          {/* <Typography variant="h6" color="blue-gray">
            ID: {selectedOrganization?._id}
          </Typography> */}
          <Typography variant="h6" color="blue-gray">
            ID: {selectedOrganization?.id}
          </Typography>
          <TruncatedShare share={selectedOrganization?.share} />
        </DialogBody>
        <DialogFooter>
          <Button color="red" onClick={closeModal}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
