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
    - (string) **httpPort:** HTTP port to listen on.
    - (string) **httpsPort:** HTTPS port to listen on.
    - **ssl:** SSL configuration.
        - (string) **keyPath:** Path to a file containing the private key for the public server certificate.
        - (string) **certificatePath:** Path to a file to use as the public server certificate.
    - **database:**
        - (bool) **createIfNeeded:** Create the database and/or missing tables if needed.
    - **dataSources:**
        - (a name of your choice)
            - (string) **type:** Possible values: `sqlite`.
            - (string) **database:** Database name.
            - (string) **username:** Database username.
            - (string) **password:** Database password.
        - ...
    - **businessRules:** Business/Application rules.
        -  **drawing:** Drawings produced by SuperPaint and uploaded.
            -  **upload:** Rules for uploaded drawings.
                -  **limits:** Limitations.
                    -  (int) **minDimensions:** Minimum image dimensions.
                    -  (int) **maxDimensions:** Maximum image dimensions.
                    -  (int) **minFileSize:** Minimum file size.
                    -  (int) **maxFileSize:** Maximum file size.
