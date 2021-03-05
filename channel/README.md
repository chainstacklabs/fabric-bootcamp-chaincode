# Guide on installing a new Hyperleder Fabric channel

## Prerequisites
Before we begin, ensure that you have exported the following files from the [Chainstack platform](https://console.chainstack.com/) for each organization you are planning to involve in the channel you're creating. Reference [Export files guide](../webapp/certs/README.md) for more information.

Note that you should store the exported files in their own individual cert directory, your webapp folder should look like this:
```
webapp
|__ certs <-- Org1CertsFolder
  |__ca
  |__tlsca
  |__connection-profile.json
  |__orderer-id-cert.pem
|__ certs2 <-- Org2CertsFolder
  |__ca
  |__tlsca
  |__connection-profile.json
  |__orderer-id-cert.pem
|__ certs3 <-- Org3CertsFolder
  |__ca
  |__tlsca
  |__connection-profile.json
  |__orderer-id-cert.pem
```
## Update values within the configtx.yaml
1. Update and configure the channel's setting through the `/channel/configtx.yaml` file, sample values are provided for reference.

## Create channel creation transaction
1. Navigate to the `channel` directory.
```bash
cd channel
```
2. Create channel transaction
```bash
../hlf/bin/configtxgen -profile newchannel -outputCreateChannelTx ./newchannel.tx -channelID newchannel -configPath .
```

## Create channel using channel transaction
1. Navigate to the `root` directory.
```bash
cd ../
```
1. Set global variables with Org 1 details
```bash
export FABRIC_CFG_PATH=hlf/config
export FABRIC_BIN_PATH=hlf/bin
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="<< Org1MspID >>"
export CORE_PEER_TLS_ROOTCERT_FILE="../../webapp/<< Org1CertsFolder >>/tlsca/<< Org1TLSCertFileName >>"
export CORE_PEER_MSPCONFIGPATH="../../webapp/<< Org1CertsFolder >>/msp"
export CORE_PEER_ADDRESS="<< Org1PeerName >>"
```
1. Create channel
```bash
peer channel create -c newchannel --tls --cafile ../../webapp/<< Org1CertsFolder >>/<< OrdererTLSCertFileName >> -o << OrdererName >>:7050 -f ./channel/newchannel.tx
```

## Org 1 join channel
1. Set global variables with Org 1 details
```
export FABRIC_CFG_PATH=hlf/config
export FABRIC_BIN_PATH=hlf/bin
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="<< Org1MspID >>"
export CORE_PEER_TLS_ROOTCERT_FILE="../../webapp/<< Org1CertsFolder >>/tlsca/<< Org1TLSCertFileName >>"
export CORE_PEER_MSPCONFIGPATH="../../webapp/<< Org1CertsFolder >>/msp"
export CORE_PEER_ADDRESS="<< Org1PeerName >>"
```
1. Execute command for org 1 to join channel
```
peer channel join -b newchannel.block
```

## Org 2 join channel
1. Set global variables with Org 2 details
```
export FABRIC_CFG_PATH=hlf/config
export FABRIC_BIN_PATH=hlf/bin
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="<< Org2MspID >>"
export CORE_PEER_TLS_ROOTCERT_FILE="../../webapp/<< Org2CertsFolder >>/tlsca/<< Org2TLSCertFileName >>"
export CORE_PEER_MSPCONFIGPATH="../../webapp/<< Org2CertsFolder >>/msp"
export CORE_PEER_ADDRESS="<< Org2PeerName >>"
```
1. Execute command for org 2 to join channel
```
peer channel join -b newchannel.block
```
