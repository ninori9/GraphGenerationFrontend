# Hyperledger Fabric Transaction Conflict Graph Generation Frontend

This project is written in JavaScript, uses React, Vis.js and TailwindCSS, and serves as the user interface for an application that generates transaction conflict graphs (also called precedence graphs or serializability graphs) from transactions of the Hyperledger Fabric blockchain.

This app should be run together with the corresponding [backend](https://github.com/ninori9/GraphGenerationBackend) if graphs should be generated using transaction data extracted from the Fabric blockchain.

Previously downloaded graphs can be visualized using the frontend only.

## How to use

If you start the frontend for the first time, run:

### `npm install`

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
If the Hyperledger Fabric blockchain is running on a remote cluster, this project should also be installed on there.
You may want to use `ssh -i ~/.ssh/id_rsa -L 3006:localhost:3006 <remote username><remote IP address>` to connect to the remote instance via SSH and run the app there.
Open [http://localhost:3006](http://localhost:3006) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
The app is ready to be deployed!
