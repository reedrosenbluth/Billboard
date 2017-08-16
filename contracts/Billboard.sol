pragma solidity ^0.4.4;

contract Billboard {

  uint public price;
  address public author;
  string public message;

  mapping (address => uint) pendingWithdrawals;

  function Billboard() payable {
    message = "hello world";
    price = msg.value;
    author = msg.sender;
  }

  function setMessage(string m) payable returns(bool) {
    if (msg.value > price) {
      pendingWithdrawals[author] += msg.value;
      price = msg.value;
      author = msg.sender;
      message = m;
      return true;
    } else {
      return false;
    }
  }

  function withdraw() {
    uint amount = pendingWithdrawals[msg.sender];
    pendingWithdrawals[msg.sender] = 0;
    msg.sender.transfer(amount);
  }

  function getMessage() returns(string) {
    return message;
  }

  function getPrice() returns(uint) {
    return price;
  }

  function getPendingWithdrawal() returns(uint) {
    return pendingWithdrawals[msg.sender];
  }

}
