import { providers } from "ethers";
import "./types";

declare global {
  interface Window {
    // @ts-ignore
    ethereum: providers.BaseProvider | providers.ExternalProvider | providers.JsonRpcFetchFunc | WalletLinkProvider | undefined;
    opera: any;
  }
}
