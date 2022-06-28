import { Network } from "zksync/build/types";
import { version as zkSyncLibVersion } from "zksync/package.json";
import { version as zkUIVersion } from "../package.json";
import { ModuleOptions, ZkEthereumNetworkConfig, ZkNetworkConfig, ZkConfig } from "../types";
import { onboardConfig } from "../utils/onboardConfig";

export const zkSyncNetworkConfig: ZkNetworkConfig = {
  localhost: {
    ethereumNetwork: "rinkeby",
    api: "https://rinkeby-api.zksync.io/api/v0.2/",
    explorer: "https://rinkeby.zkscan.io/",
    tools: {
      forcedExit: "https://withdraw-rinkeby.zksync.dev/",
      link: "https://checkout-rinkeby.zksync.io/",
      withdrawal: "https://withdraw.zksync.io/",
      mint: "https://mint.zksync.dev/",
    },
  },
  rinkeby: {
    ethereumNetwork: "rinkeby",
    api: "https://rinkeby-api.zksync.io/api/v0.2/",
    explorer: "https://rinkeby.zkscan.io/",
    tools: {
      forcedExit: "https://withdraw-rinkeby.zksync.dev/",
      link: "https://checkout-rinkeby.zksync.io/",
      withdrawal: "https://withdraw.zksync.io/",
      mint: "https://mint.zksync.dev/",
    },
  },
  "rinkeby-beta": {
    ethereumNetwork: "rinkeby",
    api: "https://rinkeby-beta-api.zksync.io/api/v0.2/",
    explorer: "https://rinkeby-beta-scan.zksync.dev/",
    tools: {
      forcedExit: "https://withdraw-rinkeby.zksync.dev/",
      link: "https://checkout-rinkeby.zksync.io/",
      withdrawal: "https://withdraw.zksync.io/",
      mint: "https://mint.zksync.dev/",
    },
  },
  ropsten: {
    ethereumNetwork: "ropsten",
    api: "https://ropsten-api.zksync.io/api/v0.2/",
    explorer: "https://ropsten.zkscan.io/",
    tools: {
      forcedExit: "https://withdraw-ropsten.zksync.dev/",
      link: "https://checkout-ropsten.zksync.io/",
      withdrawal: "https://withdraw.zksync.io/",
      mint: "https://mint-ropsten.zksync.dev/",
    },
  },
  "goerli-beta": {
    ethereumNetwork: "goerli",
    api: "https://goerli-beta-api.zksync.dev/api/v0.2/",
    explorer: "https://goerli-beta-scan.zksync.dev/",
    tools: {
      forcedExit: "https://withdraw-goerli.zksync.dev/",
      link: "https://checkout-goerli.zksync.io/",
      withdrawal: "https://withdraw.zksync.io/",
      mint: "https://mint-goerli.zksync.dev/",
    },
  },
  mainnet: {
    ethereumNetwork: "mainnet",
    api: "https://api.zksync.io/api/v0.2/",
    explorer: "https://zkscan.io/",
    tools: {
      forcedExit: "https://withdraw.zksync.dev/",
      link: "https://checkout.zksync.io/",
      withdrawal: "https://withdraw.zksync.io/",
      mint: "https://mint.zksync.dev/",
    },
  },
};

export const ethereumNetworkConfig = (INFURA_KEY: string): ZkEthereumNetworkConfig => {
  return {
    goerli: {
      id: 5,
      name: "goerli",
      explorer: "https://goerli.etherscan.io/",
      rpc_url: `https://goerli.infura.io/v3/${INFURA_KEY}`,
    },
    rinkeby: {
      id: 4,
      name: "rinkeby",
      explorer: "https://rinkeby.etherscan.io/",
      rpc_url: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
    },
    ropsten: {
      id: 3,
      name: "ropsten",
      explorer: "https://ropsten.etherscan.io/",
      rpc_url: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
    },
    mainnet: {
      id: 1,
      name: "mainnet",
      explorer: "https://etherscan.io/",
      rpc_url: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    },
  };
};

export const config = (network: Network, config: ModuleOptions): ZkConfig => {
  const zkSyncNetwork = zkSyncNetworkConfig[network];
  const ethereumNetwork = ethereumNetworkConfig(config.apiKeys.INFURA_KEY)[zkSyncNetwork.ethereumNetwork];
  return {
    zkSyncLibVersion,
    zkUIVersion,
    zkSyncNetwork,
    infuraAPIKey: config.apiKeys.INFURA_KEY,
    ethereumNetwork,
    onboard: onboardConfig(ethereumNetwork, zkSyncNetwork, config),
  };
};
