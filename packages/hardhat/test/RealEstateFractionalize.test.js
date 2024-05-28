const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RealEstateFractionalize", function () {
  let RealEstateFractionalize;
  let realEstate;
  let owner, user1, user2, buyer, renter;
  const initialSupply = ethers.utils.parseUnits('1000', 'ether');

  beforeEach(async function () {
    [owner, user1, user2, buyer, renter] = await ethers.getSigners();

    RealEstateFractionalize = await ethers.getContractFactory("RealEstateFractionalize");
    realEstate = await RealEstateFractionalize.deploy("RealEstateToken", "RET", initialSupply);
    await realEstate.deployed();
  });

  it("should allow the owner to register properties", async function () {
    await realEstate.connect(owner).registerProperty(ethers.utils.parseUnits('100', 'ether'));

    const property = await realEstate.properties(0);
    expect(property.value.toString()).to.equal(ethers.utils.parseUnits('100', 'ether').toString());
    expect(property.owner).to.equal(owner.address);
  });

  it("should allow users to buy fractions of a property", async function () {
    await realEstate.connect(owner).registerProperty(ethers.utils.parseUnits('100', 'ether'));
    await realEstate.connect(owner).listPropertyForSale(0, ethers.utils.parseUnits('100', 'ether'));

    await realEstate.connect(buyer).buyFraction(0, ethers.utils.parseUnits('50', 'ether'), {
      value: ethers.utils.parseUnits('50', 'ether')
    });

    const buyerFraction = await realEstate.propertyFractions(0, buyer.address);
    expect(buyerFraction.toString()).to.equal(ethers.utils.parseUnits('50', 'ether').toString());
  });

  it("should allow users to rent properties", async function () {
    await realEstate.connect(owner).registerProperty(ethers.utils.parseUnits('100', 'ether'));
    await realEstate.connect(owner).listPropertyForRent(0, ethers.utils.parseUnits('10', 'ether'));

    await realEstate.connect(renter).rentProperty(0, { value: ethers.utils.parseUnits('10', 'ether') });

    const property = await realEstate.properties(0);
    expect(property.forRent).to.equal(false);
  });

  it("should allow users to sell fractions of a property", async function () {
    await realEstate.connect(owner).registerProperty(ethers.utils.parseUnits('100', 'ether'));
    await realEstate.connect(owner).listPropertyForSale(0, ethers.utils.parseUnits('100', 'ether'));

    await realEstate.connect(buyer).buyFraction(0, ethers.utils.parseUnits('50', 'ether'), {
      value: ethers.utils.parseUnits('50', 'ether')
    });

    await realEstate.connect(buyer).sellFraction(0, ethers.utils.parseUnits('50', 'ether'), user1.address);

    const user1Fraction = await realEstate.propertyFractions(0, user1.address);
    expect(user1Fraction.toString()).to.equal(ethers.utils.parseUnits('50', 'ether').toString());
  });
});
