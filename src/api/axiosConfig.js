import axios from 'axios'

export const createAPI = (baseURL) => {
  return axios.create({
    baseURL,
    timeout: 10000, // délai d'attente en millisecondes
  })
}

export default createAPI
