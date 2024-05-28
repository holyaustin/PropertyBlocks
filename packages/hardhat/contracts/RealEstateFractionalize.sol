// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealEstateFractionalize is ERC20, Ownable {
    struct Property {
        uint256 id;
        address owner;
        uint256 value;
        uint256 totalFractions;
        uint256 fractionsSold;
        bool forSale;
        uint256 salePrice;
        bool forRent;
        uint256 rentPrice;
        uint256 rentedUntil;
        uint256 rentedDays;
        string propertyURI;
    }

    uint256 public nextPropertyId;
    uint256 public listingPrice;
    mapping(uint256 => Property) public properties;
    mapping(uint256 => mapping(address => uint256)) public propertyFractions; // propertyId => (owner => fraction)
    mapping(uint256 => address[]) public fractionOwners; // propertyId => owners array

    event PropertyRegistered(uint256 id, address owner, uint256 value, uint256 totalFractions, string propertyURI);
    event FractionBought(uint256 propertyId, address buyer, uint256 fractionAmount);
    event PropertyRented(uint256 id, address renter, uint256 rentPrice, uint256 rentedDays);
    event FractionSold(uint256 propertyId, address seller, uint256 fractionAmount, address buyer);

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }

    function registerProperty(uint256 value, uint256 totalFractions, string memory propertyURI) external onlyOwner {
        require(totalFractions > 0, "Total fractions must be greater than zero");

        properties[nextPropertyId] = Property({
            id: nextPropertyId,
            owner: msg.sender,
            value: value,
            totalFractions: totalFractions,
            fractionsSold: 0,
            forSale: false,
            salePrice: 0,
            forRent: false,
            rentPrice: 0,
            rentedUntil: 0,
            rentedDays: 0,
            propertyURI: propertyURI
        });

        propertyFractions[nextPropertyId][msg.sender] = totalFractions;
        fractionOwners[nextPropertyId].push(msg.sender);

        emit PropertyRegistered(nextPropertyId, msg.sender, value, totalFractions, propertyURI);
        nextPropertyId++;
    }

    function setListingPrice(uint256 price) external onlyOwner {
        listingPrice = price;
    }

    function getListingPrice() external view returns (uint256) {
        return listingPrice;
    }

    function listPropertyForSale(uint256 propertyId, uint256 salePrice) external {
        Property storage property = properties[propertyId];
        require(property.owner == msg.sender, "Not the owner");
        property.forSale = true;
        property.salePrice = salePrice;
    }

    function fetchForSale() external view returns (Property[] memory) {
        uint256 forSaleCount = 0;
        for (uint256 i = 0; i < nextPropertyId; i++) {
            if (properties[i].forSale) {
                forSaleCount++;
            }
        }

        Property[] memory forSaleProperties = new Property[](forSaleCount);
        uint256 index = 0;
        for (uint256 i = 0; i < nextPropertyId; i++) {
            if (properties[i].forSale) {
                forSaleProperties[index] = properties[i];
                index++;
            }
        }
        return forSaleProperties;
    }

    function fetchForRent() external view returns (Property[] memory) {
        uint256 forRentCount = 0;
        for (uint256 i = 0; i < nextPropertyId; i++) {
            if (properties[i].forRent) {
                forRentCount++;
            }
        }

        Property[] memory forRentProperties = new Property[](forRentCount);
        uint256 index = 0;
        for (uint256 i = 0; i < nextPropertyId; i++) {
            if (properties[i].forRent) {
                forRentProperties[index] = properties[i];
                index++;
            }
        }
        return forRentProperties;
    }

    function fetchMyFractions() external view returns (Property[] memory, uint256[] memory) {
        uint256 myFractionCount = 0;
        for (uint256 i = 0; i < nextPropertyId; i++) {
            if (propertyFractions[i][msg.sender] > 0) {
                myFractionCount++;
            }
        }

        Property[] memory myProperties = new Property[](myFractionCount);
        uint256[] memory myFractions = new uint256[](myFractionCount);
        uint256 index = 0;
        for (uint256 i = 0; i < nextPropertyId; i++) {
            if (propertyFractions[i][msg.sender] > 0) {
                myProperties[index] = properties[i];
                myFractions[index] = propertyFractions[i][msg.sender];
                index++;
            }
        }
        return (myProperties, myFractions);
    }

    function fetchMyRegisteredProperties() external view returns (Property[] memory) {
        uint256 myPropertyCount = 0;
        for (uint256 i = 0; i < nextPropertyId; i++) {
            if (properties[i].owner == msg.sender) {
                myPropertyCount++;
            }
        }

        Property[] memory myProperties = new Property[](myPropertyCount);
        uint256 index = 0;
        for (uint256 i = 0; i < nextPropertyId; i++) {
            if (properties[i].owner == msg.sender) {
                myProperties[index] = properties[i];
                index++;
            }
        }
        return myProperties;
    }

    function buyFraction(uint256 propertyId, uint256 fractionAmount) external payable {
        Property storage property = properties[propertyId];
        require(property.forSale, "Property not for sale");
        uint256 cost = (property.salePrice * fractionAmount) / property.totalFractions;
        require(msg.value == cost, "Incorrect value");

        payable(property.owner).transfer(msg.value);

        if (propertyFractions[propertyId][msg.sender] == 0) {
            fractionOwners[propertyId].push(msg.sender);
        }

        propertyFractions[propertyId][msg.sender] += fractionAmount;
        propertyFractions[propertyId][property.owner] -= fractionAmount;
        property.fractionsSold += fractionAmount;

        _mint(msg.sender, fractionAmount);

        emit FractionBought(propertyId, msg.sender, fractionAmount);
    }

    function sellFraction(uint256 propertyId, uint256 fractionAmount, address to, uint256 fractionPrice) external {
        require(propertyFractions[propertyId][msg.sender] >= fractionAmount, "Not enough fractions");

        uint256 cost = fractionPrice * fractionAmount;
        require(to != address(0), "Invalid address");

        payable(msg.sender).transfer(cost);
        if (propertyFractions[propertyId][to] == 0) {
            fractionOwners[propertyId].push(to);
        }
        propertyFractions[propertyId][msg.sender] -= fractionAmount;
        propertyFractions[propertyId][to] += fractionAmount;

        _burn(msg.sender, fractionAmount);
        _mint(to, fractionAmount);

        emit FractionSold(propertyId, msg.sender, fractionAmount, to);
    }

    function listPropertyForRent(uint256 propertyId, uint256 rentPrice, uint256 rentDays) external {
        Property storage property = properties[propertyId];
        require(property.owner == msg.sender, "Not the owner");
        property.forRent = true;
        property.rentPrice = rentPrice;
        property.rentedDays = rentDays;
    }

    function rentProperty(uint256 propertyId) external payable {
        Property storage property = properties[propertyId];
        require(property.forRent, "Property not for rent");
        require(msg.value == property.rentPrice, "Incorrect value");
        require(block.timestamp > property.rentedUntil, "Property is currently rented");

        property.forRent = false;
        property.rentedUntil = block.timestamp + (property.rentedDays * 1 days);

        uint256 rentPerFraction = msg.value / property.fractionsSold;
        address[] memory owners = fractionOwners[propertyId];

        for (uint256 i = 0; i < owners.length; i++) {
            address owner = owners[i];
            uint256 ownerFractions = propertyFractions[propertyId][owner];
            uint256 rentShare = ownerFractions * rentPerFraction;
            if (rentShare > 0) {
                payable(owner).transfer(rentShare);
            }
        }

        emit PropertyRented(propertyId, msg.sender, msg.value, property.rentedDays);
    }

    function fetchFractionsSold(uint256 propertyId) external view returns (uint256) {
        Property storage property = properties[propertyId];
        return property.fractionsSold;
    }

    function fetchFractionsOwned(uint256 propertyId, address owner) external view returns (uint256) {
        return propertyFractions[propertyId][owner];
    }

    function deposit() external payable onlyOwner {}

    function withdraw(uint256 amount) external onlyOwner {
        payable(owner()).transfer(amount);
    }
}
