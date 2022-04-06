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

    getImages(uuid) {
        return axios.get(`${config.api_route}dashboard/public/getImages/${uuid}`,
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

    updateProduct(data, uuid) {
        return axios.put(`${config.api_route}dashboard/updateProduct/${uuid}`,
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

    deleteProduct(uuid) {
        return axios.delete(`${config.api_route}dashboard/deleteProduct/${uuid}`,
        {headers: { 'auth-token': store.state.token }}
        ).then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    },

    getSizes() {
        return axios.get(`${config.api_route}dashboard/getSizes`,
        {headers: { 'auth-token' : store.state.token ,
        'Content-Type': 'application/json'}}
        ).then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    },

    addSale(data) {
        return axios.post(`${config.api_route}dashboard/addSale`,
        data,
        {headers: { 'auth-token' : store.state.token ,
        'Content-Type': 'application/json'}}
        ).then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    },

    getSale(user_uuid) {
        return axios.get(`${config.api_route}dashboard/getSale/${user_uuid}`,
        {headers: { 'auth-token' : store.state.token ,
        'Content-Type': 'application/json'}}
        ).then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    },

    getSaleByUuid(uuid) {
        return axios.get(`${config.api_route}dashboard/getSaleByUuid/${uuid}`,
        {headers: { 'auth-token' : store.state.token ,
        'Content-Type': 'application/json'}}
        ).then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    },

    updateSale(uuid, data) {
        return axios.put(`${config.api_route}dashboard/updateSale/${uuid}`,
        data,
        {headers: { 'auth-token' : store.state.token ,
        'Content-Type': 'application/json'}}
        ).then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    },

    deleteSale(uuid) {
        return axios.delete(`${config.api_route}dashboard/deleteSale/${uuid}`,
        {headers: { 'auth-token' : store.state.token ,
        'Content-Type': 'application/json'}}
        ).then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    },

    deleteAllCart(user_uuid) {
        return axios.delete(`${config.api_route}dashboard/deleteAllCart/${user_uuid}`,
        {headers: { 'auth-token' : store.state.token ,
        'Content-Type': 'application/json'}}
        ).then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    },

    addAddress(data) {
        return axios.post(`${config.api_route}dashboard/addAddress`,
        data,
        {headers: { 'auth-token' : store.state.token ,
        'Content-Type': 'application/json'}}
        ).then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    },

    getAddress(sale_uuid) {
        return axios.get(`${config.api_route}dashboard/getAddress/${sale_uuid}`,
        {headers: { 'auth-token' : store.state.token ,
        'Content-Type': 'application/json'}}
        ).then((res) => {
            return res
        }).catch((error) => {
            return error.response
        });
    },

    updateAddress(sale_uuid, data) {
        return axios.put(`${config.api_route}dashboard/updateAddress/${sale_uuid}`,
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