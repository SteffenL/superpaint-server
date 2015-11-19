# SuperPaint Server

This is the server application containing services meant to be consumed by the SuperPaint client application.

## Running the server

1. Configure the application (see below).
2. Run `node app`.

## Configuration

Copy the base configuration from `app/config/base` to `config`, then edit the copied files.

There is a `default` configuration, and one for each type of environment, e.g. `dev` (development) and `prod` (production). You need more environments, just make new files.

You must currently set the data source and environment you plan to use inside `app/main.js`.

### Configuration format

- **server:**
    - **httpPort:** HTTP port to listen on.
    - **httpsPort:** HTTPS port to listen on.
    - **ssl:** SSL configuration.
        - **keyPath:** Path to a file containing the private key for the public server certificate.
        - **certificatePath:** Path to a file to use as the public server certificate.
    - **dataSources:** Your data sources.
        - (a name of your choice)
            - **database:** Database name.
            - **username:** Database username.
            - **password:** Database password.
            - **options:** Additional options (see [documentation for Sequelize](http://docs.sequelizejs.com/en/latest/api/sequelize/#new-sequelizedatabase-usernamenull-passwordnull-options)).
        - ...
    - **businessRules:** Business/Application rules.
        -  **drawing:** Drawings produced by SuperPaint and uploaded.
            -  **upload:** Rules for uploaded drawings.
                -  **limits:** Limitations.
                    -  **minDimensions:** Minimum image dimensions.
                    -  **maxDimensions:** Maximum image dimensions.
                    -  **minFileSize:** Minimum file size.
                    -  **maxFileSize:** Maximum file size.
