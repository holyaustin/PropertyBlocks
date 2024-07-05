// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

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
    event Received(address, uint);

    constructor() ERC20("Property Block Token", "PBT") { 
        downer = msg.sender;
        _mint(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4, 100  * 10 ** 18);
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
        require(msg.value == listingPrice, "Incorrect listing price");
       
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
     * @dev Allows a user to buy fractions of a property.
     * Transfers 0.5% of the cost to the contract and the rest to the property owner.
     * @param propertyId The ID of the property to buy fractions from.
     * @param fractionAmount The number of fractions to buy.
     */
    function buyFraction(uint256 propertyId, uint256 fractionAmount) external payable {

        Property storage property = properties[propertyId];
        require(property.forSale, "Property not for sale");
        uint256 cost = (property.salePrice * fractionAmount) / property.totalFractions;
        console.log("The cost is ", cost);
        require(msg.sender != property.owner, "You are the Property owner");
        require(msg.value == cost, "Incorrect value");
       _mint(msg.sender, fractionAmount);
   
        uint256 netAmount = (cost * 995) / 1000; 
        uint256 fee = cost - netAmount;  // 0.5% fee
        console.log("The fee is ", fee); 
        payable(property.owner).transfer(netAmount); 
         
        if (propertyFractions[propertyId][msg.sender] == 0) {
            fractionOwners[propertyId].push(msg.sender);
            console.log("Inside if ", propertyFractions[propertyId][msg.sender]);
        }

        propertyFractions[propertyId][msg.sender] += fractionAmount;
        console.log("propertyFractions[propertyId][msg.sender] ", propertyFractions[propertyId][msg.sender]);
        propertyFractions[propertyId][property.owner] -= fractionAmount;
        console.log("propertyFractions[propertyId][property.owner] ", propertyFractions[propertyId][property.owner]);
        property.fractionsSold += fractionAmount;
        console.log("property.fractionsSold ", property.fractionsSold);

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
    function sellFraction(uint256 propertyId, uint256 fractionAmount, address to, uint256 fractionPrice) external payable {
        console.log("ETH Balance Before ", address(this).balance);
        Property storage property = properties[propertyId];
        require(to != address(0), "Invalid address");
        require(msg.sender != property.owner, "You are the Property owner");
        require(propertyFractions[propertyId][msg.sender] >= fractionAmount, "Not enough fractions");
        uint256 cost = fractionPrice * fractionAmount;
        console.log("The cost is ", cost); 
        require(msg.value == cost, "Incorrect value");

        uint256 netRentCost  = (msg.value * 995) / 1000; 
        uint256 fee = cost - netRentCost;  // 0.5% fee
        console.log("The fee is ", fee); 
        payable(msg.sender).transfer(netRentCost);

        _burn(msg.sender, fractionAmount);
        _mint(to, fractionAmount);
         
        propertyFractions[propertyId][msg.sender] -= fractionAmount;
        propertyFractions[propertyId][to] += fractionAmount;

        emit FractionSold(propertyId, msg.sender, fractionAmount, to);
        console.log("ETH Balance last ", address(this).balance);
    }

    /**
     * @dev Allows a user to rent a property.
     * Transfers 0.5% of the msg.value to the contract before computing rent per fraction to be split among addresses.
     * @param propertyId The ID of the property to rent.
     * @param rentDays The number of days to rent the property.
     */
    function rentProperty(uint256 propertyId, uint256 rentDays) external payable {
        console.log("ETH Balance Before ", address(this).balance);

        Property storage property = properties[propertyId];
        require(property.forRent, "Property not for rent");
        console.log("property.rentedUntil is", property.rentedUntil);
        console.log("block.timestamp is ", block.timestamp);
        require(property.rentedUntil <= block.timestamp, "Property already rented");
        uint256 rentCost = property.rentPrice * rentDays;
        require(msg.value == rentCost, "Incorrect value");
        
        uint256 netRentCost  = (msg.value * 995) / 1000; 
        uint256 fee = msg.value - netRentCost;  // 0.5% fee
        console.log("The netRentCost is ", netRentCost); 
        console.log("The fee is ", fee); 

        property.rentedUntil = block.timestamp + (rentDays * 1 days);
        property.rentedDays += rentDays;

        uint256 rentPerFraction = netRentCost / property.totalFractions;
        console.log("The rentPerFraction is ", rentPerFraction); 
        for (uint256 i = 0; i < fractionOwners[propertyId].length; i++) {
            address owner = fractionOwners[propertyId][i];
            uint256 ownerFractions = propertyFractions[propertyId][owner];
            payable(owner).transfer(rentPerFraction * ownerFractions);
        }

        emit PropertyRented(propertyId, msg.sender, property.rentPrice, rentDays);
        console.log("ETH Balance END ", address(this).balance);
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
     * @dev Retrieves a property by its ID.
     * @param propertyId The ID of the property to retrieve.
     * @return The property with the given ID.
     */
    function getPropertyById(uint256 propertyId) external view returns (Property memory) {
        require(propertyId < nextPropertyId, "Property does not exist");
        return properties[propertyId];
    }

    /* Returns only one items by token id   */
    function fetchOneProperty(uint256 propertyId) public view returns (Property[] memory) {
      require(propertyId < nextPropertyId, "Property does not exist");
      uint totalItemCount = nextPropertyId;
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (properties[i].id == propertyId) {
          itemCount += 1;
        }
      }

      Property[] memory oneProperty = new Property[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (properties[i].id == propertyId) {
          uint currentId = i;
          Property storage currentItem = properties[currentId];
          oneProperty[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return oneProperty;
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

        // Function to fetch fractions sold of a property
    function fetchURI(uint256 propertyId) external view returns ( string memory ) {
        Property storage property = properties[propertyId];
        return property.propertyURI;
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
    function deposit() public payable onlyOwner {}

    // Function to fetch the ETH balance in the contract
    function fetchETHBalance() external onlyOwner view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    // Function to withdraw funds from the contract
    function withdraw(uint256 amount) external onlyOwner {
        payable(downer).transfer(amount);
    }
}
