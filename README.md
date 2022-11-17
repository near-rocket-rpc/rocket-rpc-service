# Rocket RPC Service
A backend service written in node.js that serves as a RPC proxy. This service handles all RPC calls from clients and forwards them to actual RPC nodes based on their subscirption level. It also charges the clients with RPC tokens for using premium RPC node.

## Setup
To run this service you first need to setup a Postgres instance and config NEAR Lake.     
For NEAR Lake config please refer to: https://github.com/near/near-lake-framework-js#near-lake-framework-js

## Run in debug mode
- `npm run start:debug`

## Run in production mode
- `npm start`       

This will run the service with pm2 in background.
