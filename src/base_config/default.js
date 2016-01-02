module.exports = {
    server: {
        httpPort: 80,
        httpsPort: 443,
        ssl: {
            keyPath: null,
            certificatePath: null
        }
    },
    database: {
        sync: false
    },
    dataSources: {
        main: {
            type: "sqlite3",
            host: null,
            database: "superpaint",
            username: null,
            password: null,
            filename: "superpaint.db",
            charset: "utf8"
        }
    },
    businessRules: {
        drawing: {
            uploadLimits: {
                imageSizes: [
                    { width: 1280, height: 720 }
                ],
                fileSize: { min: 128, max: 1048576 },
                countLimit: 100000
            }
        }
    }
};
