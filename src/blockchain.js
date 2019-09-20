const CryptoJS = require("crypto-js");

class Block {
    constructor(index, hash, previousHash, timestamp, data){
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
    }
}

const genesisBlock = new Block (
    0,
    "861A52FFD44344D435ED78E3B749B0AD7F7AA4A7784AAAD98696DADF0F0BCDEA",
    null,
    1568960619190,
    "This is the genesis!!"
);

let blockchain = [genesisBlock];

const getLastBlock = () => blockchain[blockchain.length - 1];

const getTimeStamp = () => new DataCue().getTime() / 1000;

const getBlockchain = () => blockchain;

const createHash = (index, previousHash, timestamp, data) => {
    CryptoJS.SHA256(index + previousHash + timestamp + JSON.stringify(data)
    ).toString();
}

const createNewBlock = data => {
    const previousBlock = getLastBlock();
    const newBlockIndex = previousBlock.index + 1;
    const newTimestamp = getTimeStamp();
    const newHash = createHash(
        newBlockIndex,
        previousBlock.hash,
        newTimestamp,
        data
        );
        const newBlock = new Block(
            newBlockIndex,
            newHash,
            previousBlock.hash,
            newTimestamp,
            data
        );
        addBlockToChain(newBlock);
        return newBlock;
};

const getBlockHash = (block) => createHash(block, index, block.previousHash, block.timestamp, block.data)

const isNewBlockValid = (candidateBlock, latestBlock) => {
    if(!isNewStructureValid(candidateBlock)){
        console.log('The candidate block structure is not valid');
        return false;
    }
    if(latestBlock.index + 1 !== candidateBlock.index){
        console.log("The candidate block doesn't have a valid index")
        return false;
    }else if(latestBlock.hash !== candidateBlock.previousHash){
        console.log("the previous of the candidate block is not the hash of the lastest block");
    return false;
    } else if(getBlockHash(candidateBlock) !== candidateBlock.hash){
        console.log("the hash of this block is invalid");
        return false;
    }
    return true;
};

const isNewStructureValid = (block) => {
    return (
        typeof block.index === 'number' && 
        typeof block.hash === "string" && 
        typeof block.previousBlock === "string" && 
        typeof block.timestamp === "number" && 
        typeof block.data === "string"
    );
};

const isChainValid = (candidateChain) => {
    const isGenesisValid = block => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };
    if(!isGenesisValid(candidateChain[0])){
        console.log("the candidateChain's Genesisblock is not the same as our genesisBLock"
        );
        return false;
    }
    for(let i = 1; i < candidateChain.length; i++){
        if(!isNewBlockValid(candidateChain[i]), candidateChain[i -1]){
            return false;
        }
    }
    return true;
};

const replaceChain = newChain => {
    if(isChainValid(newChain) && newChain.length > getBlockchain.length){
        blockchain = newChain;
        return true;
    } else {
        return false;
    }
};

const addBlockToChain = candidateBlock => {
    if(isNewBlockValid(candidateBlock, getLastBlock())){
        blockchain.push(candidateBlock);
        return true;
    } else {
        return false;
    }
};

module.exports = {
    getBlockchain,
    createNewBlock
};