const redis = require('redis')
require('dotenv').config()
const Redis_Port = process.env.Redis_Port || 6379
const client = redis.createClient(Redis_Port)

const setCache = (key, value, expire) => {
    client.setex(key, expire, value)
}

const getCache = (req, res, next) => {
    const key = req.url
    client.get(key, (err, data) => {
        if (err) next()
        if(data !== null) {
            res.json(JSON.parse(data))
        } else {
            next()
        }
    })
    
}
const getSingleCache = (req, res, next) => {
    const params = Object.keys(req.params)
    const key = req.params[params[0]]
    client.get(key, (err, data) => {
        if (err) next()
        if(data !== null) {
            res.json(JSON.parse(data))
        } else {
            next()
        }
    })
    
}



module.exports = {setCache, getSingleCache, getCache}