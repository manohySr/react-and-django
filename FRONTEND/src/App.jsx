import React from 'react';
import List from './List';
import { Container } from '@material-ui/core';


const App = () => {
    return (
        <>
        <Container style={{ padding : '10% 0' }}>
            <List />
        </Container>
        </>
    );
}

export default App;
