import { expect } from "chai";
import { ethers } from "hardhat";

describe("RealEstateFractionalize", function () {
  let RealEstateFractionalize, realEstateFractionalize;
  let owner, addr1, addr2, addr3;
  const listingPrice = ethers.utils.parseEther("1");

  beforeEach(async function () {
    RealEstateFractionalize = await ethers.getContractFactory("RealEstateFractionalize");
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
    realEstateFractionalize = await RealEstateFractionalize.deploy(
      "Real Estate Token",
      "RET",
      ethers.utils.parseEther("1000000"),
    );
    await realEstateFractionalize.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await realEstateFractionalize.owner()).to.equal(owner.address);
    });

    it("Should have correct initial supply", async function () {
      const ownerBalance = await realEstateFractionalize.balanceOf(owner.address);
      expect(await realEstateFractionalize.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Listing Price", function () {
    it("Should allow owner to set listing price", async function () {
      await realEstateFractionalize.setListingPrice(listingPrice);
      expect(await realEstateFractionalize.getListingPrice()).to.equal(listingPrice);
    });
  });

  describe("Register Property", function () {
    beforeEach(async function () {
      await realEstateFractionalize.setListingPrice(listingPrice);
    });

    it("Should register a property and transfer listing price", async function () {
      await expect(
        realEstateFractionalize.registerProperty(ethers.utils.parseEther("100"), 100, "https://property.uri", {
          value: listingPrice,
        }),
      ).to.changeEtherBalances([owner, realEstateFractionalize], [-listingPrice, listingPrice]);

      const property = await realEstateFractionalize.properties(0);
      expect(property.owner).to.equal(owner.address);
      expect(property.value).to.equal(ethers.utils.parseEther("100"));
      expect(property.totalFractions).to.equal(100);
      expect(property.propertyURI).to.equal("https://property.uri");
    });
  });

  describe("Buy Fraction", function () {
    beforeEach(async function () {
      await realEstateFractionalize.setListingPrice(listingPrice);
      await realEstateFractionalize.registerProperty(ethers.utils.parseEther("100"), 100, "https://property.uri", {
        value: listingPrice,
      });
      await realEstateFractionalize.listPropertyForSale(0, ethers.utils.parseEther("100"));
    });

    it("Should allow user to buy fractions and transfer fees", async function () {
      const cost = ethers.utils.parseEther("10");
      const fee = cost.mul(5).div(1000);
      const netAmount = cost.sub(fee);

      await expect(realEstateFractionalize.connect(addr1).buyFraction(0, 10, { value: cost })).to.changeEtherBalances(
        [addr1, owner, realEstateFractionalize],
        [-cost, netAmount, fee],
      );

      const fractions = await realEstateFractionalize.propertyFractions(0, addr1.address);
      expect(fractions).to.equal(10);
    });
  });

  describe("Sell Fraction", function () {
    beforeEach(async function () {
      await realEstateFractionalize.setListingPrice(listingPrice);
      await realEstateFractionalize.registerProperty(ethers.utils.parseEther("100"), 100, "https://property.uri", {
        value: listingPrice,
      });
      await realEstateFractionalize.listPropertyForSale(0, ethers.utils.parseEther("100"));
      await realEstateFractionalize.connect(addr1).buyFraction(0, 10, { value: ethers.utils.parseEther("10") });
    });

    it("Should allow user to sell fractions and transfer fees", async function () {
      const fractionPrice = ethers.utils.parseEther("1");
      const cost = fractionPrice.mul(5);
      const fee = cost.mul(5).div(1000);
      const netAmount = cost.sub(fee);

      await expect(
        realEstateFractionalize.connect(addr1).sellFraction(0, 5, addr2.address, fractionPrice),
      ).to.changeEtherBalances([addr1, realEstateFractionalize], [netAmount, fee]);

      const fractions = await realEstateFractionalize.propertyFractions(0, addr2.address);
      expect(fractions).to.equal(5);
    });
  });

  describe("Rent Property", function () {
    beforeEach(async function () {
      await realEstateFractionalize.setListingPrice(listingPrice);
      await realEstateFractionalize.registerProperty(ethers.utils.parseEther("100"), 100, "https://property.uri", {
        value: listingPrice,
      });
      await realEstateFractionalize.listPropertyForSale(0, ethers.utils.parseEther("100"));
      await realEstateFractionalize.connect(addr1).buyFraction(0, 10, { value: ethers.utils.parseEther("10") });
      await realEstateFractionalize.connect(addr2).buyFraction(0, 10, { value: ethers.utils.parseEther("10") });

      await realEstateFractionalize.connect(owner).listPropertyForRent(0, ethers.utils.parseEther("1"));
    });

    it("Should allow user to rent a property and transfer fees", async function () {
      const rentDays = 5;
      const rentCost = ethers.utils.parseEther("5");
      const fee = rentCost.mul(5).div(1000);
      const netRentCost = rentCost.sub(fee);

      await expect(
        realEstateFractionalize.connect(addr3).rentProperty(0, rentDays, { value: rentCost }),
      ).to.changeEtherBalances([addr3, realEstateFractionalize], [-rentCost, fee]);

      const rentPerFraction = netRentCost.div(20); // 20 fractions sold

      await expect(() => realEstateFractionalize.connect(owner).claimRent(0)).to.changeEtherBalances(
        [owner, addr1, addr2],
        [rentPerFraction.mul(80), rentPerFraction.mul(10), rentPerFraction.mul(10)],
      );
    });
  });
});
