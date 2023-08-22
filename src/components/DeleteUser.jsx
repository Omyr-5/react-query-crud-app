import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';


export default function DeleteUser({ userid }) {
    const queryClient = useQueryClient();

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteMutation = useMutation(async () => {
        await axios.delete(`http://localhost:4000/users/${userid}`);
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries("users");
            handleClose();
        },
        onError: (error) => {
            console.error("Error deleting user", error);
        }
    });

    return (
        <div>
            <Button variant="contained" color="error" onClick={handleClickOpen}>
                <DeleteIcon />
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Delete User"}</DialogTitle>
                <DialogContent sx={{ width: "500px" }}>
                    <DialogContentText id="alert-dialog-description">
                        Do you want to delete the user?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined" color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            deleteMutation.mutate(); // Trigger the delete mutation
                        }}
                        variant="contained"
                        color="error"
                        autoFocus
                        disabled={deleteMutation.isLoading}
                    >
                        {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
