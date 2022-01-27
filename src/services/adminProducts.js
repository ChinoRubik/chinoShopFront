import axios from 'axios'
import config from './config'
import store from '../store/index'

export default {
    getCategories() {
        return axios.get(`${config.api_route}dashboard/public/getcategories`,
        {headers: { 'auth-token' : store.state.token ,
        'Content-Type': 'application/json'}}
        ).then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    },
    getProducts() {
        return axios.get(`${config.api_route}dashboard/public/getproducts`,
        ).then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    },

    addProduct(data) {
        return axios.post(`${config.api_route}dashboard/add`,
        data,
        {headers: { 'auth-token' : store.state.token ,
        'Content-Type': 'application/json'}}
        ).then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    },
    
    addCategory(data) {
        return axios.post(`${config.api_route}dashboard/addcategory`,
        data,
        {headers: { 'auth-token': store.state.token }}
        ).then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    },

        
    deleteCategory(uuid) {
        return axios.delete(`${config.api_route}dashboard/deletecategory/${uuid}`,
        {headers: {'auth-token': store.state.token }}
        ).then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    },

    addImage(data) {
        return axios.post(`${config.api_route}dashboard/upload-images`,
        data,
        {headers: { 'auth-token' : store.state.token }})
        .then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    },
    // getImage(image) {
    //     return axios.get(`${config.api_route}dashboard/getImages/${image}`,
    //     {headers: { 'auth-token' : store.state.token }})
    //     .then((res) => {
    //         return res
    //     }).catch((error) => {
    //         return error.response
    //     });
    // },

    getProduct(uuid) {
        return axios.get(`${config.api_route}dashboard/public/detailProduct/${uuid}`,
        {headers: { 'auth-token' : store.state.token }})
        .then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    },

    addToCart(data) {
        return axios.post(`${config.api_route}dashboard/addToCart`,
        data,
        {headers: { 'auth-token': store.state.token }}
        ).then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    },

    getCart(user_uuid) {
        return axios.get(`${config.api_route}dashboard/getCart/${user_uuid}`,
        {headers: { 'auth-token': store.state.token }}
        ).then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    },

    deleteFromCart(product_uuid,size) {
        return axios.delete(`${config.api_route}dashboard/deleteFromCart/${product_uuid}/${size}`,
        {headers: { 'auth-token': store.state.token }}
        ).then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    },
}