import React , { useEffect} from 'react'
import axios from 'axios';

function LandingPage() {

    useEffect(() => {
        axios.get('/api/hello')
        .then( response => {console.log(response)})

    }, [])

    return (
        <div style={
            { display : 'flex' , justifyContent : 'center', alignItems : 'center',
                width : '100%' , height : '100vh' , flexDirection : "column"
        }}>
           
            <h1>시작 페이지</h1>
            <button><a href ="/login">LOGIN</a></button>
            <br/>
            <button><a href ="/register">SIGN-UP</a></button>
        </div>
    )
}

export default LandingPage
