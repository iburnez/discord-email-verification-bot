
module.exports = {
    timestamp : function() {
        const date = new Date(Date.now())
        console.log(date)
        const year    = date.getFullYear()
        const month   = date.getMonth()
        const day     = date.getDay()
        const hour    = date.getHours()
        const minute  = date.getMinutes()
        const seconds = date.getSeconds()
        return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`
    }
}