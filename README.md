# Fabric bootcamp

This project contains the webapp that we will be spinnnig and connecting to the Hyperledger Fabric network we will be deploying on [Chainstack](https://chainstack.com).

There are two parts of this project, a [web app](https://chainstack.com/deploy-a-hyperledger-fabric-v2-web-app-using-sdk-for-node-js/) and a [contract](https://docs.chainstack.com/tutorials/fabric/universal-basic-income-opt-in-chaincode#universal-basic-income-opt-in-chaincode), and each part is contained in its own respective folder.

## Chaincode

- Includes a sample JavaScript chaincode with 3 transactions:
  - optIn
  - optOut
  - querySSN

See also the [chaincode tutorial](https://docs.chainstack.com/tutorials/fabric/universal-basic-income-opt-in-chaincode#universal-basic-income-opt-in-chaincode).

## Quick start
1. Setup environment
    - Install Node.js 12.13.1 or higher.
    - Install NPM 6 or higher.
    - Sudo bash downloadPeerBinary.sh
    - Replace `ORDERER_NAME`, `PEER_NAME` and `MSP_ID` in the `.env` file.
1. Setup client
    - cd webapp/client
    - npm i
    - npm run build
1. Setup Server
    - cd webapp/server
    - npm i
    - npm run start

See also the [web app tutorial](https://chainstack.com/deploy-a-hyperledger-fabric-v2-web-app-using-sdk-for-node-js/).
