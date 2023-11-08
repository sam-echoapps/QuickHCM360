## [3.0.7](https://github.com/ideal-postcodes/core-axios/compare/3.0.6...3.0.7) (2022-01-06)


### Bug Fixes

* **Axios:** Pin to version 0.24.0 ([4a6983e](https://github.com/ideal-postcodes/core-axios/commit/4a6983e))

## [3.0.6](https://github.com/ideal-postcodes/core-axios/compare/3.0.5...3.0.6) (2021-10-15)


### Bug Fixes

* **axios:** Pin to 0.21 ([e8649c7](https://github.com/ideal-postcodes/core-axios/commit/e8649c7))

## [3.0.5](https://github.com/ideal-postcodes/core-axios/compare/3.0.4...3.0.5) (2021-10-04)


### Bug Fixes

* **deps:** bump axios from 0.21.3 to 0.22.0 ([#430](https://github.com/ideal-postcodes/core-axios/issues/430)) ([4295410](https://github.com/ideal-postcodes/core-axios/commit/4295410))

## [3.0.4](https://github.com/ideal-postcodes/core-axios/compare/3.0.3...3.0.4) (2021-09-07)


### Bug Fixes

* **Bump:** Update axios ([0d0abd6](https://github.com/ideal-postcodes/core-axios/commit/0d0abd6))

## [3.0.3](https://github.com/ideal-postcodes/core-axios/compare/3.0.2...3.0.3) (2021-07-23)


### Bug Fixes

* **Build:** Target ES2020 ([5e3d8fb](https://github.com/ideal-postcodes/core-axios/commit/5e3d8fb))

## [3.0.2](https://github.com/ideal-postcodes/core-axios/compare/3.0.1...3.0.2) (2021-07-23)


### Bug Fixes

* **Core-Interface:** Bump version ([7b0c1ca](https://github.com/ideal-postcodes/core-axios/commit/7b0c1ca))

## [3.0.1](https://github.com/ideal-postcodes/core-axios/compare/3.0.0...3.0.1) (2021-07-19)


### Bug Fixes

* **Deps:** Bump core-interface ([bb5fc87](https://github.com/ideal-postcodes/core-axios/commit/bb5fc87))

# [3.0.0](https://github.com/ideal-postcodes/core-axios/compare/2.2.4...3.0.0) (2021-06-08)


### Features

* **Core Interface:** Update to Version 2 ([a93bb13](https://github.com/ideal-postcodes/core-axios/commit/a93bb13))


### BREAKING CHANGES

* **Core Interface:** - Package now exports a `defaults` object
- Client.defaults has been removed
- All client config is now stored in `client.config`
- All resources have been removed from the client. Instead retrieve
these from the library and inject the client. E.g.
`client.postcodes.retrieve` becomes `postcodes.retrieve(client, ...)`
- Helper methods (like lookupPostcode, ping) have been removed from the client.
Instead retrieve these from the library and inject the client. E.g.
`client.lookupPostcode` becomes `lookupPostcode(client, ...)`

## [2.2.4](https://github.com/ideal-postcodes/core-axios/compare/2.2.3...2.2.4) (2021-01-15)


### Bug Fixes

* **Deps:** Bump core-interface to 1.9.0 ([528c822](https://github.com/ideal-postcodes/core-axios/commit/528c822))

## [2.2.3](https://github.com/ideal-postcodes/core-axios/compare/2.2.2...2.2.3) (2020-11-27)


### Bug Fixes

* **Core Interface:** Bump core interface ([21c9764](https://github.com/ideal-postcodes/core-axios/commit/21c9764))

## [2.2.2](https://github.com/ideal-postcodes/core-axios/compare/2.2.1...2.2.2) (2020-11-27)


### Bug Fixes

* **tsconfig:** Bump tsconfig ([962ccfa](https://github.com/ideal-postcodes/core-axios/commit/962ccfa))

## [2.2.1](https://github.com/ideal-postcodes/core-axios/compare/2.2.0...2.2.1) (2020-11-20)


### Bug Fixes

* **ESM:** Target ESNext ([c15fb2f](https://github.com/ideal-postcodes/core-axios/commit/c15fb2f))

# [2.2.0](https://github.com/ideal-postcodes/core-axios/compare/2.1.0...2.2.0) (2020-10-26)


### Features

* **ESM:** Add ESM Build ([0a2780e](https://github.com/ideal-postcodes/core-axios/commit/0a2780e))

# [2.1.0](https://github.com/ideal-postcodes/core-axios/compare/2.0.0...2.1.0) (2020-08-07)


### Features

* **Core Interface:** Bump to 1.6.0 ([0bda2ce](https://github.com/ideal-postcodes/core-axios/commit/0bda2ce))

# [2.0.0](https://github.com/ideal-postcodes/core-axios/compare/1.1.0...2.0.0) (2020-06-25)


### chore

* **Node:** Drop explicit support for Node 8 ([3a41f25](https://github.com/ideal-postcodes/core-axios/commit/3a41f25))
* **Node:** Drop node 8 support, add 14 ([e7064ce](https://github.com/ideal-postcodes/core-axios/commit/e7064ce))


### BREAKING CHANGES

* **Node:** Node 8 no longer supported
* **Node:** Node 8 no longer forms part of CI testing

# [1.1.0](https://github.com/ideal-postcodes/core-axios/compare/1.0.2...1.1.0) (2020-02-07)


### Features

* **core-interface:** Upgrade to 1.5.0 ([aeffba7](https://github.com/ideal-postcodes/core-axios/commit/aeffba7))

## [1.0.2](https://github.com/ideal-postcodes/core-axios/compare/1.0.1...1.0.2) (2020-01-22)


### Bug Fixes

* **Headers:** Drop default user agent ([6c7ddd6](https://github.com/ideal-postcodes/core-axios/commit/6c7ddd6))

## [1.0.1](https://github.com/ideal-postcodes/core-axios/compare/1.0.0...1.0.1) (2020-01-22)


### Bug Fixes

* **README:** Fix docs ([1a45721](https://github.com/ideal-postcodes/core-axios/commit/1a45721))

# 1.0.0 (2020-01-22)


### Features

* **Axios:** Initial commit ([784baf3](https://github.com/ideal-postcodes/core-axios/commit/784baf3))
* **Release:** Add semantic release ([25e1875](https://github.com/ideal-postcodes/core-axios/commit/25e1875))
