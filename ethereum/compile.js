
const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
        
        fs.removeSync(buildPath);
        
        const gameContractPath = path.resolve(__dirname, 'contracts', 'StoreGameEventsLog.sol');
        
        const gameContractPathSource = fs.readFileSync(gameContractPath, 'utf8');
        
        const gameContractPathOutput = solc.compile(gameContractPathSource, 1).contracts;
        
        fs.ensureDirSync(buildPath);
        
        for(let contract in gameContractPathOutput) {
            fs.outputJsonSync(
                path.resolve(buildPath, contract.replace(':', '') + '.json'),
                gameContractPathOutput[contract]
            );
        }