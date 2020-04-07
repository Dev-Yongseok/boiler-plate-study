import React, { useEffect } from 'react'
import Axios from 'axios'
import { useDispatch} from 'react-redux'
import {auth} from '../_actions/user_action'

export default function (SpecificComponent, option, adminRoute = null){

    /* option desc */
    // null   =>   아무나 출입이 가능한 페이지
    // true   =>   로그인 한 유저만 출입 가능한 페이지
    // false  =>   로그인 한 유저 출입 불가능 (로그인, 회원가입)

    /* adminRoute desc ( default = null )*/
    // true   =>   관리자만 접속 가능
    // false  =>   유저도 접속 가능

    function AuthenticationCheck(props){

        const dispatch = useDispatch();

        useEffect(() => {

           dispatch(auth()).then(response => {
               console.log("auth check...")
               console.log(response)

              
               if(!response.payload.isAuth){
                    // 로그인 하지 않은 상태
                    if(option){
                        props.history.push('/login')
                    }
               }else{
                   // 로그인 한 상태
                    if(adminRoute && !response.payload.isAdmin){
                        props.history.push('/')
                    }else{
                        if(option === false){
                            props.history.push('/')
                            alert("로그인 된 상태로 로그인하거나 회원가입을 하실수 없습니다.")
                        }
                    }
               }
           })
            
        }, [])
    
        return(
            <SpecificComponent />
        )

    }

    return AuthenticationCheck
}