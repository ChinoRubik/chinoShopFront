import axios from 'axios'
import config from './config'

export default {
    dashboard(token) {
        return axios.get(`${config.api_route}dashboard`,
        {headers: { 'auth-token' : token ,
        'Content-Type': 'application/json'}}
        ).then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    },

    // register(user) {
    //     return axios.post(`${config.api_route}auth/register`,
    //     user,
    //     {headers: { 'Content-Type': 'application/json'}}
    //     ).then((res) => {
    //         return res
    //     }).catch((error) => {
    //         return error.response
    //     });
    // }

}