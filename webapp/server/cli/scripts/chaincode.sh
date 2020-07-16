# #!/bin/bash
set -e

trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG

export FABRIC_CFG_PATH=/etc/hyperledger/config
export ORDERER_CA=$ROOT_PATH/webapp/certs/$ORDERER_CA
export ORDERER_ADDRESS=$ORDERER_ADDRESS
export CORE_PEER_TLS_ENABLED=$CORE_PEER_TLS_ENABLED

export CORE_PEER_ADDRESS=$CORE_PEER_ADDRESS
export CORE_PEER_MSPCONFIGPATH=$ROOT_PATH/webapp/certs/$CORE_PEER_MSPCONFIGPATH
export CORE_PEER_LOCALMSPID=$CORE_PEER_LOCALMSPID
export CORE_PEER_TLS_ROOTCERT_FILE=$ROOT_PATH/webapp/certs/$CORE_PEER_TLS_ROOTCERT_FILE

discovery() {
  /etc/hyperledger/bin/discover \
 --peerTLSCA "$CORE_PEER_TLS_ROOTCERT_FILE" \
 --userKey "$ROOT_PATH/webapp/certs/RG-996-052-MSP/users/Admin@rg-996-052.int.chainstack.com/msp/keystore/priv_sk" \
 --userCert "$ROOT_PATH/webapp/certs/RG-996-052-MSP/users/Admin@rg-996-052.int.chainstack.com/msp/signcerts/Admin@rg-996-052.int.chainstack.com-cert.pem" \
 --MSP "$CORE_PEER_LOCALMSPID" \
 peers --server "$CORE_PEER_ADDRESS" \
 --channel "defaultchannel"
}

installChaincode() {
  /etc/hyperledger/bin/peer lifecycle chaincode package "${ROOT_PATH}/${CHAINCODE_NAME}.tar.gz" \
  --lang node \
  --path "${ROOT_PATH}/contract" \
  --label "${CHAINCODE_NAME}${CHAINCODE_VERSION}"
  /etc/hyperledger/bin/peer lifecycle chaincode install "${ROOT_PATH}/${CHAINCODE_NAME}.tar.gz"
}

getChaincodePackageID() {
  PACKAGES=$(/etc/hyperledger/bin/peer lifecycle chaincode queryinstalled | grep "${CHAINCODE_NAME}${CHAINCODE_VERSION}":)
  PACKAGE_ID=${PACKAGES#*Package ID: }
  export PACKAGE_ID=${PACKAGE_ID%,*}

  echo "PACKAGE_ID:" ${PACKAGE_ID}
}

approveChaincode() {
  /etc/hyperledger/bin/peer lifecycle chaincode approveformyorg \
  --name "$CHAINCODE_NAME" \
  --package-id "$PACKAGE_ID" -o "$ORDERER_ADDRESS" \
  --tls \
  --tlsRootCertFiles "$CORE_PEER_TLS_ROOTCERT_FILE" \
  --cafile "$ORDERER_CA" \
  --version "$CHAINCODE_VERSION" \
  --channelID "$CHANNEL_ID" \
  --sequence "$CHAINCODE_SEQUENCE"
  # --init-required \
}

checkReadiness() {
  /etc/hyperledger/bin/peer lifecycle chaincode checkcommitreadiness -o "$ORDERER_ADDRESS" \
  --channelID "$CHANNEL_ID" \
  --tls \
  --cafile "$ORDERER_CA" \
  --name "$CHAINCODE_NAME" \
  --version "$CHAINCODE_VERSION" \
  --sequence "$CHAINCODE_SEQUENCE" \
  --output "${OUTPUT}"
  # --init-required \
}

commitChaincode() {
  /etc/hyperledger/bin/peer lifecycle chaincode commit -o "$ORDERER_ADDRESS" \
  --channelID "$CHANNEL_ID" \
  --name "$CHAINCODE_NAME" \
  --version "$CHAINCODE_VERSION" \
  --sequence "$CHAINCODE_SEQUENCE" \
  --tls \
  --cafile "$ORDERER_CA" \
  --peerAddresses $CORE_PEER_ADDRESS \
  --tlsRootCertFiles $CORE_PEER_TLS_ROOTCERT_FILE
  # --init-required \
}

queryInstalled() {
  /etc/hyperledger/bin/peer lifecycle chaincode queryinstalled \
  --output "${OUTPUT}"
}

queryCommitted() {
  /etc/hyperledger/bin/peer lifecycle chaincode querycommitted -o "$ORDERER_ADDRESS" \
  --channelID "$CHANNEL_ID" \
  --tls \
  --cafile "$ORDERER_CA" \
  --peerAddresses "$CORE_PEER_ADDRESS" \
  --tlsRootCertFiles "$CORE_PEER_TLS_ROOTCERT_FILE" \
  --output "${OUTPUT}"
}

OUTPUT="plain-text"
if [[ $ACTION == "install" ]]
then
  installChaincode
elif [[ $ACTION == "approve" ]]
then
  approveChaincode
elif [[ $ACTION == "commit" ]]
then
  commitChaincode
elif [[ $ACTION == "queryCommitted" ]]
then
  OUTPUT="json"
  queryCommitted
elif [[ $ACTION == "queryInstalled" ]]
then
  OUTPUT="json"
  queryInstalled
elif [[ $ACTION == "checkReadiness" ]]
then
  OUTPUT="json"
  checkReadiness
elif [[ $ACTION == "discovery" ]]
then
  discovery
else
  echo "invalid action - ${ACTION}"
fi
