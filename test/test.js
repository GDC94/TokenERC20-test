const Tokenjson = artifacts.require("ERC20");
const { expect } = require("chai");

contract("test js", (accounts) => {
  [alice, bob, owner, peter] = accounts;

  before(async () => {
    Token = await Tokenjson.new("German", "GMN", "18", "10000", {
      from: owner,
    });
    // Aprobación inicial del propietario para que el spender gaste 500 tokens
    await Token.approve(alice, 500, { from: owner });
  });

  describe("Proofs into the constructor", async () => {
    it("The name of token should be equals to German", async () => {
      const res = await Token.name();
      expect(res).to.equal("German");
    });

    it("The Symbol of token should be equal to GMN", async () => {
      const res = await Token.symbol();
      expect(res).to.equal("GMN");
    });

    it("The decimals of token should be equals to 18", async () => {
      const res = await Token.decimals();
      console.log(res);
    });
    it("The balance owner should be eql to 10000", async () => {
      const res = await Token.balanceOf(owner);
      const balanceOwner = "10000";
      expect(res.toString()).to.eql(balanceOwner);
    });
  });

  describe("Proofs on Total Supply method ", async () => {
    it("The total supply should be equal to 10000 ", async () => {
      const totalSupply = await Token.totalSupply();
      expect(totalSupply.toString()).to.equal("10000");
    });
  });

  describe("Proofs on Total approve method", () => {
    it("Should allow approval for peter tokens to spend", async () => {
      const approvalAmount = 500; // Cantidad a aprobar
      const result = await Token.approve(peter, approvalAmount, {
        from: owner,
      });

      expect(result.logs[0].event).to.equal("Approval");
      expect(result.logs[0].args._owner).to.equal(owner);
      expect(result.logs[0].args._spender).to.equal(peter);
      const approvedValue = result.logs[0].args._value.words[0];
      expect(approvedValue).to.equal(approvalAmount);
    });
  });

  describe("Proofs on Allowance method", () => {
    it("Should be return the amount of tokens allowed to spend for alice", async () => {
      const allowedAmount = await Token.allowance(owner, alice);
      expect(allowedAmount.toString()).to.equal("500");
    });
  });

  describe("transfer", async () => {
    it("transfer success", async () => {
      await Token.transfer(bob, "5000", {
        from: owner,
      });
      const balanceOwnerAfterTransfer = (
        await Token.balanceOf(owner)
      ).toString();
      expect(balanceOwnerAfterTransfer).to.equal("5000");
    });
  });
});
