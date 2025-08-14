import { Chain } from 'viem'
import { 
  mainnet, 
  polygon, 
  arbitrum, 
  optimism, 
  base,
  avalanche,
  abstract,
} from 'viem/chains'

export const SUPPORTED_CHAINS: Chain[] = [
  mainnet,
  polygon,
  arbitrum,
  optimism,
  base,
  avalanche,
  abstract
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
  [abstract.id]: {
    name: 'Abstract',
    currency: 'ETH',
    seadropFactories: ['0x00005EA00Ac477B1030CE78506496e8C2dE24bf5'],
    openseaAPI: 'https://api.opensea.io/api/v2',
    explorerUrl: 'https://abscan.org'
  }
}

export const getChainConfig = (chainId: number) => {
  return CHAIN_CONFIGS[chainId] || CHAIN_CONFIGS[mainnet.id]
}

export const getChainById = (chainId: number) => {
  return SUPPORTED_CHAINS.find(chain => chain.id === chainId) || mainnet
}
