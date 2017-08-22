// Import the page's CSS. Webpack will know what to do with it.
import '../stylesheets/skeleton.css';
import '../stylesheets/app.css';

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

// Import our contract artifacts and turn them into usable abstractions.
import billboard_artifacts from '../../build/contracts/Billboard.json';

// MetaCoin is our usable abstraction, which we'll use through the code below.
var Billboard = contract(billboard_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    Billboard.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        // alert("Please install https://metamask.io/ and setup and account.");
        var message_element = document.getElementById("alert");
        message_element.innerHTML = "You must install <a href='https://metamask.io'>MetaMask</a> to use Ether Shout.";
        document.getElementById('interact').className += ' invisible';
        document.getElementById('message').className += ' invisible';
        document.getElementById('price').className += ' invisible';
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.refreshData();
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  refreshData: function() {
    var self = this;

    var bb;
    Billboard.deployed().then(function(instance) {
      bb = instance;
      return bb.getMessage.call({ from: account });
    }).then(function(message) {
      var message_element = document.getElementById("messagetext");
      message_element.innerHTML = '"' + message.valueOf() + '"';
      return bb.getPrice.call({ from: account });
    }).then(function(price) {
      var price_element = document.getElementById("pricenum");
      price_element.innerHTML = price.toNumber() / 1000000000000000000;
      return bb.getPendingWithdrawal.call({ from: account });
    }).then(function(funds) {
      var funds_element = document.getElementById("funds");
      funds_element.innerHTML = funds.toNumber() / 1000000000000000000;
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  buyMessage: function() {
    var self = this;

    var amount = parseFloat(document.getElementById("amount").value) * 1000000000000000000;
    var message = document.getElementById("desiredMessage").value;

    this.setStatus("Initiating transaction... (please wait)");

    var bb;
    Billboard.deployed().then(function(instance) {
      bb = instance;
      return bb.setMessage(message, { value: amount, from: account });
    }).then(function() {
      self.setStatus("Transaction complete!");
      self.refreshData();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });
  },

  withdraw: function() {
    var self = this;

    var bb;
    Billboard.deployed().then(function(instance) {
      bb = instance;
      return bb.withdraw({ from: account, gas: 40000 });
    }).then(function() {
      self.setStatus("Withdrawal complete!")
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error withdrawing funds; see log.");
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
