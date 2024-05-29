// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

contract RealEstateFractionalize is ERC20 {
    struct Property {
        uint256 id;
        address payable owner;
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

    uint256 public nextPropertyId ;
    uint256 public listingPrice = 0.00002 ether;
    address public downer;
    mapping(uint256 => Property) public properties;
    mapping(uint256 => mapping(address  => uint256)) public propertyFractions; // propertyId => (owner => fraction)
    mapping(uint256 => address[]) public fractionOwners; // propertyId => owners array

    event PropertyRegistered(uint256 id, address owner, uint256 value, uint256 totalFractions, string propertyURI);
    event FractionBought(uint256 propertyId, address buyer, uint256 fractionAmount);
    event PropertyRented(uint256 id, address renter, uint256 rentPrice, uint256 rentedDays);
    event FractionSold(uint256 propertyId, address seller, uint256 fractionAmount, address buyer);

    constructor() ERC20("Property Block Token", "PBT") { 
        downer = msg.sender;
    }

    // Modifier to check that the caller is the owner of the contract.
    modifier onlyOwner() {
        require(msg.sender == downer, "Not owner");
        _;
    }

    /**
     * @dev Registers a new property with given value, total fractions, and property URI.
     * Transfers the listing price to the contract.
     * @param value The value of the property.
     * @param totalFractions The total number of fractions for the property.
     * @param propertyURI The URI of the property metadata.
     */
    function registerProperty(uint256 value, uint256 totalFractions, string memory propertyURI) external payable {
        require(totalFractions > 0, "Total fractions must be greater than zero");
        // require(msg.value == listingPrice, "Incorrect listing price");

        properties[nextPropertyId] = Property({
            id: nextPropertyId,
            owner: payable(msg.sender),
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

    /**
     * @dev Sets the listing price for registering a property.
     * @param price The new listing price.
     */
    function setListingPrice(uint256 price) external onlyOwner {
        listingPrice = price;
    }

    /**
     * @dev Returns the current listing price.
     * @return The current listing price.
     */
    function getListingPrice() external view returns (uint256) {
        return listingPrice;
    }

    /**
     * @dev Lists a property for rent with a given rent price.
     * @param propertyId The ID of the property to be listed for sale.
     * @param rentPrice The sale price of the property.
     */
    function listPropertyForRent(uint256 propertyId, uint256 rentPrice) external {
        Property storage property = properties[propertyId];
        require(property.owner == msg.sender, "Not the owner");
        property.forRent = true;
        property.rentPrice = rentPrice;
    }

      /**
     * @dev Lists a property for sale with a given sale price.
     * @param propertyId The ID of the property to be listed for sale.
     * @param salePrice The sale price of the property.
     */
    function listPropertyForSale(uint256 propertyId, uint256 salePrice) external {
        Property storage property = properties[propertyId];
        require(property.owner == msg.sender, "Not the owner");
        property.forSale = true;
        property.salePrice = salePrice;
    }

    /**
     * @dev Fetches all properties that are currently for sale.
     * @return An array of properties that are for sale.
     */
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

    /**
     * @dev Fetches all properties that are currently for rent.
     * @return An array of properties that are for rent.
     */
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

    /**
     * @dev Fetches all fractions owned by the caller.
     * @return Two arrays, one with the properties and another with the fractions owned by the caller.
     */
    function fetchMyFractions() external view returns (uint256[] memory) {
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
        return (myFractions);
    }

    /**
     * @dev Fetches all properties registered by the caller.
     * @return An array of properties registered by the caller.
     */
    function fetchMyPropertyRegistered() external view returns (Property[] memory) {
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

    /**
     * @dev Allows a user to buy fractions of a property.
     * Transfers 0.5% of the cost to the contract and the rest to the property owner.
     * @param propertyId The ID of the property to buy fractions from.
     * @param fractionAmount The number of fractions to buy.
     */
    function buyFraction(uint256 propertyId, uint256 fractionAmount) external payable {
        Property storage property = properties[propertyId];
        require(property.forSale, "Property not for sale");
        uint256 cost = (property.salePrice * fractionAmount) / property.totalFractions;
        require(msg.value >= cost, "Incorrect value");

       _mint(msg.sender, fractionAmount);
       _burn(property.owner, fractionAmount);

        uint256 fee = (cost * 5) / 1000; // 0.5% fee
        uint256 netAmount = cost - fee;
        payable(property.owner).transfer(netAmount);
        //payable(address(this)).transfer(fee);

        if (propertyFractions[propertyId][msg.sender] == 0) {
            fractionOwners[propertyId].push(msg.sender);
        }

        propertyFractions[propertyId][msg.sender] += fractionAmount;
        propertyFractions[propertyId][property.owner] -= fractionAmount;
        property.fractionsSold += fractionAmount;

        emit FractionBought(propertyId, msg.sender, fractionAmount);
    }

    /**
     * @dev Allows a user to sell fractions of a property.
     * Transfers 0.5% of the cost to the contract and the rest to the msg.sender.
     * @param propertyId The ID of the property to sell fractions from.
     * @param fractionAmount The number of fractions to sell.
     * @param to The address to transfer the fractions to.
     * @param fractionPrice The price per fraction.
     */
    function sellFraction(uint256 propertyId, uint256 fractionAmount, address to, uint256 fractionPrice) external {
        require(propertyFractions[propertyId][msg.sender] >= fractionAmount, "Not enough fractions");

        uint256 cost = fractionPrice * fractionAmount;
        require(to != address(0), "Invalid address");

        _burn(msg.sender, fractionAmount);
        _mint(to, fractionAmount);

        uint256 fee = (cost * 5) / 1000; // 0.5% fee
        uint256 netAmount = cost - fee;
        payable(msg.sender).transfer(netAmount);
        payable(address(this)).transfer(fee);

        propertyFractions[propertyId][msg.sender] -= fractionAmount;
        propertyFractions[propertyId][to] += fractionAmount;

        emit FractionSold(propertyId, msg.sender, fractionAmount, to);
    }

    /**
     * @dev Allows a user to rent a property.
     * Transfers 0.5% of the msg.value to the contract before computing rent per fraction to be split among addresses.
     * @param propertyId The ID of the property to rent.
     * @param rentDays The number of days to rent the property.
     */
    function rentProperty(uint256 propertyId, uint256 rentDays) external payable {
        Property storage property = properties[propertyId];
        require(property.forRent, "Property not for rent");
        uint256 rentCost = property.rentPrice * rentDays;
        require(msg.value == rentCost, "Incorrect value");

        uint256 fee = (msg.value * 5) / 1000; // 0.5% fee
        uint256 netRentCost = msg.value - fee;
        payable(address(this)).transfer(fee);

        property.rentedUntil = block.timestamp + (rentDays * 1 days);
        property.rentedDays += rentDays;

        uint256 rentPerFraction = netRentCost / property.totalFractions;
        for (uint256 i = 0; i < fractionOwners[propertyId].length; i++) {
            address owner = fractionOwners[propertyId][i];
            uint256 ownerFractions = propertyFractions[propertyId][owner];
            payable(owner).transfer(rentPerFraction * ownerFractions);
        }

        emit PropertyRented(propertyId, msg.sender, property.rentPrice, rentDays);
    }

        // Function to fetch fractions sold of a property
    function fetchFractionsSold(uint256 propertyId) external view returns (uint256) {
        Property storage property = properties[propertyId];
        return property.fractionsSold;
    }

    // Function to fetch fractions owned by an address for a property
    function fetchFractionsOwned(uint256 propertyId, address owner) external view returns (uint256) {
        return propertyFractions[propertyId][owner];
    }

    // Function to deposit funds to the contract
    function deposit() external payable onlyOwner {}

    // Function to withdraw funds from the contract
    function withdraw(uint256 amount) external onlyOwner {
        payable(downer).transfer(amount);
    }
}