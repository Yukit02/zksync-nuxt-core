import { Address, Network, TokenSymbol, NFT, ChangePubKeyFee, LegacyChangePubKeyFee, TokenLike, PubKeyHash, ApiTransaction } from "zksync/build/types";
// eslint-disable-next-line import/named
import { BigNumber, BigNumberish } from "ethers";
import { Initialization as OnboardOptions } from "bnc-onboard/dist/src/interfaces";

export type Link = `https://${string}/`;

export type EthereumNetwork = "rinkeby" | "ropsten" | "goerli" | "mainnet";

export type TransactionType = "Withdraw" | "Transfer" | "FastWithdraw" | "MintNFT" | "WithdrawNFT" | "FastWithdrawNFT" | ChangePubKeyFee | LegacyChangePubKeyFee | "Swap";

export type OnboardType = "Onboard" | "WalletConnect";

export type DecimalBalance = string;

export type ZkEthereumNetworkName = "localhost" | "rinkeby" | "rinkeby-beta" | "ropsten" | "goerli-beta" | "mainnet";

export type Token = {
  id: number;
  address: Address;
  symbol: TokenSymbol;
  decimals: number;
  is_nft: boolean;
  enabledForFees: boolean;
};

export type ZkAPIKeysConfig = {
  FORTMATIC_KEY: string;
  PORTIS_KEY: string;
  INFURA_KEY: string;
};

export type ZkOnboardConfig = {
  APP_NAME: string;
  APP_ID: string;
};

export type ModuleOptions = {
  network: Network;
  ipfsGateway: string;
  apiKeys: ZkAPIKeysConfig;
  onboardConfig: ZkOnboardConfig;
  disabledWallets: { name: string; error: string }[];
  logoutRedirect: false | string;
  restoreNetwork: boolean;
};

export type ZkTransactionType =
  | "Mint"
  | "Allowance"
  | "Deposit"
  | "Transfer"
  | "TransferBatch"
  | "Withdraw"
  | "MintNFT"
  | "TransferNFT"
  | "WithdrawNFT"
  | "CPK"
  | "WithdrawPending";

export type ZkTransactionMainToken = false | "L1-Tokens" | "L2-NFT" | "L2-Tokens" | "PendingTokens";

export type ZkTransactionStep = "initial" | "processing" | "requestingLatestFees" | "awaitingUserAction" | "waitingForUserConfirmation" | "committing" | "updating" | "finished";

export type ZkActiveTransactionAllowanceData = {
  token: TokenSymbol;
  allowance: BigNumber;
};

export type ZkActiveTransactionData = ZkActiveTransactionAllowanceData;

export type ZkActiveTransaction = {
  type: ZkTransactionType;
  step: ZkTransactionStep;
  txHash?: string;
  address?: Address;
  amount?: BigNumberish;
  token?: TokenLike;
  fee?: BigNumberish;
  feeToken?: TokenSymbol;
  data?: ZkActiveTransactionData;
};

export type ZkOnboardStatus = "initial" | "connecting" | "authorized";

export type ZkTokenPrices = {
  [symbol: string]: number;
};

export type ZkContact = {
  address: Address;
  name: string;
  deleted?: boolean;
};
export type ZkContacts = {
  [address: string]: ZkContact;
};

export type ZkCPKStatus = boolean | "signed";

export type ZkTokenBalance = {
  balance: BigNumberish;
  verified: boolean;
  feeAvailable: boolean;
};
export type ZkTokenBalances = {
  [symbol: string]: ZkTokenBalance;
};

export type ZkEthereumBalances = {
  [symbol: string]: BigNumber;
};

export type ZkNFTBalances = {
  [tokenId: number]: NFT;
};

export type ZkFeeParams = {
  address: Address;
  symbol: TokenSymbol;
  feeSymbol: TokenSymbol;
  force?: boolean;
};

export interface ZkFeeTransactionParams extends ZkFeeParams {
  type: TransactionType;
}

export interface ZkInNFT extends NFT {
  verified: boolean;
}

export type ZkFeeType = "txFee" | "accountActivation";

export type ZkFee = {
  key: ZkFeeType;
  amount?: BigNumber;
};

export type ZkFeeChange = {
  symbol: TokenSymbol;
  amount: BigNumber;
};

export type ZkFeesChange = {
  [key: string]: ZkFeeChange;
};

export type ZkTransferBatchItem = {
  address: Address;
  amount: BigNumberish;
  token: TokenSymbol;
};

export type ZkNetwork = {
  ethereumNetwork: EthereumNetwork;
  explorer: Link;
  api: Link;
  tools: {
    forcedExit: Link;
    link: Link;
    withdrawal: Link;
    mint: Link;
  };
};

export type ZkNetworkConfig = {
  [name in Network]: ZkNetwork;
};

export type ZkEthereumNetwork = {
  id: number;
  name: EthereumNetwork;
  explorer: Link;
  rpc_url: string;
};

export type ZkEthereumNetworkConfig = {
  [name in EthereumNetwork]: ZkEthereumNetwork;
};

export type ZkConfig = {
  zkSyncLibVersion: string;
  zkUIVersion: string;
  infuraAPIKey: string;
  zkSyncNetwork: ZkNetwork;
  ethereumNetwork: ZkEthereumNetwork;
  onboard: OnboardOptions;
};

export type ZkLoginOptions = {
  requireSigner: boolean;
  requestAccountState: boolean;
  autoUpdateAccountState: boolean;
  requestTransactionHistory: boolean;
};

export type ZkTransactionHistoryLoadingState = false | "main" | "previous" | "new";

export type ZkFilteredTransactionHistory = {
  transactions: ApiTransaction[];
  allLoaded: boolean;
  error: boolean;
};

export type ZkWithdrawalEthTxs = {
  [zkSyncTxHash: string]: string;
};

export interface ZkCPKLocal {
  accountId: number;
  account: Address;
  newPkHash: PubKeyHash;
  nonce: number;
  ethSignature?: string;
  validFrom: number;
  validUntil: number;
}

export type ZkSignCPKState = false | "processing" | "waitingForUserConfirmation" | "updating";
