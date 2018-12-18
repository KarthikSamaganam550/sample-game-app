var express  = require('express');
var app      = express(); 
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var IPFS = require('./ipfs')
var ipfs = IPFS.getIPFSObj();
var _ = require('lodash');
var deployScript = require('./ethereum/deploy');
const Web3 = require('./ethereum/createWeb3');
const web3 = Web3.getWeb3Instance();

var cron = require('cron');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({ type: 'application/json' }));


let contractAddress = null;
let contractInstance = {};


var compileAnddeployContract = async() => {
    contractInstance = await deployScript.deployContract();
    contractAddress = contractInstance._address;

    console.log("contractAddress>>>>", contractAddress);
}

var updateData = async(name, ipfsHash) => {
    let accounts = await web3.eth.getAccounts();
    var status = await contractInstance.methods.set(name, ipfsHash).send({ from: accounts[0],gas : '1000000' });
    console.log(status)
    return status;
    
}

function processFile(inputFile) {
  var fs = require('fs'),
      readline = require('readline'),
      instream = fs.createReadStream(inputFile),
      outstream = new (require('stream'))(),
      rl = readline.createInterface(instream, outstream);
   
  rl.on('line', function (line) {
      console.log(line);
      var lineRes = _.split(line,':',2);
      console.log(lineRes)
      if(lineRes.length == 2){
        var path = './data/'+lineRes[0]+'.log';
    
        if (fs.existsSync(path)) {
            fs.readFileSync(path).write(lineRes[1]);
        } else {
            fs.createWriteStream(path).write(lineRes[1]);
        }
        
      }
      
  });
  
  rl.on('close', function (line) {
      console.log(line);
      console.log('done reading file.');
  });
}

var cronJob = cron.job("*/1000 * * * * *", function(){

    processFile('/Users/ksamaganam/temp/mmserver/metadata.log');

    var dir = '/Users/ksamaganam/sampleGameApp/data/';
    fs.readdir(dir, (error, fileNames) => {
      console.log("fileNames>>>",fileNames)
        if (error) throw error;
        fileNames.forEach(filename => {
          // get current file name
          const filepath = path.resolve(dir, filename);
          const name = path.parse(filename).name;
          const data = fs.readFileSync(filepath);

          ipfs.add(data, (err, file) => {
            if (file) {
                var hash = file[0].hash;
                updateData(name, hash);
                //fs.unlink(filepath)
                console.log("hash>>>", hash);
            }
          })
          
        });
        
        
      });
      
}); 


app.listen(3001, function(res){
    console.log("Application is running on 3001 port");
    compileAnddeployContract();
    cronJob.start();
});