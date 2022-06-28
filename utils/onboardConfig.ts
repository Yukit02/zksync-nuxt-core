import {
  AllWalletInitOptions,
  CommonWalletOptions,
  LedgerOptions,
  Initialization,
  TrezorOptions,
  WalletInitOptions,
  WalletSelectModuleOptions,
} from "bnc-onboard/dist/src/interfaces";
import { ModuleOptions, ZkEthereumNetwork, ZkNetwork } from "../types";
import theme from "./theme";

const wallets = (ethereumNetwork: ZkEthereumNetwork, config: ModuleOptions): Array<WalletInitOptions | CommonWalletOptions | AllWalletInitOptions> => {
  const appURL = process.browser && window?.location ? `https://${window?.location?.host}` : "";
  const basicWallet = {
    appName: config.onboardConfig.APP_NAME,
    appLogoUrl: appURL + "/favicon-dark.png",
    appUrl: appURL,
    networkId: ethereumNetwork.id,
    rpcUrl: ethereumNetwork.rpc_url,
  };
  return [
    { ...basicWallet, walletName: "metamask", preferred: true },
    { ...basicWallet, walletName: "imToken", preferred: true },
    {
      ...basicWallet,
      walletName: "fortmatic",
      apiKey: config.apiKeys.FORTMATIC_KEY,
      preferred: true,
    },
    {
      ...basicWallet,
      walletName: "keystone",
    },
    {
      appUrl: basicWallet.appUrl,
      rpcUrl: basicWallet.rpcUrl,
      email: "support@zksync.io",
      preferred: true,
      walletName: "trezor",
    } as TrezorOptions,
    {
      ...basicWallet,
      walletName: "coinbase",
    },
    {
      networkId: basicWallet.networkId,
      rpcUrl: basicWallet.rpcUrl,
      walletName: "ledger",
      preferred: true,
    } as LedgerOptions,
    {
      ...basicWallet,
      walletName: "lattice",
    },
    {
      ...basicWallet,
      walletName: "portis",
      apiKey: config.apiKeys.PORTIS_KEY,
      display: { desktop: true, mobile: false },
      label: "Portis",
    } as CommonWalletOptions,
    { ...basicWallet, walletName: "atoken" },
    { ...basicWallet, walletName: "opera", display: { desktop: true, mobile: false } } as CommonWalletOptions,
    { ...basicWallet, walletName: "operaTouch", display: { desktop: false, mobile: true } } as CommonWalletOptions,
    { ...basicWallet, walletName: "torus", display: { desktop: true, mobile: false } } as CommonWalletOptions,
    { ...basicWallet, walletName: "status" },
    { ...basicWallet, walletName: "meetone" },
    { ...basicWallet, walletName: "trust" },
    { ...basicWallet, walletName: "wallet.io" },
    { ...basicWallet, walletName: "walletLink" },
    { ...basicWallet, walletName: "tp" },
    { ...basicWallet, walletName: "mykey" },
    { ...basicWallet, walletName: "huobiwallet" },
    { ...basicWallet, walletName: "hyperpay" },
    { ...basicWallet, walletName: "cobovault" },
    { ...basicWallet, walletName: "tokenpocket" },
    { ...basicWallet, walletName: "gnosis" },
    { ...basicWallet, walletName: "dcent" },
    { ...basicWallet, walletName: "xdefi" },
    { ...basicWallet, walletName: "liquality" },
  ];
};

export const onboardConfig = (ethereumNetwork: ZkEthereumNetwork, zkSyncNetwork: ZkNetwork, config: ModuleOptions): Initialization => ({
  hideBranding: true,
  blockPollingInterval: 400000,
  dappId: config.onboardConfig.APP_ID,
  networkId: ethereumNetwork.id,
  networkName: ethereumNetwork.name,
  darkMode: theme.getUserTheme() === "dark",
  walletCheck: [{ checkName: "derivationPath" }, { checkName: "accounts" }, { checkName: "connect" }, { checkName: "network" }],
  walletSelect: <WalletSelectModuleOptions>{
    wallets: wallets(ethereumNetwork, config),
    description: "",
    explanation: `If you have funds on zkSync on an account that you can't control (a smart contract or an exchange deposit account) it is possible to use the <a href="${zkSyncNetwork.tools.forcedExit}" target="_blank">Alternative Withdrawal</a> to move the funds to Layer 1 without interacting with Layer 2.`,
  },
});
