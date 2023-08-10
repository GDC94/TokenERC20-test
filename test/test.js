const Tokenjson = artifacts.require("ERC20");
const { expect } = require("chai");

contract("test js", (accounts) => {
  [alice, bob, owner, peter, spender, recipient] = accounts;

  before(async () => {
    Token = await Tokenjson.new("German", "GMN", "18", "10000", {
      from: owner,
    });
    // Aprobación inicial del propietario para que el spender gaste 500 tokens
    await Token.approve(alice, 500, { from: owner });
    await Token.approve(spender, 500, { from: owner });
  });

  describe("Proofs into the constructor", async () => {
    it("The name of token should be equals to German", async () => {
      const nameOfToken = await Token.name();
      expect(nameOfToken).to.equal("German");
      expect(nameOfToken).to.not.equal("german");
    });

    it("The Symbol of token should be equal to GMN", async () => {
      const symbol = await Token.symbol();
      expect(symbol).to.equal("GMN");
      expect(symbol).to.not.equal("gmn");
    });

    it("The decimals of token should be equals to 18", async () => {
      const expectedDecimals = 18;
      const actualDecimals = await Token.decimals();
      expect(actualDecimals.toNumber()).to.equal(expectedDecimals);
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

  describe("Proofs in a Transfer method", async () => {
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

  describe("Token", () => {
    it("debería transferir tokens desde el spender al destinatario después de la aprobación", async () => {
      const transferAmount = 100;
      // El spender realiza la transferencia desde el owner al destinatario
      const result = await Token.transferFrom(
        owner,
        recipient,
        transferAmount,
        { from: spender }
      );
      // Verifica que la transferencia sea exitosa
      console.log(result.receipt);
      expect(result.receipt.status).to.equal(true);

      // Verifica que los balances se hayan actualizado correctamente
      const ownerBalance = await Token.balanceOf(owner);
      const recipientBalance = await Token.balanceOf(recipient);
      expect(ownerBalance.toNumber()).to.equal(4900); // 10000 - 300
      expect(recipientBalance.toNumber()).to.equal(100);
    });
  });
});
