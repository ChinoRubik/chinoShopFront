import axios from 'axios'
import config from './config'
import store from '../store/index'

export default {
    updateUser(data, uuid) {
        return axios.put(`${config.api_route}user/updateUser/${uuid}`,
        data,
        {headers: { 'auth-token' : store.state.token ,
        'Content-Type': 'application/json'}}
        ).then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    },
}