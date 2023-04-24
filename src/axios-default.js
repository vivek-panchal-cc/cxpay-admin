 import axios from 'axios';
 
 import { authHeader } from '../src/_helpers/auth-header';
 

const instance= axios.create({
    baseURL:`${process.env.REACT_APP_API_URL}`,
    headers: authHeader()
})





export default instance;