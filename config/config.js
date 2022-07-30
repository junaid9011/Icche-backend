module.exports = getDB = () => {

    if (process.env.NODE_ENV === "dev") {
        return process.env.DB_LOCAL_URL
    }
    return process.env.DB_URL

}


