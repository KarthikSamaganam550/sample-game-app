
const Web3 = require('./createWeb3');
const web3 = Web3.getWeb3Instance();

const gameContract = require('../ethereum/build/StoreGameEventsLog.json')

let contractOwnerAddress = null;
let accounts = [];

module.exports = {
    deployContract : async() => {
         accounts = await web3.eth.getAccounts();
         contractOwnerAddress = accounts[0];
        
         const gameContractResult = await new web3.eth.Contract(JSON.parse(gameContract.interface))
         .deploy({data : gameContract.bytecode})
         .send({gas : '3000000', from : contractOwnerAddress}); // need to implement get the gas dynamically
         return gameContractResult;
    },

    getContrcatOwnerAddress : function() {
        return contractOwnerAddress;
    }
}