import React, {useState, useEffect} from 'react';
import { Button, Grid, Typography, TextField } from '@material-ui/core';

import api from './api/api';

const listUrl = "/task-list"
const createUrl = "/task-create";


// function getCookie(name) {
//     var cookieValue = null;
//     if (document.cookie && document.cookie !== '') {
//         var cookies = document.cookie.split(';');
//         for (var i = 0; i < cookies.length; i++) {
//             var cookie = cookies[i].trim();
//             // Does this cookie string begin with the name we want?
//             if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                 break;
//             }
//         }
//     }
//     return cookieValue;
// }
//     var csrfCookie = getCookie('XSR-TOKEN');



export default function List() {

    const [task, setTask] = useState({
        activeItem : {
            id : null,
            title : "",
            completed : false
        }, editing : false
    });
    const handleChange = (e, edit=false) => {
        let taskNow = {
            id : null,
            title : e.target.value,
            completed : false
        } 
        setTask({
            activeItem : taskNow,
            editing : edit
        });
    }
    // create a task (and edit also)
    const handleSubmit = async (newTask) => {
        if(newTask.editing == false) {
            await api.post(createUrl, {
                title : newTask.activeItem.title
            }).then(res => console.log(res.data))
            .catch(err => console.log(err))
            console.log(newTask.editing)
        } else {
                await api.put(updateURL, {
                title : newTask.activeItem.title
            })
            
        }

    }

    // fetching data 
    const [lists, setLists] = useState([]);
    const fetchTask = async () => {
        try {
            const response = await api.get(listUrl);
            // console.log(response.data)
            setLists(response.data);
        } catch (error) {
            console.log(error.response.data)
        }
    }
    useEffect(() => {
        fetchTask()
    }, [lists])


    //delete data
    const handleDelete = (task) => {
        const taskID = task.id;
        api.delete(`/task-delete/${taskID}`)
    }


    //edit data
    const [updateURL, setUpdateURL] = useState("");
    const editing = (list) => {
        const listID = list.id;
        console.log(listID)
        setUpdateURL(`/task-update/${listID}`);
        setTask({
            activeItem : list,
            editing : true
        })
    }

    // strike the task if it's done and inverse
    
    const handleDone = async (list) => {
        const listID = list.id;
        const listCOMPLETED = !list.completed;
        await api.put(`/task-update/${listID}`, {
            id : listID,
            title : list.title,
            completed : listCOMPLETED
        })
        console.log(listCOMPLETED)
    }

    return (
        <>
        
        <Grid container justifyContent='center' style={{ marginLeft : "4%" }}>
            <Grid item xs={4}><TextField label="What should we do?" type="text" value={task.activeItem.title} onChange={(e) => handleChange(e, task.editing)}/></Grid>
            {/* {console.log(task)}     */}
            <Grid item xs={3}><Button  style={{ width : "50%" }} variant="contained" color="primary" onClick={() => handleSubmit(task)}>SUBMIT</Button></Grid>
        </Grid>
        <div style={{ marginTop : "30px" }}>
            { lists.map((list, index) => {
                return (
                    <>
                    <Grid container justifyContent='center' spacing={2} key={index}> 
                        <Grid item xs={4}> 
                            <div onClick={() => handleDone(list)} style={{ cursor : "pointer" }}>
                               {/* {console.log(list.completed)} */}
                                {list.completed == false ? 
                                    (<span><Typography variant="h5">{list.title}</Typography></span>)
                                    : (<strike><Typography variant="h5">{list.title}</Typography></strike>)
                                }
                            </div>
                            
                        
                        </Grid>
                        <Grid item xs={2}>
                            <Button color='default' onClick={() => editing(list)}>EDIT</Button>
                            <Button color='secondary' onClick={() => handleDelete(list)}>DELETE</Button>
                        </Grid>
                    </Grid>
                    <div style={{ padding : "0 25%", width : "45%" }}>
                        <hr/>
                    </div>

                    </>
                    
                )
            })}

        </div>
        </>
    )
}
