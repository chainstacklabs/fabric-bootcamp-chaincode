import express from 'express';
import { gateway } from 'fabric/gateway';
import { execute } from 'cli';
const api = express();
const envfile = require('envfile');
const { rootPath } = require('../fabric/utils/helper');

api.get('/channel/discovery', async (req, res, next) => {
  execute({ ACTION: 'discovery' }).then(({ stdout })=> {
    res.send(stdout);
  }).catch(({ stderr }) => {
    res.status(500).json({ message: stderr });
  });
});

api.get('/network', (req, res, next) => {
  // demo bridge between Node.js and Peer cli bash command
  const channels = Array.from(gateway.client.channels.keys());

  Promise.all([
    execute({ ACTION: 'queryInstalled' }),
    execute({ ACTION: 'queryCommitted' }),
    execute({ ACTION: 'checkReadiness' }),
  ]).then(([installed, committed, readiness]) => {
    res.send({
      channels,
      installed_chaincodes: JSON.parse(installed.stdout).installed_chaincodes,
      chaincode_definitions: JSON.parse(committed.stdout).chaincode_definitions,
      approvals: JSON.parse(readiness.stdout).approvals,
      mspId: envfile.parseFileSync(`${rootPath}/webapp/server/.env`).CORE_PEER_LOCALMSPID,
    });
  })
  .catch(next);
});

api.get('/chaincode/:chaincode', async (req, res, next) => {
  try {
    const channels = Array.from(gateway.client.channels.keys());

    const network = await gateway.getNetwork(channels[0]);
    const contract = await network.getContract(req.params.chaincode);
    const response = await contract.evaluateTransaction('org.hyperledger.fabric:GetMetadata');

    res.send(JSON.parse(response.toString()));
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
      data: response.stdout,
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
  execute({ ACTION: 'commit' }).then(({ stdout })=> {
    res.send(stdout);
  }).catch(({ stderr }) => {
    res.status(500).json({ message: stderr });
  });
});

export default api;
