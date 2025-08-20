const puppeteer = require('puppeteer');
const fs = require('fs');
require('dotenv').config();

// GraphQL query from your provided script
const query = `
query DropEligibilityQuery($collectionSlug: String!, $address: Address!) {
  dropBySlug(slug: $collectionSlug) {
    __typename
    ... on Erc721SeaDropV1 {
      minterQuantityMinted(minter: $address)
      __typename
    }
    stages {
      stageType
      stageIndex
      isEligible
      maxTotalMintableByWallet
      eligibleMaxTotalMintableByWallet
      eligiblePrice {
        ...TokenPrice
        ...UsdPrice
        usd
        token {
          unit
          symbol
          contractAddress
          chain {
            identifier
            __typename
          }
          __typename
        }
        __typename
      }
      ... on Erc1155SeaDropV2Stage {
        fromTokenId
        toTokenId
        maxTotalMintableByWalletPerToken
        eligibleMaxTotalMintableByWalletPerToken
        __typename
      }
      __typename
    }
  }
}
fragment TokenPrice on Price {
  usd
  token {
    unit
    symbol
    contractAddress
    chain {
      identifier
      __typename
    }
    __typename
  }
  __typename
}
fragment UsdPrice on Price {
  usd
  token {
    contractAddress
    unit
    ...currencyIdentifier
    __typename
  }
  __typename
}
fragment currencyIdentifier on ContractIdentifier {
  contractAddress
  chain {
    identifier
    __typename
  }
  __typename
}
`;

// Load environment variables
const collectionSlug = process.env.COLLECTION_SLUG;

// Load wallets
const wallets = JSON.parse(fs.readFileSync('./config/wallets.json'));

// Headers from your script, adjusted for Puppeteer
const headers = {
  'authority': 'gql.opensea.io',
  'accept': '*/*',
  'accept-encoding': 'gzip, deflate, br, zstd',
  'accept-language': 'en-US,en;q=0.9',
  'content-type': 'application/json',
  'origin': 'https://opensea.io',
  'referer': 'https://opensea.io/',
  'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-site',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  'x-app-id': 'opensea-web',
  'x-build-id': 'b8f4c9e0b3a2f4f7d9c6e8f0a1b2c3d4e5f6a7b8',
  'x-signed-query': 'true'
};

// Function to check drop eligibility for a single wallet using Puppeteer
async function checkDropEligibility(address, browser) {
  const page = await browser.newPage();
  try {
    // Set headers
    await page.setExtraHTTPHeaders(headers);

    // Navigate to OpenSea to establish a browser context (helps with Cloudflare)
    await page.goto('https://opensea.io', { waitUntil: 'networkidle2' });

    // Send GraphQL request
    const payload = {
      operationName: 'DropEligibilityQuery',
      query: query,
      variables: {
        collectionSlug: collectionSlug,
        address: address
      }
    };

    const response = await page.evaluate(async (url, payload, headers) => {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(payload)
        });
        return await res.json();
      } catch (error) {
        return { error: error.message };
      }
    }, 'https://gql.opensea.io/graphql', payload, headers);

    if (response.error) {
      console.error(`Error for ${address}:`, response.error);
      return null;
    }

    if (response.data?.dropBySlug) {
      console.log(`Eligibility for ${address}:`, JSON.stringify(response.data.dropBySlug, null, 2));
      return response.data.dropBySlug;
    } else {
      console.error(`No data for ${address}. Response:`, JSON.stringify(response, null, 2));
      return null;
    }
  } catch (error) {
    console.error(`Error for ${address}:`, error.message);
    return null;
  } finally {
    await page.close();
  }
}

// Main function to check eligibility for all wallets
async function checkEligibilityForAllWallets() {
  console.log(`Checking eligibility for ${wallets.length} wallets...`);

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

  // Process wallets in batches
  const batchSize = 10;
  const eligibleWallets = [];

  for (let i = 0; i < wallets.length; i += batchSize) {
    const batch = wallets.slice(i, i + batchSize);
    const eligibilityPromises = batch.map(wallet => checkDropEligibility(wallet.address, browser));
    const results = await Promise.all(eligibilityPromises);

    // Filter eligible wallets
    results.forEach((result, index) => {
      if (result?.stages?.some(stage => stage.isEligible)) {
        eligibleWallets.push(batch[index]);
      }
    });

    console.log(`Batch ${i / batchSize + 1}/${Math.ceil(wallets.length / batchSize)} - Eligible wallets:`, eligibleWallets.map(w => w.address));

    // Delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay
  }

  await browser.close();
  console.log('Eligibility check complete.');
  return eligibleWallets;
}

// Export eligible wallets for minting bot integration
module.exports = { checkEligibilityForAllWallets };
