// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealEstateFractionalize is ERC20, Ownable {
    struct Property {
        uint256 id;
        address owner;
        uint256 value;
        bool forSale;
        uint256 salePrice;
        bool forRent;
        uint256 rentPrice;
    }

    uint256 public nextPropertyId;
    mapping(uint256 => Property) public properties;

    event PropertyRegistered(uint256 id, address owner, uint256 value);
    event PropertySold(uint256 id, address newOwner, uint256 salePrice);
    event PropertyRented(uint256 id, address renter, uint256 rentPrice);

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }

    function registerProperty(uint256 value) external {
        properties[nextPropertyId] = Property({
            id: nextPropertyId,
            owner: msg.sender,
            value: value,
            forSale: false,
            salePrice: 0,
            forRent: false,
            rentPrice: 0
        });

        emit PropertyRegistered(nextPropertyId, msg.sender, value);
        nextPropertyId++;
    }

    function listPropertyForSale(uint256 propertyId, uint256 salePrice) external {
        Property storage property = properties[propertyId];
        require(property.owner == msg.sender, "Not the owner");
        property.forSale = true;
        property.salePrice = salePrice;
    }

    function buyProperty(uint256 propertyId) external payable {
        Property storage property = properties[propertyId];
        require(property.forSale, "Property not for sale");
        require(msg.value == property.salePrice, "Incorrect value");

        address previousOwner = property.owner;
        property.owner = msg.sender;
        property.forSale = false;
        property.salePrice = 0;

        payable(previousOwner).transfer(msg.value);

        emit PropertySold(propertyId, msg.sender, msg.value);
    }

    function listPropertyForRent(uint256 propertyId, uint256 rentPrice) external {
        Property storage property = properties[propertyId];
        require(property.owner == msg.sender, "Not the owner");
        property.forRent = true;
        property.rentPrice = rentPrice;
    }

    function rentProperty(uint256 propertyId) external payable {
        Property storage property = properties[propertyId];
        require(property.forRent, "Property not for rent");
        require(msg.value == property.rentPrice, "Incorrect value");

        property.forRent = false;
        property.rentPrice = 0;

        payable(property.owner).transfer(msg.value);

        emit PropertyRented(propertyId, msg.sender, msg.value);
    }

    function deposit() external payable onlyOwner {}

    function withdraw(uint256 amount) external onlyOwner {
        payable(owner()).transfer(amount);
    }
}
