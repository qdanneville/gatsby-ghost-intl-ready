const config = {
    ghostConfig: {
        production: {
            apiUrl: process.env.GHOST_API_URL || `http://localhost:2368`,
            contentApiKey: process.env.GHOST_CONTENT_API_KEY || `b67d68b48aedd3a9f87afd3cd5`,
        },
        development: {
            apiUrl: process.env.GHOST_API_URL || `http://localhost:2368`,
            contentApiKey: process.env.GHOST_CONTENT_API_KEY || `b67d68b48aedd3a9f87afd3cd5`,
        },
    }
}

module.exports = config