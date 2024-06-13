import axios from 'axios'
const instance =axios.create({
    baseURL:'https://sabuk.strathmore.edu/api',
    headers:{
        "Content-Type":"application/json"

    }
})
export default instance