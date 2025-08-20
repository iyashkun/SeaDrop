const { ethers } = require("ethers");
const fs = require("fs").promises;

// Configuration
const RPC_URL = "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"; // Replace with your RPC URL
const SENDER_PRIVATE_KEY = "YOUR_SENDER_PRIVATE_KEY"; // Private key of the funding wallet
const WALLET_KEYS_PATH = "./wallets.json"; // Path to recipient wallets
const AMOUNT_PER_WALLET = ethers.utils.parseEther("0.01"); // ETH to send per wallet (e.g., 0.01 ETH)
const BATCH_SIZE = 50; // Number of wallets to process per batch
const MAX_FEE_PER_GAS = ethers.utils.parseUnits("50", "gwei");
const MAX_PRIORITY_FEE_PER_GAS = ethers.utils.parseUnits("2", "gwei");

// Disperse function to send ETH to multiple wallets
async function disperse() {
  try {
    // Initialize provider and sender wallet
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const senderWallet = new ethers.Wallet(SENDER_PRIVATE_KEY, provider);

    // Load recipient wallets
    const walletData = JSON.parse(await fs.readFile(WALLET_KEYS_PATH));
    const recipients = walletData.map(key => new ethers.Wallet(key).address);

    if (recipients.length !== 1000) {
      throw new Error(`Expected 1000 wallets, found ${recipients.length}`);
    }

    // Check sender balance
    const senderBalance = await provider.getBalance(senderWallet.address);
    const totalRequired = AMOUNT_PER_WALLET.mul(recipients.length);
    if (senderBalance.lt(totalRequired)) {
      throw new Error(
        `Insufficient balance: need ${ethers.utils.formatEther(totalRequired)} ETH, have ${ethers.utils.formatEther(senderBalance)} ETH`
      );
    }

    console.log(`Starting dispersal of ${ethers.utils.formatEther(AMOUNT_PER_WALLET)} ETH to ${recipients.length} wallets...`);

    // Process wallets in batches
    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${i / BATCH_SIZE + 1} of ${Math.ceil(recipients.length / BATCH_SIZE)}`);

      // Send ETH to each wallet in the batch
      await Promise.all(batch.map(async (recipient, index) => {
        try {
          const tx = await senderWallet.sendTransaction({
            to: recipient,
            value: AMOUNT_PER_WALLET,
            maxFeePerGas: MAX_FEE_PER_GAS,
            maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
          });
          console.log(`Wallet ${i + index + 1}: Transaction sent to ${recipient}: ${tx.hash}`);
          const receipt = await tx.wait();
          console.log(`Wallet ${i + index + 1}: Funded ${recipient} with ${ethers.utils.formatEther(AMOUNT_PER_WALLET)} ETH in tx ${receipt.transactionHash}`);
        } catch (error) {
          console.error(`Wallet ${i + index + 1} (${recipient}) failed: ${error.message}`);
        }
      }));
    }

    console.log("Dispersal complete for all wallets!");
  } catch (error) {
    console.error("Error in disperse function:", error.message);
  }
}

// Run the disperse function
async function main() {
  try {
    await fs.access(WALLET_KEYS_PATH);
    await disperse();
  } catch {
    console.error("Wallet file not found. Please ensure wallets.json exists with 1000 private keys.");
  }
}

main();
