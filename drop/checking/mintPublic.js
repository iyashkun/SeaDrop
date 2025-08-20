const { ethers } = require("ethers");
const fs = require("fs").promises;
const path = require("path");

// Configuration
const RPC_URL = "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"; // Replace with your RPC URL
const SEADROP_ADDRESS = "0x00005EA00Ac477B1030CE78506496e8C2dE24bf5"; // SeaDrop contract address
const NFT_CONTRACT_ADDRESS = "YOUR_ERC721_SEADROP_CONTRACT_ADDRESS"; // Your ERC721SeaDrop contract
const WALLET_KEYS_PATH = "./wallets.json"; // Path to wallet private keys
const BATCH_SIZE = 50; // Number of wallets to process in parallel
const MINT_QUANTITY = 1; // NFTs to mint per wallet
const MAX_FEE_PER_GAS = ethers.utils.parseUnits("50", "gwei"); // Max gas fee
const MAX_PRIORITY_FEE_PER_GAS = ethers.utils.parseUnits("2", "gwei"); // Max priority fee

// SeaDrop ABI (subset for public minting)
const SEADROP_ABI = [
  "function mintPublic(address nftContract, address feeRecipient, address minter, uint256 quantity) external payable",
  "function getPublicDrop(address nftContract) external view returns (tuple(uint256 startTime, uint256 endTime, uint256 maxTotalMintablePerTx, uint256 feeBps, bool restrictFeeRecipients, uint256 maxTotalMintable))",
];

// ERC721SeaDrop ABI (minimal for ownership check)
const ERC721_ABI = [
  "function owner() view returns (address)",
];

// Main function to run the bot
async function main() {
  try {
    // Initialize provider
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

    // Load wallets from file
    const walletData = JSON.parse(await fs.readFile(WALLET_KEYS_PATH));
    const wallets = walletData.map(key => new ethers.Wallet(key, provider));

    if (wallets.length !== 1000) {
      throw new Error(`Expected 1000 wallets, found ${wallets.length}`);
    }

    // Initialize SeaDrop contract
    const seaDrop = new ethers.Contract(SEADROP_ADDRESS, SEADROP_ABI, provider);

    // Check if public drop is active
    const publicDrop = await seaDrop.getPublicDrop(NFT_CONTRACT_ADDRESS);
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime < publicDrop.startTime || currentTime > publicDrop.endTime) {
      throw new Error("Public drop is not active");
    }

    if (MINT_QUANTITY > publicDrop.maxTotalMintablePerTx) {
      throw new Error(`Requested quantity (${MINT_QUANTITY}) exceeds max per tx (${publicDrop.maxTotalMintablePerTx})`);
    }

    // Calculate total ETH needed per mint (if drop has a price)
    const mintPrice = ethers.BigNumber.from(publicDrop.feeBps).mul(MINT_QUANTITY).div(10000);
    console.log(`Mint price per wallet: ${ethers.utils.formatEther(mintPrice)} ETH`);

    // Process wallets in batches
    for (let i = 0; i < wallets.length; i += BATCH_SIZE) {
      const batch = wallets.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${i / BATCH_SIZE + 1} of ${Math.ceil(wallets.length / BATCH_SIZE)}`);

      // Mint for each wallet in parallel
      await Promise.all(batch.map(async (wallet, index) => {
        try {
          const seaDropWithSigner = seaDrop.connect(wallet);
          const tx = await seaDropWithSigner.mintPublic(
            NFT_CONTRACT_ADDRESS,
            ethers.constants.AddressZero, // Fee recipient (set to zero if not needed)
            wallet.address,
            MINT_QUANTITY,
            {
              value: mintPrice,
              maxFeePerGas: MAX_FEE_PER_GAS,
              maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
            }
          );
          console.log(`Wallet ${i + index + 1}: Transaction sent: ${tx.hash}`);
          const receipt = await tx.wait();
          console.log(`Wallet ${i + index + 1}: Minted ${MINT_QUANTITY} NFT(s) in tx ${receipt.transactionHash}`);
        } catch (error) {
          console.error(`Wallet ${i + index + 1} failed: ${error.message}`);
        }
      }));
    }

    console.log("Minting complete for all wallets!");
  } catch (error) {
    console.error("Error running bot:", error.message);
  }
}

// Utility function to generate or load wallets (for setup)
async function setupWallets() {
  const wallets = [];
  for (let i = 0; i < 1000; i++) {
    const wallet = ethers.Wallet.createRandom();
    wallets.push(wallet.privateKey);
  }
  await fs.writeFile(WALLET_KEYS_PATH, JSON.stringify(wallets, null, 2));
  console.log(`Generated 1000 wallets and saved to ${WALLET_KEYS_PATH}`);
}

// Run setup if wallets.json doesn't exist
async function initialize() {
  try {
    await fs.access(WALLET_KEYS_PATH);
    console.log("Wallet file found, proceeding to mint...");
    await main();
  } catch {
    console.log("Wallet file not found, generating new wallets...");
    await setupWallets();
    console.log("Please fund the wallets and then rerun the script.");
  }
}

// Start the bot
initialize();
