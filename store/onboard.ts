/* eslint-disable require-await */
// eslint-disable-next-line import/named
import { GetterTree, MutationTree, ActionTree } from "vuex";
import { API as OnboardInstance, Wallet as OnboardWallet, Subscriptions as OnboardSubscriptions, UserState as OnboardUserState } from "bnc-onboard/dist/src/interfaces";
import Onboard from "bnc-onboard";
import { ethers } from "ethers";
import { Wallet, RemoteWallet, RestProvider } from "zksync";
// eslint-disable-next-line import/named
import { ExternalProvider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Address } from "zksync/build/types";
import { config, zkSyncNetworkConfig } from "../utils/config";
import { isMobileDevice } from "../utils";
import { ModuleOptions, ZkOnboardStatus, ZkAPIKeysConfig, ZkOnboardConfig, OnboardType, ZkConfig, ZkLoginOptions } from "../types";
import theme from "../utils/theme";

const loginOptionsDefaults: ZkLoginOptions = {
  requireSigner: false,
  requestAccountState: true,
  autoUpdateAccountState: true,
  requestTransactionHistory: true,
};

let onboard: OnboardInstance | undefined;
let ethereumWallet: OnboardWallet | undefined;
let providerWalletConnect: WalletConnectProvider | undefined;
let ethereumProvider: ExternalProvider | undefined;
let web3Provider: ethers.providers.Web3Provider | undefined;
let networkChange = {
  resolve: <((result: boolean) => void) | undefined>undefined,
  reject: <((result: boolean) => void) | undefined>undefined,
};

export type OnboardState = {
  loginOptions: ZkLoginOptions;
  selectedWallet?: string;
  selectedOnboardType?: OnboardType;
  loadingHint?: string;
  wrongNetwork: boolean;
  options: ModuleOptions;
  onboardInited: boolean;
  onboardStatus: ZkOnboardStatus;
  restoringSession: boolean;
  error: string;
  forceUpdateValue: number;
};

export const state = (options: ModuleOptions): OnboardState => ({
  loginOptions: loginOptionsDefaults,
  selectedWallet: undefined,
  selectedOnboardType: undefined,
  loadingHint: undefined,
  wrongNetwork: false,
  options,
  onboardInited: false,
  onboardStatus: "initial",
  restoringSession: false,
  error: "",
  forceUpdateValue: Number.MIN_SAFE_INTEGER,
});

export const getters: GetterTree<OnboardState, OnboardState> = {
  loginOptions: (state) => state.loginOptions,
  selectedWallet: (state) => state.selectedWallet,
  selectedOnboardType: (state) => state.selectedOnboardType,
  loadingHint: (state) => state.loadingHint,
  wrongNetwork: (state) => state.wrongNetwork,
  onboard: (state) => {
    // eslint-disable-next-line no-unused-expressions
    state.forceUpdateValue;
    return onboard;
  },
  options: (state) => state.options,
  onboardStatus: (state) => state.onboardStatus,
  onboardInited: (state) => state.onboardInited,
  restoringSession: (state) => state.restoringSession,
  error: (state) => state.error,
  ethereumWallet: (state) => {
    // eslint-disable-next-line no-unused-expressions
    state.forceUpdateValue;
    return ethereumWallet;
  },
  providerWalletConnect: (state) => {
    // eslint-disable-next-line no-unused-expressions
    state.forceUpdateValue;
    return providerWalletConnect;
  },
  ethereumProvider: (state) => {
    // eslint-disable-next-line no-unused-expressions
    state.forceUpdateValue;
    return ethereumProvider;
  },
  web3Provider: (state) => {
    // eslint-disable-next-line no-unused-expressions
    state.forceUpdateValue;
    return web3Provider;
  },
  config: (state, _, __, rootGetters) => config(rootGetters["zk-provider/network"], state.options),

  ethereumState: (state) => {
    // eslint-disable-next-line no-unused-expressions
    state.forceUpdateValue;
    return onboard?.getState();
  },
};

