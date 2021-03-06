import React , { useEffect} from 'react'
import axios from 'axios';
import { withRouter} from 'react-router-dom'

function LandingPage(props) {

    const onClickHandler = () => {
        axios.get('/api/users/logout')
            .then(response => {
                if(response.data.success){
                    props.history.push("/")
                    alert("로그아웃 되었습니다.")
                }else{
                    alert("이미 로그아웃 하였거나 로그아웃에 실패했습니다.")
                }
            })
    }

    return (
        <div style={
            { display : 'flex' , justifyContent : 'center', alignItems : 'center',
                width : '100%' , height : '100vh' , flexDirection : "column"
        }}>
           
            <h1>시작 페이지</h1>
            <button><a href ="/login">LOGIN</a></button>
            <br/>
            <button onClick={onClickHandler}>LOGOUT</button>
            <br/>
            <button><a href ="/register">SIGN-UP</a></button>
        </div>
    )
}

export default withRouter(LandingPage)
