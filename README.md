# Chainstack Blockchain Bootcamp: Build Enterprise Applications with Hyperledger Fabric v2

This project contains the web app that we will be spinnnig and connecting to the Hyperledger Fabric network deployed on [Chainstack](https://chainstack.com).

This is a two-part project:
* [Web app](https://chainstack.com/deploy-a-hyperledger-fabric-v2-web-app-using-sdk-for-node-js/) in the `webapp` directory.
* [Contract](https://docs.chainstack.com/tutorials/fabric/universal-basic-income-opt-in-chaincode#universal-basic-income-opt-in-chaincode) in the `contract` directory.

## Contract

The contract is a sample JavaScript chaincode with 3 transactions:
  - `optIn`
  - `optOut`
  - `querySSN`

For details, see the [chaincode tutorial](https://docs.chainstack.com/tutorials/fabric/universal-basic-income-opt-in-chaincode#universal-basic-income-opt-in-chaincode).

## Prepare for the bootcamp

### Prerequisites
* Linux or macOS
* Node.js 12.13.1 or higher
* NPM 6 or higher

### Set up your environment (required)

From the project root directory, run `sudo bash downloadPeerBinary.sh` to download the Hyperledger Fabric peer binaries. Note that this might take some time.

Rename the `webapp/server/.env.template` file to `webapp/server/.env`.

In the `.env` file, replace the `ORDERER_NAME`, `PEER_NAME`, and `MSP_ID` variables with:

* `ORDERER_NAME` — the orderer name of the network you deployed your node in. To access the orderer name—in the [Chainstack UI](https://console.chainstack.com/), navigate to your Hyperledger Fabric network, click **Details**, copy the **Orderer name** value.
* `PEER_NAME` — the peer name of the node that you deployed. To access the peer name—in the [Chainstack UI](https://console.chainstack.com/), navigate to your Hyperledger Fabric node, copy the **Peer name** value.
* `MSP_ID` — the Membership Service Provider identity (MSP ID) of the node that you deployed. To access the MSP ID—in the [Chainstack UI](https://console.chainstack.com/), navigate to your Hyperledger Fabric node, copy the **MSP ID** value.

You are now ready for the bootcamp.

### Set up your environment (optional)

Additionally, you may want to prepare the web app client and server in advance—although this is not required, as this will be done during the bootcamp.

Set up the web app client:

```sh
cd webapp/client
npm i
npm run build
```

Set up the web app server:

```sh
cd webapp/server
npm i
npm start
```

## Additional information

If you have any difficulties or have questions, [talk to us on Gitter](https://gitter.im/chainstack/fabric-bootcamp).

See also the [web app tutorial](https://chainstack.com/deploy-a-hyperledger-fabric-v2-web-app-using-sdk-for-node-js/).