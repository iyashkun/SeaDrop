import { Chain } from 'viem'
import { 
  mainnet, 
  polygon, 
  arbitrum, 
  optimism, 
  base,
  avalanche,
  bsc,
  klaytn,
  polygonZkEvm,
  arbitrumNova,
  sepolia,
  polygonMumbai
} from 'viem/chains'

export const SUPPORTED_CHAINS: Chain[] = [
  mainnet,
  polygon,
  arbitrum,
  optimism,
  base,
  avalanche,
  bsc,
  klaytn,
  polygonZkEvm,
  arbitrumNova,
  sepolia,
  polygonMumbai
]

export const CHAIN_CONFIGS = {
  [mainnet.id]: {
    name: 'Ethereum',
    currency: 'ETH',
    seadropFactories: ['0x00005EA00Ac477B1030CE78506496e8C2dE24bf5'],
    openseaAPI: 'https://api.opensea.io/api/v2',
    explorerUrl: 'https://etherscan.io'
  },
  [polygon.id]: {
    name: 'Polygon',
    currency: 'MATIC',
    seadropFactories: ['0x00005EA00Ac477B1030CE78506496e8C2dE24bf5'],
    openseaAPI: 'https://api.opensea.io/api/v2',
    explorerUrl: 'https://polygonscan.com'
  },
  [arbitrum.id]: {
    name: 'Arbitrum',
    currency: 'ETH',
    seadropFactories: ['0x00005EA00Ac477B1030CE78506496e8C2dE24bf5'],
    openseaAPI: 'https://api.opensea.io/api/v2',
    explorerUrl: 'https://arbiscan.io'
  },
  [optimism.id]: {
    name: 'Optimism',
    currency: 'ETH',
    seadropFactories: ['0x00005EA00Ac477B1030CE78506496e8C2dE24bf5'],
    openseaAPI: 'https://api.opensea.io/api/v2',
    explorerUrl: 'https://optimistic.etherscan.io'
  },
  [base.id]: {
    name: 'Base',
    currency: 'ETH',
    seadropFactories: ['0x00005EA00Ac477B1030CE78506496e8C2dE24bf5'],
    openseaAPI: 'https://api.opensea.io/api/v2',
    explorerUrl: 'https://basescan.org'
  },
  [avalanche.id]: {
    name: 'Avalanche',
    currency: 'AVAX',
    seadropFactories: ['0x00005EA00Ac477B1030CE78506496e8C2dE24bf5'],
    openseaAPI: 'https://api.opensea.io/api/v2',
    explorerUrl: 'https://snowscan.xyz'
  },
  [bsc.id]: {
    name: 'BNB Chain',
    currency: 'BNB',
    seadropFactories: ['0x00005EA00Ac477B1030CE78506496e8C2dE24bf5'],
    openseaAPI: 'https://api.opensea.io/api/v2',
    explorerUrl: 'https://bscscan.com'
  },
  [klaytn.id]: {
    name: 'Klaytn',
    currency: 'KLAY',
    seadropFactories: ['0x00005EA00Ac477B1030CE78506496e8C2dE24bf5'],
    openseaAPI: 'https://api.opensea.io/api/v2',
    explorerUrl: 'https://klaytnscope.com'
  }
}

export const getChainConfig = (chainId: number) => {
  return CHAIN_CONFIGS[chainId] || CHAIN_CONFIGS[mainnet.id]
}

export const getChainById = (chainId: number) => {
  return SUPPORTED_CHAINS.find(chain => chain.id === chainId) || mainnet
}
