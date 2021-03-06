# Chainstack Blockchain Bootcamp: Build Enterprise Applications with Hyperledger Fabric v2

This project contains the web app that we will be spinnnig and connecting to the Hyperledger Fabric network deployed on [Chainstack](https://chainstack.com).

This is a two-part project:

* [Web app](https://chainstack.com/deploy-a-hyperledger-fabric-v2-web-app-using-sdk-for-node-js/) in the `webapp` directory.
* [Contract](https://docs.chainstack.com/tutorials/fabric/universal-basic-income-opt-in-chaincode#universal-basic-income-opt-in-chaincode) in the `contract` directory.

## Contract

The contract is a sample JavaScript chaincode with 3 transactions:

* `optIn`
* `optOut`
* `querySSN`

For details, see the [chaincode tutorial](https://docs.chainstack.com/tutorials/fabric/universal-basic-income-opt-in-chaincode#universal-basic-income-opt-in-chaincode).

## Prepare for the bootcamp

### Prerequisites

* Linux or macOS
* Node.js 12.13.1 or higher
* NPM 6 or higher

### Set up your environment (required)

From the project root directory, download the Hyperledger Fabric peer binaries by running:

* Linux `bash downloadPeerBinary.sh linux`
* macOS `bash downloadPeerBinary.sh`

Note that downloading the binaries will take some time.

In the `webapp/server/.env` file, replace the `ORDERER_NAME`, `PEER_NAME`, and `MSP_ID` variables with:

* `ORDERER_NAME` — the orderer name of the network you deployed your peer in. To access the orderer name, in the [Chainstack platform](https://console.chainstack.com/), from Hyperledger Fabric network, select **Service nodes** tab and click on **Orderer** to access its details page. On the details page, copy the **Orderer name** value.
* `PEER_NAME` — the name of the peer that you deployed. To access the peer name, in the [Chainstack platform](https://console.chainstack.com/), from Hyperledger Fabric network, select **Peer nodes** tab, click on your peer name to access its details page. On the details page, copy the **Peer name** value.
* `MSP_ID` — the Membership Service Provider identity (MSP ID). To access the MSP ID, in the [Chainstack platform](https://console.chainstack.com/), from Hyperledger Fabric network, click **Details** link to open network details modal. On the details modal, copy the **MSP ID** value.

You are now ready for the bootcamp.

### Set up your environment (optional)

Additionally, you may want to prepare the web app client and server in advance—although this is not required, as this will be done during the bootcamp.

1. Export the [required files](./webapp/certs/README.md) from [Chainstack platform](https://console.chainstack.com/).

1. Set up the web app client:

   ```sh
   cd webapp/client
   npm i
   npm run build
   ```

1. Set up the web app server:

   ```sh
   cd webapp/server
   npm i
   npm start
   ```

## Additional information

If you have any difficulties or have questions, [talk to us on Gitter](https://gitter.im/chainstack/fabric-bootcamp).

See also the [web app tutorial](https://chainstack.com/deploy-a-hyperledger-fabric-v2-web-app-using-sdk-for-node-js/).
