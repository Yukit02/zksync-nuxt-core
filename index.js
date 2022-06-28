import { join, resolve } from "path";

const namespace = "zk-ui";

export default function (moduleOptions) {
  const options = Object.assign(
    {
      network: "mainnet",
      ipfsGateway: "https://ipfs.io",
      apiKeys: {
        FORTMATIC_KEY: undefined,
        PORTIS_KEY: undefined,
        INFURA_KEY: undefined,
      },
      onboardConfig: {
        APP_NAME: undefined,
        APP_ID: undefined,
      },
      disabledWallets: [],
      logoutRedirect: "/",
      restoreNetwork: false,
    },
    moduleOptions,
  );

  /* Registering plugins */
  const pluginsToSync = [
    "package.json",
    "types/index.ts",
    "utils/theme.ts",
    "utils/deeplinker.ts",
    "plugins/themeMode.ts",
    "utils/index.ts",
    "utils/onboardConfig.ts",
    "utils/config.ts",
    "plugins/filters.ts",
    "store/provider.ts",
    "store/tokens.ts",
    "store/wallet.ts",
    "store/fees.ts",
    "store/balances.ts",
    "store/history.ts",
    "store/transaction.ts",
    "store/onboard.ts",
    "store/account.ts",
    "store/contacts.ts",
    "store/index.ts",
  ];
  for (const pathString of pluginsToSync) {
    this.addPlugin({
      src: resolve(__dirname, pathString),
      fileName: join(namespace, pathString),
      options,
    });
  }
}

module.exports.meta = require("./package.json");
