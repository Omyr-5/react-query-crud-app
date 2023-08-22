import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { Box } from '@mui/material';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AddUserModal from './AddUserModal';
import DeleteUser from './DeleteUser';
import NotFound from '../Pages/NotFound';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';


export default function CardComponent() {

    const [editStatus, setEditStatus] = useState(false)

    const navigate = useNavigate()
    const [pageNum, setPageNum] = useState(1)

    const { data: apiData = [], error, isLoading } = useQuery(['users', pageNum], async () => {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users?_limit=5&_page=${pageNum}`);
        return response.data;
    }, {
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });


    if (error) {
        return <div>{
            <NotFound />
        }</div>;
    }
    const prevBtnDisableFn = () => {

        if (pageNum <= 1) {
            return true
        }
        else {
            return false
        }
    }

    const handleEditStatusfun = (status) => {
        setEditStatus(status)
    }




    const nextBtnDisableFun = () => {
        return Array.isArray(apiData) && apiData.length === 0;
    };
    return (
        <>
            {isLoading ? <CircularProgress size={100} sx={{
                color: 'yellow',
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
            }} /> : <Box width="60vw" display="flex" height="82vh" flexDirection="column" alignItems="center" bgcolor="#ededed" margin="auto" position="static" border="2px solid black" overflow="auto">
                <Box position="absolute" top="70px" marginBottom="10px" display="flex">
                    <Button sx={{ marginRight: "20px" }} variant='contained' color='secondary' onClick={() => {
                        setPageNum(pageNum - 1)

                    }}
                        disabled={prevBtnDisableFn()}
                    >Prev</Button>
                    <Button variant='contained' disabled={nextBtnDisableFun()} onClick={() => {
                        setPageNum(pageNum + 1)

                    }}>Next</Button>
                    <Box border="2px solid green" color="#ffff" bgcolor='green' sx={{ marginLeft: "550px" }}>
                        <AddUserModal />
                    </Box>


                </Box>
                <h1>Home</h1>
                <h1>Page # {pageNum}</h1>
                {
                    Array.isArray(apiData) && apiData.map((post) => {
                        return (
                            <Box key={post.id} marginBottom="20px" border="2px solid black" width="500px" >
                                <Card sx={{ maxWidth: 845 }} >
                                    <CardActionArea onClick={() => { navigate(`view-post/${post.id}`) }}>
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" marginBottom="30px" marginTop="20px">

                                                <span><strong>User ID </strong>{post?.id}</span>
                                                <span><strong>User name </strong>{post.username}</span>
                                            </Box>

                                            <Typography gutterBottom variant="h5" component="div">
                                                <span><strong>Title</strong></span> {post.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <span><strong>Email:</strong></span> {post.email}
                                            </Typography>
                                            {/* edit status */}
                                            {/* <Typography variant="body2" color="text.secondary">
                                                <span><strong>Edit Status:</strong></span> {post.editStatus === true ? "true" : "false"}
                                            </Typography> */}
                                            {/* address */}
                                            {/* <Typography variant="body2" color="text.secondary">
                                                <span><strong>Address:</strong></span> {post?.address?.street},{post?.address?.city}
                                            </Typography> */}
                                            {post.editStatus === true && <Box bgcolor="#E0E0E0" margin="10px" display='flex' justifyContent="center" width="30px" borderRadius="5px" height="30px" style={{ visibility: post.editStatus === true ? 'visible' : 'hidden' }}>
                                                <EditIcon color='white' />
                                            </Box>
                                            }
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions>
                                        <Box >
                                            <AddUserModal isUpdate={true} id={post.id} handleEditStatusfun={handleEditStatusfun} />
                                        </Box>
                                        <Box zIndex="5" marginLeft="20px">
                                            <DeleteUser userid={post.id} />
                                        </Box>
                                    </CardActions>
                                </Card>
                            </Box>
                        )
                    })
                }

            </Box >}
        </>
    );
}