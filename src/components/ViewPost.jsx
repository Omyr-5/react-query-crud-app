import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { Box } from '@mui/material';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { } from 'react-router-dom'

export default function ViewPost() {

    const { userId } = useParams()
    // const { id, ...rest } = useParams()
    // console.log(rest.PageId, 'PageId')
    // console.log(rest.PostId, 'PostId')
    const userIdint = parseInt(userId)
    const navigate = useNavigate()


    // console.log("View Page Id", postId)


    // const API_KEY = process.env.REACT_APP_CRUD_APP_API_KEY;
    // const API_KEY = "73ce038b3fe85d489e0c06d5c9edaef03efb2c451a78082f8cf64380117c3dc4";
    const { data, error, isLoading } = useQuery(['users', userIdint], async () => {
        const response = await axios.get(`http://localhost:4000/users/${userIdint}`);
        return response.data;
    }, {
        keepPreviousData: true
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }
    return (
        <>
            <h1>View</h1>
            <Box width="60vw" display="flex" height="82vh" flexDirection="column" alignItems="center" bgcolor="#ededed" margin="auto" position="static" border="2px solid black" overflow="auto">

                <h1>View Details</h1>
                <h1>Page # {userIdint}</h1>
                <Box marginBottom="20px" border="2px solid black" width="500px" >
                    <Card sx={{ maxWidth: 845 }} >
                        <CardActionArea>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" marginBottom="30px" marginTop="20px">

                                    <span><strong>User ID: {data.id}</strong></span>
                                    <span><strong>Username: {data.username}</strong></span>
                                </Box>

                                <Typography gutterBottom variant="h5" component="div">
                                    <span><strong>Title:   </strong>{data.name}</span>

                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <span><strong>Email: </strong>{data.email}</span>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <span><strong>Address:</strong></span> {data?.address?.street},{data?.address?.city}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Button size="small" color="primary" variant='contained' onClick={() => {
                                navigate("/")
                            }}>
                                Go back
                            </Button>

                        </CardActions>
                    </Card>
                </Box>

            </Box>
        </>
    );
}