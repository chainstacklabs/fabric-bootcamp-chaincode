import express from 'express';
import { gateway } from 'fabric/gateway';
import { execute } from 'cli';
const fs = require('fs');
const api = express();
const envfile = require('envfile');
const { flushTmpFolder, makeTmpFolder, rootPath } = require('../fabric/utils/helper');

api.get('/channel/discovery', async (req, res, next) => {
  execute({ ACTION: 'discovery' }).then(({ stdout })=> {
    res.send(stdout);
  }).catch(({ stderr }) => {
    res.status(500).json({ message: stderr });
  });
});

api.get('/network', (req, res, next) => {
  Promise.all([
    execute({ ACTION: 'queryInstalled' }),
    execute({ ACTION: 'queryCommitted' }),
    execute({ ACTION: 'discoverConfig' }),
    execute({ ACTION: 'discoverPeers' }),
  ]).then(([installed, committed, config, peers]) => {
    return {
      installed_chaincodes: JSON.parse(installed.stdout).installed_chaincodes,
      chaincode_definitions: JSON.parse(committed.stdout).chaincode_definitions,
      config: JSON.parse(config.stdout),
      peers: JSON.parse(peers.stdout),
      mspId: envfile.parseFileSync(`${rootPath}/webapp/server/.env`).MSP_ID,
    };
  })
  .then(async (data) => {
    if (data.installed_chaincodes) {
      for (const [key, chaincode] of data.installed_chaincodes.entries()) {
        const committed = null;
        data.installed_chaincodes[key].committed = false;

        if (data.chaincode_definitions) {
          committed = data.chaincode_definitions.find(({ name, version}) => {
            return `${name}${version}` === chaincode.label;
          });

          data.installed_chaincodes[key].details = committed;
          data.installed_chaincodes[key].committed = true;
        }

        if (!committed) {
          await execute({ ACTION: 'checkReadiness' })
            .then(({ stdout })=> {
              data.installed_chaincodes[key].details = { approvals: JSON.parse(stdout).approvals };
            });
        }
      }
    }

    res.send(data);
  })
  .catch(next);
});

api.get('/chaincode/:chaincode', async (req, res, next) => {
  try {
    const channels = Array.from(gateway.client.channels.keys());

    const network = await gateway.getNetwork(channels[0]);
    const contract = await network.getContract(req.params.chaincode);
    const response = await contract.evaluateTransaction('org.hyperledger.fabric:GetMetadata');


    res.send({
      mspId: envfile.parseFileSync(`${rootPath}/webapp/server/.env`).MSP_ID,
      contract: JSON.parse(response.toString()),
    });
  } catch(e) {
    res.status(500).json(e.message);
  }
});

api.post('/chaincode/transaction', async (req, res, next) => {
  try {
    const channels = Array.from(gateway.client.channels.keys());

    const network = await gateway.getNetwork(channels[0]);
    const contract = await network.getContract(req.body.contract);
    const response = await contract.submitTransaction(...req.body.args);

    res.send(response.toString());
  } catch(e) {
    res.status(500).json(e.message);
  }
});

api.post('/chaincode/install', async (req, res, next) => {
  execute({ ACTION: 'install' }).then(({ stdout })=> {
    res.send({
      data: stdout,
    });
  }).catch(({ stderr }) => {
    res.status(500).json({ message: stderr });
  });
});

api.post('/chaincode/approve', async (req, res, next) => {
  execute({ ACTION: 'approve', PACKAGE_ID: req.body.package_id }).then(({ stdout })=> {
    res.send(stdout);
  }).catch(({ stderr }) => {
    res.status(500).json({ message: stderr });
  });
});

api.post('/chaincode/commit', async (req, res, next) => {
  Promise.all([
    execute({ ACTION: 'checkReadiness' }),
    execute({ ACTION: 'discoverConfig' }),
    execute({ ACTION: 'discoverPeers' }),
  ]).then(async ([readiness, channelConfig, channelPeers]) => {
    const { approvals } = JSON.parse(readiness.stdout);
    const { msps } = JSON.parse(channelConfig.stdout);
    const peers = JSON.parse(channelPeers.stdout);

    // get list of approved mspIds from checkRediness
    const approveMsps = Object.keys(approvals).filter(mspId => approvals[mspId]);
    // retrieve peerAddresses and tlsRootCertFiles of approved organizations

    const PEER_ADDRESSES = approveMsps.map((mspId) => peers.find(({ MSPID }) => MSPID === mspId).Endpoint).join(' ');
    const TLS_ROOTCERTS = approveMsps.map((mspId) => msps[mspId].tls_root_certs[0]);

    const TLS_ROOTCERT_FILES = [];
    await makeTmpFolder();

    for (const [index, mspId] of approveMsps.entries()) {
      const filePath = `${rootPath}/webapp/certs/tmp/${mspId}.pem`;
      await fs.promises.writeFile(filePath, TLS_ROOTCERTS[index], { encoding: 'base64' })
        .then(() => TLS_ROOTCERT_FILES.push(filePath));
    }

    execute({ ACTION: 'commit', PEER_ADDRESSES, TLS_ROOTCERT_FILES: TLS_ROOTCERT_FILES.join(' ') }).then((response)=> {
      flushTmpFolder();
      res.send(response.stdout);
    }).catch(({ stderr }) => {
      res.status(500).json({ message: stderr });
    });
  }).catch(next);
});

export default api;
