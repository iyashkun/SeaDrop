export const SEADROP_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "nftContract",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "feeRecipient",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "minterIfNotPayer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      }
    ],
    "name": "mintPublic",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "nftContract",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "feeRecipient",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "minterIfNotPayer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "mintPrice",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maxTotalMintableByWallet",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "startTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "endTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "dropStageIndex",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maxTokenSupplyForStage",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "feeBps",
            "type": "bytes32"
          },
          {
            "internalType": "bool",
            "name": "restrictFeeRecipients",
            "type": "bool"
          }
        ],
        "internalType": "struct PublicDrop",
        "name": "publicDrop",
        "type": "tuple"
      },
      {
        "internalType": "bytes32[]",
        "name": "proof",
        "type": "bytes32[]"
      }
    ],
    "name": "mintAllowList",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "nftContract",
        "type": "address"
      }
    ],
    "name": "getPublicDrop",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "mintPrice",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "startTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "endTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maxTotalMintableByWallet",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "feeBps",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "restrictFeeRecipients",
            "type": "bool"
          }
        ],
        "internalType": "struct PublicDrop",
        "name": "publicDrop",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "nftContract",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "allowListMerkleRoot",
        "type": "bytes32"
      }
    ],
    "name": "getAllowListMerkleRoot",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

export const ERC721_SEADROP_ABI = [
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "minter",
        "type": "address"
      }
    ],
    "name": "getMintStats",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "minterNumMinted",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "currentTotalSupply",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxSupply",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