export const mutations: MutationTree<OnboardState> = {
  setLoginOptions: (state, loginOptions?: ZkLoginOptions) => {
    state.loginOptions = Object.assign(loginOptionsDefaults, loginOptions);
  },
  setSelectedWallet: (state, walletName?: string) => {
    state.selectedWallet = walletName;
    if (walletName) {
      localStorage.setItem("lastSelectedWallet", walletName);
    } else {
      localStorage.removeItem("lastSelectedWallet");
    }
  },
  setSelectedOnboardType: (state, onboardType?: OnboardType) => {
    state.selectedOnboardType = onboardType;
    if (onboardType) {
      localStorage.setItem("lastSelectedOnboardType", onboardType);
    } else {
      localStorage.removeItem("lastSelectedOnboardType");
    }
  },
  setLoadingHint: (state, loadingHint: string) => (state.loadingHint = loadingHint),
  setWrongNetwork: (state, wrongNetwork: boolean) => (state.wrongNetwork = wrongNetwork),
  setOnboard: (state, onboardInstance: OnboardInstance) => {
    state.forceUpdateValue++;
    onboard = onboardInstance;
  },
  setAPIKeys: (state, onboardConfig: ZkAPIKeysConfig) => (state.options.apiKeys = onboardConfig),
  setOnboardConfig: (state, onboardConfig: ZkOnboardConfig) => (state.options.onboardConfig = onboardConfig),
  setOnboardStatus: (state, status: ZkOnboardStatus) => (state.onboardStatus = status),
  setOnboardInited: (state, status: boolean) => (state.onboardInited = status),
  setRestoringSession: (state, status: boolean) => (state.restoringSession = status),
  setError: (state, error: string) => (state.error = error),
  setEthereumWallet: (state, walletInstance: OnboardWallet) => {
    ethereumWallet = walletInstance;
    state.forceUpdateValue++;
  },
  setEthereumProvider: (state, ethProvider: ExternalProvider) => {
    ethereumProvider = ethProvider;
    state.forceUpdateValue++;
  },
  setWeb3Provider: (state, ethWeb3Provider: ethers.providers.Web3Provider) => {
    web3Provider = ethWeb3Provider;
    state.forceUpdateValue++;
  },
  clear: (state) => {
    state.selectedWallet = undefined;
    state.loadingHint = undefined;
    state.wrongNetwork = false;
    networkChange = {
      resolve: undefined,
      reject: undefined,
    };
    ethereumWallet = undefined;
    ethereumProvider = undefined;
    state.forceUpdateValue++;
  },
};

