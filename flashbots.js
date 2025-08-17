import { ethers } from "ethers";
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";

const provider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY");
const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);

async function main() {
  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    wallet,
    "https://relay.flashbots.net"
  );

  const transaction = {
    to: "0xRecipientAddress",
    value: ethers.utils.parseEther("0.01"),
    gasLimit: 21000,
    maxFeePerGas: ethers.utils.parseUnits("30", "gwei"),
    maxPriorityFeePerGas: ethers.utils.parseUnits("1", "gwei")
  };

  const signedTx = await wallet.signTransaction(transaction);

  const blockNumber = await provider.getBlockNumber();
  const bundleSubmission = await flashbotsProvider.sendBundle(
    [{ signedTransaction: signedTx }],
    blockNumber + 1
  );

  const waitResponse = await bundleSubmission.wait();
  console.log(waitResponse);
}

main();
