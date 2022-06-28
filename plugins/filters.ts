import Vue from "vue";
import { Context } from "@nuxt/types";
import { TokenSymbol } from "zksync/build/types";
import { BigNumberish } from "ethers";
import { parseDecimal, parseBigNumberish, formattedPrice, formatBigNumLimited } from "../utils";
import { DecimalBalance } from "../types";

export default ({ store }: Context) => {
  Vue.filter("parseDecimal", (amount: DecimalBalance, symbol: TokenSymbol) => parseDecimal(store.getters["zk-provider/syncProvider"], symbol, amount));
  Vue.filter("parseBigNumberish", (amount: BigNumberish, symbol: TokenSymbol) => parseBigNumberish(store.getters["zk-provider/syncProvider"], symbol, amount));
  Vue.filter("formatBigNumLimited", (amount: BigNumberish, symbol: TokenSymbol, limit: number) =>
    formatBigNumLimited(store.getters["zk-provider/syncProvider"], symbol, amount, limit),
  );
  Vue.filter("formattedPrice", (amount: number, symbol: TokenSymbol) => {
    // eslint-disable-next-line no-unused-expressions
    store.getters["zk-tokens/forceUpdateVal"];
    if (store.getters["zk-tokens/tokenPrices"][symbol] === undefined) {
      return "";
    }
    const parsedBigNum = parseBigNumberish(store.getters["zk-provider/syncProvider"], symbol, amount);
    if (!parsedBigNum) {
      return "";
    }
    return formattedPrice(store.getters["zk-tokens/tokenPrices"][symbol], parseFloat(parsedBigNum));
  });
};
