### Export the required files:

In the [Chainstack platform](https://console.chainstack.com/):

1. Network connection profile:
    - Navigate to your Hyperledger Fabric network.
    - Click **Details**.
    - Click **Export connection profile**.
1. Orderer TLS certificate:
    - Navigate to the Hyperledger Fabric **Service nodes** tab from the network.
    - Access **Orderer**.
    - Click **Export TLS certificate**.
1. Organization identity zip folder:
    - Navigate to the Hyperledger Fabric **Peer nodes** tab from the network.
    - Access your peer.
    - Next to **Organization identity**, click **Export**.
    - Unzip the downloaded folder.
1. Move the exported files to the `webapp/certs/` directory.