export const actions: ActionTree<OnboardState, OnboardState> = {
  async onboardInit({ commit, dispatch, getters, rootGetters }) {
    commit(
      "setOnboard",
      Onboard({
        ...getters.config.onboard,
        subscriptions: <OnboardSubscriptions>{
          wallet: async (wallet: OnboardWallet) => {
            if (!wallet.provider) {
              commit("setEthereumWallet", undefined);
              commit("setSelectedWallet", undefined);
              dispatch("zk-account/logout", null, { root: true });
              if (getters.options.logoutRedirect) {
                this.$router.push(getters.options.logoutRedirect);
              }
              return;
            }
            // Was logged in
            if (rootGetters["zk-account/address"]) {
              await dispatch("zk-account/clearAccountData", null, { root: true });
            }
            wallet.provider.autoRefreshOnNetworkChange = false;
            commit("setEthereumWallet", wallet);
            if (wallet.name) {
              commit("setSelectedWallet", wallet.name);
            }
          },
          address: async (address: string) => {
            await dispatch("onAddressChange", { address, walletType: "Onboard" });
          },
        },
      }),
    );
    if (window && window.ethereum) {
      window.ethereum.autoRefreshOnNetworkChange = false;
    }
    commit("setOnboardInited", true);
  },
  async getLastLoginData({ commit }) {
    const lastSelectedWallet = localStorage.getItem("lastSelectedWallet");
    const lastSelectedOnboardType = localStorage.getItem("lastSelectedOnboardType");
    if (lastSelectedWallet) {
      commit("setSelectedWallet", lastSelectedWallet);
    }
    if (lastSelectedOnboardType) {
      commit("setSelectedOnboardType", lastSelectedOnboardType);
    }
  },
  async walletSelect(_, walletName?: string) {
    if (!onboard) {
      console.warn("Onboard wasn't initialized with zk-onboard/onboardInit");
      return false;
    }
    return await onboard.walletSelect(walletName);
  },
  async walletCheck() {
    if (!onboard) {
      console.warn("Onboard wasn't initialized with zk-onboard/onboardInit");
      return false;
    }
    onboard?.config({
      darkMode: theme.getUserTheme() === "dark",
    });
    return await onboard.walletCheck();
  },
  async onAddressChange({ getters, commit, dispatch, rootGetters }, { address, walletType }: { address: Address; walletType: string }) {
    // Was logged in
    if (rootGetters["zk-account/address"] && rootGetters["zk-account/address"] !== address) {
      commit("setLoadingHint", "Switching accounts...");
      commit("setOnboardStatus", "connecting");
      await dispatch("zk-account/clearAccountData", null, { root: true });
      if (walletType === "Onboard") {
        await dispatch("loginWithOnboard", getters.selectedWallet);
      } else if (walletType === "WalletConnect") {
        await dispatch("walletConnectLogin");
      }
    }
  },
  async accountSelect() {
    if (!onboard) {
      console.warn("Onboard wasn't initialized with zk-onboard/onboardInit");
      return false;
    }
    return await onboard.accountSelect();
  },
  async reset({ commit, dispatch }) {
    dispatch("walletConnectDisconnect");
    commit("setOnboardStatus", "initial");
    commit("setSelectedWallet", undefined);
    commit("setSelectedOnboardType", undefined);
    localStorage.removeItem("walletconnect");
    return onboard?.walletReset();
  },
  async rejectNetworkChange() {
    if (networkChange.reject) {
      networkChange.reject(true);
    }
  },
  async loginWithArgent({ commit, dispatch }) {
    commit("setSelectedWallet", "Argent");
    return await dispatch("walletConnectLogin");
  },
  async loginWithWalletConnect({ commit, dispatch }) {
    commit("setSelectedWallet", undefined);
    await dispatch("walletConnectDisconnect");
    return await dispatch("walletConnectLogin");
  },
  async walletConnectLogin({ commit, dispatch, getters }) {
    const projectConfig: ZkConfig = getters.config;
    commit("setSelectedOnboardType", "WalletConnect");
    providerWalletConnect = new WalletConnectProvider({
      infuraId: projectConfig.infuraAPIKey,
      pollingInterval: 10000,
      qrcode: !(getters.selectedWallet === "Argent" && isMobileDevice()),
      chainId: projectConfig.ethereumNetwork.id,
      qrcodeModalOptions:
        getters.selectedWallet === "Argent"
          ? {
              mobileLinks: ["argent"],
            }
          : {},
    });

    try {
      if (!providerWalletConnect) {
        throw new Error("Provider not found");
      }

      providerWalletConnect.connector.on("display_uri", (err, _) => {
        if (err) {
          return console.warn("providerWalletConnect.connector display_uri error\n", err);
        }
        if (getters.selectedWallet === "Argent" && isMobileDevice()) {
          dispatch("zk-wallet/openWalletApp", null, { root: true });
        }
      });

      providerWalletConnect.on("accountsChanged", async (accounts: string[]) => {
        await dispatch("onAddressChange", { address: accounts[0], walletType: "WalletConnect" });
      });

      providerWalletConnect.on("chainChanged", (chainId: number) => {
        if (networkChange.resolve && chainId === (<ZkConfig>getters.config).ethereumNetwork.id) {
          networkChange.resolve(true);
        }
      });

      await providerWalletConnect.enable();
      commit("setSelectedWallet", providerWalletConnect.walletMeta?.name);
      if (providerWalletConnect.chainId !== (<ZkConfig>getters.config).ethereumNetwork.id) {
        commit("setWrongNetwork", true);
        try {
          await new Promise((resolve, reject) => {
            networkChange.resolve = resolve;
            networkChange.reject = reject;
          });
          return await dispatch("login", providerWalletConnect);
        } catch (_) {
          return false;
        } finally {
          commit("setWrongNetwork", false);
        }
      } else {
        return await dispatch("login", providerWalletConnect);
      }
    } catch (error) {
      console.warn("walletConnectLogin error: \n", error);
      await dispatch("reset");
      return false;
    }
  },
  async walletConnectDisconnect() {
    try {
      if (providerWalletConnect && (providerWalletConnect.isConnecting || providerWalletConnect.connected) && providerWalletConnect.disconnect) {
        await providerWalletConnect.disconnect();
      }
    } catch (error) {
      console.warn("Error disconnecting from wallet connect\n", error);
    }
  },
  async checkRightNetwork({ getters, commit, dispatch }) {
    if (getters.selectedOnboardType === "Onboard") {
      const checkResult = await dispatch("zk-onboard/walletCheck", null, { root: true });
      if (!checkResult) {
        return false;
      } else {
        return true;
      }
    } else if (getters.selectedOnboardType === "WalletConnect" && providerWalletConnect) {
      if (providerWalletConnect.chainId === (<ZkConfig>getters.config).ethereumNetwork.id) {
        return true;
      }
      commit("setWrongNetwork", true);
      try {
        await new Promise((resolve, reject) => {
          networkChange.resolve = resolve;
          networkChange.reject = reject;
        });
        return true;
      } catch (_) {
        return false;
      } finally {
        commit("setWrongNetwork", false);
      }
    }
    return false;
  },
  async loginWithOnboard({ getters, commit, dispatch }, walletName?: string) {
    /* Onboard process */
    if (!getters.onboardInited) {
      await dispatch("onboardInit");
    }
    const selectWalletResult = await dispatch("walletSelect", walletName);
    if (!selectWalletResult) {
      return dispatch("reset");
    }
    const disabledWallet = (getters.options as ModuleOptions).disabledWallets.find((e) => e.name === getters.selectedWallet);
    if (disabledWallet) {
      commit("setError", disabledWallet.error);
      return dispatch("reset");
    }
    const checkResult = await dispatch("walletCheck");
    if (!checkResult) {
      return dispatch("reset");
    }
    const ethereumState: OnboardUserState | undefined = getters.ethereumState;
    if (!ethereumState) {
      return dispatch("reset");
    }
    commit("setSelectedOnboardType", "Onboard");
    return await dispatch("login", (getters.ethereumWallet as OnboardWallet).provider);
  },
  async login({ getters, commit, dispatch }, ethProvider?: ExternalProvider) {
    if (!ethProvider) {
      return dispatch("reset");
    }
    const options: ZkLoginOptions = getters.loginOptions;
    /* zkSync log in process */
    commit("setEthereumProvider", ethProvider);
    commit("setLoadingHint", "Processing...");
    commit("setOnboardStatus", "connecting");
    let syncProvider: RestProvider;
    try {
      syncProvider = await dispatch("zk-provider/requestProvider", null, { root: true });
    } catch (error) {
      dispatch("zk-account/logout", null, { root: true });
      return dispatch("reset");
    }
    web3Provider = new ethers.providers.Web3Provider(ethProvider);
    commit("setWeb3Provider", web3Provider);
    const ethWallet = web3Provider.getSigner();
    if (options.requireSigner) {
      commit("setLoadingHint", "Follow the instructions in your Ethereum wallet");
    }
    let syncWallet: Wallet | RemoteWallet | undefined;
    if (getters.selectedWallet === "Argent") {
      commit("zk-wallet/setRemoteWallet", true, { root: true });
      syncWallet = await RemoteWallet.fromEthSigner(web3Provider, syncProvider);
    } else {
      syncWallet = await Wallet[options.requireSigner ? "fromEthSigner" : "fromEthSignerNoKeys"](ethWallet, syncProvider);
      commit("zk-wallet/setRemoteWallet", false, { root: true });
    }
    if (!syncWallet) {
      return dispatch("reset");
    }
    commit("setLoadingHint", "Getting wallet information...");

    /* Set account data */
    commit("zk-account/setAddress", syncWallet.address(), { root: true });
    commit("zk-wallet/setSyncWallet", syncWallet, { root: true });
    commit("zk-account/setLoggedIn", true, { root: true });

    /* Get needed initial data */
    dispatch("zk-account/setInitialName", null, { root: true });
    if (options.requestAccountState) {
      dispatch("zk-account/updateAccountState", null, { root: true });
      dispatch("zk-wallet/checkCPK", null, { root: true });
    }
    if (options.autoUpdateAccountState) {
      dispatch("zk-account/autoUpdateAccountState", 30000, { root: true });
    }
    if (options.requestTransactionHistory) {
      dispatch("zk-history/getTransactionHistory", null, { root: true });
    }
    dispatch("zk-tokens/loadZkTokens", null, { root: true });
    dispatch("zk-contacts/requestContacts", null, { root: true });

    commit("setOnboardStatus", "authorized");
    return true;
  },
  async restoreLastNetwork({ commit }) {
    const lastSelectedNetwork = localStorage.getItem("lastSelectedNetwork");
    if (lastSelectedNetwork && Object.prototype.hasOwnProperty.call(zkSyncNetworkConfig, lastSelectedNetwork)) {
      commit("zk-provider/setNetwork", lastSelectedNetwork, { root: true });
    }
  },
  async restoreLogin({ getters, commit, dispatch }) {
    commit("setRestoringSession", true);
    commit("setLoadingHint", "Restoring session...");
    if (getters.options.restoreNetwork) {
      await dispatch("restoreLastNetwork");
    }
    await dispatch("getLastLoginData");
    let loginResult: boolean = false;
    if (getters.selectedOnboardType === "Onboard") {
      loginResult = await dispatch("loginWithOnboard", getters.selectedWallet);
    } else if (getters.selectedOnboardType === "WalletConnect") {
      loginResult = await dispatch("walletConnectLogin");
    }
    commit("setRestoringSession", false);
    return loginResult;
  },
};

export default (options: ModuleOptions) => ({
  namespaced: true,
  state: state(options),
  getters,
  mutations,
  actions,
});
