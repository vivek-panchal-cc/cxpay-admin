 import axios from 'axios';
 
 import { authHeader } from '../src/_helpers/auth-header';

 const baseURL = process.env.REACT_APP_API_URL

const instance= axios.create({
    baseURL:`${baseURL}`,
    headers: authHeader()
})





export default instance;