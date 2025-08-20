const Web3 = require('web3');
const fs = require('fs');
require('dotenv').config();

// Load ERC721 ABI
const erc721ABI = JSON.parse(fs.readFileSync('./config/erc721ABI.json'));

// Load environment variables
const rpcUrl = process.env.RPC_URL;
const nftContractAddress = process.env.NFT_CONTRACT_ADDRESS;
const mainWalletAddress = process.env.MAIN_WALLET_ADDRESS;

// Initialize Web3
const web3 = new Web3(rpcUrl);

// Load wallets
const wallets = JSON.parse(fs.readFileSync('./config/wallets.json'));

// Initialize ERC721 contract
const nftContract = new web3.eth.Contract(erc721ABI, nftContractAddress);

// Function to get token IDs owned by a wallet
async function getTokenIds(walletAddress) {
  try {
    const balance = await nftContract.methods.balanceOf(walletAddress).call();
    const tokenIds = [];
    for (let i = 0; i < balance; i++) {
      const tokenId = await nftContract.methods.tokenByIndex(i).call();
      tokenIds.push(tokenId);
    }
    return tokenIds;
  } catch (error) {
    console.error(`Error fetching token IDs for wallet ${walletAddress}:`, error.message);
    return [];
  }
}

// Function to transfer NFTs from a wallet to the main wallet
async function transferNFTs(wallet) {
  try {
    const tokenIds = await getTokenIds(wallet.address);
    if (tokenIds.length === 0) {
      console.log(`No NFTs found in wallet ${wallet.address}`);
      return;
    }

    for (const tokenId of tokenIds) {
      const gasPrice = await web3.eth.getGasPrice();
      const tx = {
        from: wallet.address,
        to: nftContractAddress,
        data: nftContract.methods.transferFrom(wallet.address, mainWalletAddress, tokenId).encodeABI(),
        gas: 100000, // Adjust gas limit as needed
        gasPrice: gasPrice
      };

      const signedTx = await web3.eth.accounts.signTransaction(tx, wallet.privateKey);
      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      console.log(`Transferred NFT ${tokenId} from ${wallet.address} to ${mainWalletAddress}. Tx: ${receipt.transactionHash}`);
    }
  } catch (error) {
    console.error(`Error transferring NFTs from wallet ${wallet.address}:`, error.message);
  }
}

// Main function to transfer NFTs from all wallets
async function transferFromAllWallets() {
  console.log('Starting NFT transfer process for 1000 wallets...');

  // Process wallets in batches
  const batchSize = 50;
  for (let i = 0; i < wallets.length; i += batchSize) {
    const batch = wallets.slice(i, i + batchSize);
    const transferPromises = batch.map(wallet => transferNFTs(wallet));
    await Promise.all(transferPromises);
    console.log(`Processed batch ${i / batchSize + 1}/${Math.ceil(wallets.length / batchSize)}`);
  }

  console.log('Transfer complete for all wallets.');
}

// Run the script
transferFromAllWallets().catch(console.error);
