<h1 align="center">
  <img src="https://img.ideal-postcodes.co.uk/Ideal%20Postcodes%20Axios%20Logo@3x.png" alt="Ideal Postcodes Axios">
</h1>

> Axios backed JavaScript client for api.ideal-postcodes.co.uk

![CI](https://github.com/ideal-postcodes/core-axios/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/ideal-postcodes/core-axios/branch/master/graph/badge.svg)](https://codecov.io/gh/ideal-postcodes/core-axios)
[![Dependency Status](https://david-dm.org/ideal-postcodes/core-axios.svg)](https://david-dm.org/ideal-postcodes/core-axios)
[![npm version](https://badge.fury.io/js/%40ideal-postcodes%2Fcore-axios.svg)](https://www.npmjs.com/package/@ideal-postcodes/core-axios)
[![install size](https://packagephobia.now.sh/badge?p=@ideal-postcodes/core-axios)](https://packagephobia.now.sh/result?p=@ideal-postcodes/core-axios)
[![Release](https://github.com/ideal-postcodes/core-axios/workflows/Release/badge.svg)](https://github.com/ideal-postcodes/core-axios/actions)

`@ideal-postcodes/core-axios` is the Axios backed client for api.ideal-postcodes.co.uk. Axios is a promise based HTTP client for the browser and node.js and so is ideal for:

- Frameworks that utilise server side rendering (Angular, Next.js, React, etc)
- Isomorphic code (runs on browser and server)

Our JavaScript client implements a common interface defined at [@ideal-postcodes/core-interface](https://github.com/ideal-postcodes/core-interface).

High level client documentation can be found at [core-interface](https://github.com/ideal-postcodes/core-interface/blob/master/README.md).

In depth client documentation can be found at [core-interface.ideal-postcodes.dev](https://core-interface.ideal-postcodes.dev).

## Links

- [Configuration & Usage](#configuration--usage)
- [Quickstart](#quickstart)
- [Client Documentation](https://github.com/ideal-postcodes/core-interface/blob/master/README.md)
- [In Depth Client Documentation](https://core-interface.ideal-postcodes.dev/#documentation)
- [npm Module](https://www.npmjs.com/package/@ideal-postcodes/core-axios)
- [GitHub Repository](https://github.com/ideal-postcodes/core-axios)

## Other JavaScript Clients

- [Node.js Client Repository](https://github.com/ideal-postcodes/core-node)
- [Browser Client Repository](https://github.com/ideal-postcodes/core-browser)
- [Bundled Browser Client Repository](https://github.com/ideal-postcodes/core-browser-bundled)

## Documentation

### Configuration & Usage

- [Install](#install)
- [Instantiate](#instantiate) and [Use](#use) client
- [Catch Errors](#catch-errors)

#### Install

```bash
npm install @ideal-postcodes/core-axios
```

#### Instantiate

```javascript
import { Client } from "@ideal-postcodes/core-axios"

const client = new Client({ api_key: "iddqd" });
```

[Configuration options](https://core-interface.ideal-postcodes.dev/interfaces/client.config)

#### Use

```javascript
import { lookupPostcode } from "@ideal-postcodes/core-axios"

const addresses = await lookupPostcode({ client, postcode: "SW1A2AA" });
```

#### Catch Errors

```javascript
import { errors, lookupAddress } from "@ideal-postcodes/core-axios"

try {
  await lookupAddress({ client, query: "10 downing street" });
} catch (error) {
  if (error instanceof errors.IdpcRequestFailedError) {
    // IdpcRequestFailedError indicates a 402 response code
    // Possibly the key balance has been depleted
  }
}
```

## Test

```bash
npm test
```

## Licence

MIT
