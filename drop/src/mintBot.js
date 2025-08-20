const Web3 = require('web3');
const fs = require('fs');
require('dotenv').config();

// SeaDrop ABI (simplified, include full ABI from OpenSea SeaDrop documentation)
const seaDropABI = [
  {
    "constant": false,
    "inputs": [
      { "name": "minter", "type": "address" },
      { "name": "quantity", "type": "uint256" }
    ],
    "name": "mintPublic",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getPublicDrop",
    "outputs": [
      { "name": "mintPrice", "type": "uint256" },
      { "name": "startTime", "type": "uint256" },
      { "name": "endTime", "type": "uint256" },
      { "name": "maxTotalMintable", "type": "uint256" },
      { "name": "feeBps", "type": "uint16" },
      { "name": "restrictFeeRecipients", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Load environment variables
const rpcUrl = process.env.RPC_URL;
const seaDropAddress = process.env.SEADROP_CONTRACT_ADDRESS;
const nftContractAddress = process.env.NFT_CONTRACT_ADDRESS;

// Initialize Web3
const web3 = new Web3(rpcUrl);

// Load wallets
const wallets = JSON.parse(fs.readFileSync('./config/wallets.json'));

// Initialize SeaDrop contract
const seaDropContract = new web3.eth.Contract(seaDropABI, seaDropAddress);

// Function to check if public mint is active
async function isPublicMintActive() {
  try {
    const publicDrop = await seaDropContract.methods.getPublicDrop(nftContractAddress).call();
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= publicDrop.startTime && currentTime <= publicDrop.endTime;
  } catch (error) {
    console.error('Error checking public mint status:', error.message);
    return false;
  }
}

// Function to mint NFTs from a single wallet
async function mintNFT(wallet, quantity = 1) {
  try {
    const publicDrop = await seaDropContract.methods.getPublicDrop(nftContractAddress).call();
    const mintPrice = web3.utils.toBN(publicDrop.mintPrice).mul(web3.utils.toBN(quantity));
    const gasPrice = await web3.eth.getGasPrice();
    
    const tx = {
      from: wallet.address,
      to: seaDropAddress,
      value: mintPrice,
      data: seaDropContract.methods.mintPublic(nftContractAddress, quantity).encodeABI(),
      gas: 300000, // Adjust gas limit as needed
      gasPrice: gasPrice
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, wallet.privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(`Minted ${quantity} NFT(s) for wallet ${wallet.address}. Tx: ${receipt.transactionHash}`);
    return receipt;
  } catch (error) {
    console.error(`Error minting for wallet ${wallet.address}:`, error.message);
    return null;
  }
}

// Main function to mint from all wallets
async function mintFromAllWallets() {
  if (!(await isPublicMintActive())) {
    console.error('Public mint is not active.');
    return;
  }

  console.log('Starting minting process for 1000 wallets...');
  
  // Process wallets in batches to avoid overwhelming the node
  const batchSize = 50;
  for (let i = 0; i < wallets.length; i += batchSize) {
    const batch = wallets.slice(i, i + batchSize);
    const mintPromises = batch.map(wallet => mintNFT(wallet, 1)); // Mint 1 NFT per wallet
    await Promise.all(mintPromises);
    console.log(`Processed batch ${i / batchSize + 1}/${Math.ceil(wallets.length / batchSize)}`);
  }
  
  console.log('Minting complete for all wallets.');
}

// Run the script
mintFromAllWallets().catch(console.error);
