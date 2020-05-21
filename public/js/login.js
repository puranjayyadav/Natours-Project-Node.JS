import axios from 'axios'
import {showAlert} from './alert';

export const login = async(email, password) => {
    console.log(email, password)
    try {

        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                email,
                password
            }
     
    })
        if(res.data.status === 'success'){
            showAlert('success','Logged In Succesfully')
            window.setTimeout(()=>{
                location.assign('/');
            } ,1500);
        }
}
catch(err) {
    showAlert('error',err.response.data.message);
    
}
};

export const logout = async () =>{
    try{
        const res = await axios({
            method:'GET',
            url: 'http://127.0.0.1:3000/api/v1/users/logout'
        });
        if((res.data.status = 'success')) location.reload(true) //Does a forced reload from the server rather than from web browser cache
    }catch(err){
        showAlert('errs', 'Error logging out! Try again')
    }
}
