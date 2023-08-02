const Token = artifacts.require("ERC20");
const expect = require('chai').expect;

contract("test token.js", (accounts) => {
  [accountOne, accountTwo, owner] = accounts;

  before(async () => {
    TokenERC20 = await Token.new("German", "GMN", "18", "10000");
  });

  describe("constructor testing", async () => {
    it("The name of token should be equals to 'German'", async () => {
        const res = TokenERC20.name();
        expect(res).to.not.equal('german')
    });
  });
});
