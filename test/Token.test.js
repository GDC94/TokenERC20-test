const Token = artifacts.require("ERC20");
const expect = require('chai').expect;

contract("test token.js", (accounts) => {
  [accountOne, accountTwo, owner] = accounts;

  before(async () => {
    TokenERC20 = await Token.new("German", "GMN", "18", "10000");
  });



  describe("Testing on transfer method", async () => {
    it("prueba en el metodo transfer", async () => {
        const res = await TokenERC20.transfer(accountOne, '5000', {from: owner});
        const res2 = await TokenERC20.balanceOf(owner);
        expect(res2).to.equal(5000);
    });
  });
});