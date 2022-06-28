import { Context } from "@nuxt/types";
import { ModuleOptions } from "../types";

import providerModule from "./provider";
import tokensModule from "./tokens";
import walletModule from "./wallet";
import feesModule from "./fees";
import balancesModule from "./balances";
import historyModule from "./history";
import accountModule from "./account";
import transactionModule from "./transaction";
import onboardModule from "./onboard";
import contactsModule from "./contacts";
// eslint-disable-next-line quotes
const options: ModuleOptions = JSON.parse(`<%= JSON.stringify(options) %>`);

export default ({ store }: Context) => {
  const modules = [
    ["provider", providerModule],
    ["tokens", tokensModule],
    ["wallet", walletModule],
    ["fees", feesModule],
    ["balances", balancesModule],
    ["history", historyModule],
    ["account", accountModule],
    ["transaction", transactionModule],
    ["onboard", onboardModule],
    ["contacts", contactsModule],
  ];
  for (const module of modules) {
    /* TODO: Figure out the issue with typing of module[1](options) */
    // @ts-ignore
    store.registerModule("zk-" + module[0], module[1](options), {
      preserveState: Boolean(store.state["zk-" + module[0]]),
    });
  }
};
