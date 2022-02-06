import axios from 'axios'
import config from './config'
import store from '../store/index'

export default {
    dashboard() {
        return axios.get(`${config.api_route}dashboard`,
        {headers: { 'auth-token' : store.state.token ,
        'Content-Type': 'application/json'}}
        ).then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    },

    login(user) {
        return axios.post(config.api_route+'auth/login',
        user, {headers: {'Content-Type': 'application/json'}}
      ).then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    }

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