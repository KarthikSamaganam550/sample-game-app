const Web3 = require('web3');

let web3 = null;
module.exports = {
    getWeb3Instance : function(){
        if (web3 === null) {
            web3 = new Web3();
            web3.setProvider(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
        } 
        return web3;
    }
};
