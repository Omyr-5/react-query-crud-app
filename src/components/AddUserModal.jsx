import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';











// yup schema
const schema = yup.object().shape({
    name: yup.string().required("Name is required!"),
    username: yup.string().required("username is Required!"),
    email: yup.string().email("Invalid Formate").required("Email is required!")
})

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function AddUserModal({ isUpdate, id, handleEditStatusfun }) {
    const [disabledSubmitBtn, setDisabledSubmitBtn] = useState(false)


    const { handleSubmit, control, formState, reset, setValue } = useForm({
        defaultValues: {
            name: "",
            username: "",
            email: "",
            editStatus: false
        },
        resolver: yupResolver(schema)

    })
    const { errors } = formState
    // use states 
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true)
    };


    const idInt = parseInt(id)
    // post data function
    const postDataFun = async (postData) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/users`, postData)
            return res.data

        } catch (error) {
            console.log("Error while posting Data", error)
            throw new Error(error.message)

        }
    }
    // post data function
    const updateDataFun = async (postData) => {
        try {
            const res = await axios.put(`${process.env.REACT_APP_BASE_URL}/users/${idInt}`, postData)
            return res.data
        } catch (error) {
            console.log("Error while posting Data", error)
            throw error

        }
    }


    // usemutation logic to post data
    const queryClient = useQueryClient()


    const mutation = useMutation(isUpdate ? "updateUser" : "addNewUser", isUpdate ? updateDataFun : postDataFun, {
        onSuccess: () => {
            isUpdate ? queryClient.invalidateQueries(["users"]) : queryClient.invalidateQueries("users")
            setOpen(false)
            setDisabledSubmitBtn(false)
            isUpdate && handleEditStatusfun(true)
        },
        onError: (error) => {
            console.log("Mutation Failed: ", error)
        }
        , onMutate: () => {
            setDisabledSubmitBtn(true)
        }
    })
    const fetchUpdateDataFun = async () => {
        try {
            const id = parseInt(idInt)
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${id}`);
            reset(response.data);
            return response.data;
        } catch (error) {
            console.log("Error from update fun", error);
        }
    };

    // fetch user data for update
    // eslint-disable-next-line
    const { data: userData, error: userError, isError: isUserError, isLoading: isUserLoading } = useQuery(
        ['updateUser', idInt],
        fetchUpdateDataFun,
        {
            enabled: !!id,
            keepPreviousData: true,
            onError: (error) => {
                console.log("Error from fetchUpdateDataFun", error.message);
            },
            onSuccess: () => {
                handleClose()
            }
        }
    );

    // validation useform hook

    if (mutation.isError) {
        console.log("error on posting data", mutation.isError, mutation.error)
    }

    const handleClose = () => setOpen(false);

    // handle submit function

    const onSubmitFun = (data) => {
        if (isUpdate) {
            data.editStatus = true;
            mutation.mutate(data);
        } else {
            mutation.mutate(data);
        }
        console.log(data.editStatus, 'data');
    };


    return (
        <div>

            <Button onClick={handleOpen} color='warning' variant='contained' >{isUpdate ? <EditIcon /> : "Add User"}</Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <form onSubmit={handleSubmit(onSubmitFun)}>
                            <Typography id="transition-modal-title" variant="h6" component="h1" sx={{ marginBottom: "20px" }}>
                                {isUpdate ? "Update " + parseInt(id) : "Add New"} User
                            </Typography>
                            <Box display="flex" flexDirection="column" >
                                <Controller
                                    render={({ field, formState }) => (
                                        <TextField
                                            {...field}
                                            label="Name"
                                            error={!!formState.errors?.name}
                                        />
                                    )}
                                    name="name"
                                    control={control}
                                    defaultValue=""
                                />
                                <p style={{ color: "red" }}>{errors.name?.message}</p>
                                <Controller
                                    render={({ field, formState }) => (
                                        <TextField
                                            label="Username"
                                            {...field}
                                            sx={{ marginBottom: "20px" }}
                                            error={!!formState.errors?.username}
                                        />

                                    )}
                                    control={control}
                                    name='username'
                                    defaultValue=""
                                />
                                <p style={{ color: "red" }}>{errors.username?.message}</p>
                                <Controller
                                    render={({ field, formState }) => (
                                        <TextField
                                            {...field}
                                            label="Email"
                                            error={!!formState.errors?.email}
                                        />
                                    )}
                                    name="email"
                                    control={control}
                                    defaultValue=""
                                />
                                <p style={{ color: "red" }}>{errors.email?.message}</p>
                            </Box>
                            <Box>
                                <Button variant='contained' sx={{ height: "50px" }} disabled={disabledSubmitBtn} color='success' fullWidth type='submit'>
                                    {mutation.isLoading ? (
                                        <CircularProgress size={24} sx={{
                                            color: 'yellow',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            marginTop: '-12px',
                                            marginLeft: '-12px',
                                        }} />
                                    ) : (
                                        isUpdate ? "Update" : "Add user"
                                    )}
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Fade>
            </Modal>
        </div >
    );
}