module.exports = {
    server: {
        httpPort: 80,
        httpsPort: 443,
        useHttps: false,
        // SSL settings for HTTPS
        ssl: {
            // Path to a file containing the private key.
            keyPath: null,
            // Path to a file containing the certificate.
            certificatePath: null
        }
    },
    database: {
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
    policies: {
        drawing: {
            uploadLimits: {
                imageSize: {
                    width: { min: 256, max: 1920 },
                    height: { min: 256, max: 1080 },
                },
                fileSize: { min: 128, max: 1048576 },
                countLimit: 100000
            }
        }
    }
};
