# zkSync DApp Nuxt Module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

[📖 **Release Notes**](./CHANGELOG.md)

## Setup

1. Add `@matterlabs/zksync-nuxt-core` dependency to your project

```bash
yarn add @matterlabs/zksync-nuxt-core
# or
npm install @matterlabs/zksync-nuxt-core
```

2. Add `@matterlabs/zksync-nuxt-core` to the `buildModules` section of `nuxt.config.js`

#### JS

```js
{
    buildModules: [
        [
            "matter-dapp-ui",
            {
                // module options (ref. types/index.ts ModuleOptions)
            },
        ]
    ],
}
```

#### TS

```ts
import { ModuleOptions } from "matter-dapp-ui/types";
{
    buildModules: [
        [
            "matter-dapp-ui",
            <ModuleOptions>{
                // module options (ref. types/index.ts ModuleOptions)
            },
        ]
    ],
}
```

## Development

1. Clone this repository
2. Go to the package and [link](https://classic.yarnpkg.com/en/docs/cli/link/) it with `yarn link`
3. Go to your nuxt project where you want to use the module
4. Install link dependency with `yarn link @matterlabs/zksync-nuxt-core`
5. Import the module into your project as shown [above](#setup)
6. Done ✅

## License

[MIT License](./LICENSE)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@matterlabs/zksync-nuxt-core/latest.svg
[npm-version-href]: https://npmjs.com/package/@matterlabs/zksync-nuxt-core
[npm-downloads-src]: https://img.shields.io/npm/dm/@matterlabs/zksync-nuxt-core.svg
[npm-downloads-href]: https://npmjs.com/package/@matterlabs/zksync-nuxt-core
[license-src]: https://img.shields.io/npm/l/@matterlabs/zksync-nuxt-core.svg
[license-href]: https://npmjs.com/package/@matterlabs/zksync-nuxt-core


