// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    live: {
      host: "localhost", // Connect to geth on the specified
      port: 8545,
      network_id: 1,
      gasPrice: 4000000000,
      gas: 4612388 // Gas limit used for deploys
    },
    rinkeby: {
      host: "localhost", // Connect to geth on the specified
      port: 8545,
      from: "0x4994cf4b130e47174cb9b43de151d2572992773b", // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 4612388 // Gas limit used for deploys
    }
  }
}
