pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PcMarket is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter; //counter for counting

    // Creating new PC Item
    struct PcItem {
        uint256 tokenId;
        uint256 price;
        address creator;
        bool isListed;
    }

    uint256 public listingPrice = 0.025 ether;

    Counters.Counter private _listedItems; // starts witch 0 and can be incremented or decremented
    Counters.Counter private _tokenIds; // unique ids

    uint256[] private _allPcs; //array to keep all items

    mapping(string => bool) private _usedTokenURIs; //mapping between URIs and true value
    mapping(uint256 => PcItem) private _idToPcItem; //mapping between id and Pc Item
    mapping(uint256 => uint256) private _idToPcIndex; //mapping between id and pc index

    mapping(address => mapping(uint256 => uint256)) private _ownedTokens; //mapping for owned tokens by address
    mapping(uint256 => uint256) private _idToOwnedIndex; //mapping for owned tokens by address

    // Event for PC Item creation
    event PcItemCreated(
        uint256 tokenId,
        uint256 price,
        address creator,
        bool isListed
    );

    constructor() ERC721("PcMarket", "CMPT") {}

    function setListingPrice(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "Price must be at least 1 wei");
        listingPrice = newPrice;
    }

    // Get Pc item function
    function getPcItem(uint256 tokenId) public view returns (PcItem memory) {
        return _idToPcItem[tokenId];
    }

    // Returns number of created items
    function listedItemsCount() public view returns (uint256) {
        return _listedItems.current();
    }

    //check if token URI exists (if token mapping is true)
    function tokenURIExists(string memory tokenURI) public view returns (bool) {
        return _usedTokenURIs[tokenURI] == true;
    }

    // Length of PCs
    function totalSupply() public view returns (uint256) {
        return _allPcs.length;
    }

    // Get PCs by their index
    function tokenByIndex(uint256 index) public view returns (uint256) {
        require(index < totalSupply(), "Index out of bounds");
        return _allPcs[index];
    }

    // Get Owned PCs by their index
    function tokenOfOwnerByIndex(address owner, uint256 index)
        public
        view
        returns (uint256)
    {
        require(index < ERC721.balanceOf(owner), "Index out of bounds");
        return _ownedTokens[owner][index];
    }

    // Function to add all Items on sale which have Listing set to true
    function getAllPcsOnSale() public view returns (PcItem[] memory) {
        uint256 allPcsCounts = totalSupply(); //Get total components
        uint256 currentIndex = 0;
        PcItem[] memory items = new PcItem[](_listedItems.current()); //storing listed components into empty array

        //iterates the array of all items
        for (uint256 i = 0; i < allPcsCounts; i++) {
            uint256 tokenId = tokenByIndex(i);
            PcItem storage item = _idToPcItem[tokenId];

            if (item.isListed == true) {
                //If listed is true, add to array
                items[currentIndex] = item;
                currentIndex += 1;
            }
        }

        return items;
    }

    // Get PC items that are owned
    function getOwnedPcs() public view returns (PcItem[] memory) {
        uint256 ownedItemsCount = ERC721.balanceOf(msg.sender); // counts items of specific account
        PcItem[] memory items = new PcItem[](ownedItemsCount); // adds items to array

        //for loop for 0 until the number of items the owner owns
        for (uint256 i = 0; i < ownedItemsCount; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(msg.sender, i); //check if there is token at the i (index)
            PcItem storage item = _idToPcItem[tokenId]; //if there is id we map it to item
            items[i] = item; //store item to array and return it
        }

        return items;
    }

    //making new sale, TokenURI, is link to metadata
    function mintToken(string memory tokenURI, uint256 price)
        public
        payable
        returns (uint256)
    {
        require(!tokenURIExists(tokenURI), "Token URI already exists"); //checks if token exists, if it doesn't continue with creating one
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        ); // price must be equal to listing price of 0.025 ether

        _tokenIds.increment();
        _listedItems.increment();

        uint256 newTokenId = _tokenIds.current(); //get token id value

        //ERC721 function to provide who is creating token (address) and token id (from increment)
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _createPcItem(newTokenId, price);
        _usedTokenURIs[tokenURI] = true;

        return newTokenId;
    }

    function buyPc(uint256 tokenId) public payable {
        uint256 price = _idToPcItem[tokenId].price;
        address owner = ERC721.ownerOf(tokenId); // Owner of is a function that is part of ERC721

        require(msg.sender != owner, "You own this PC part"); // Check if owner of component is defferent from seller
        require(msg.value == price, "Please submit the asking price"); // Check if price is correct

        _idToPcItem[tokenId].isListed = false; //Make Item unlisted
        _listedItems.decrement(); // Decrement number of listed items

        _transfer(owner, msg.sender, tokenId); // Transwer ownershit to msg.sender (transfer is ERC721 function)
        payable(owner).transfer(msg.value);
    }

    //Add item to sale
    function placePcOnSale(uint256 tokenId, uint256 newPrice) public payable {
        // check if you own this item
        require(
            ERC721.ownerOf(tokenId) == msg.sender,
            "You are not owner of this item"
        );

        // check if the item is on sale
        require(
            _idToPcItem[tokenId].isListed == false,
            "Item is already on sale"
        );
        // check if the listing price is correct
        require(msg.value == listingPrice);

        _idToPcItem[tokenId].isListed = true; // set listing to true
        _idToPcItem[tokenId].price = newPrice; // set new price
        _listedItems.increment(); // increment listed items
    }

    // Function to create new PC item
    function _createPcItem(uint256 tokenId, uint256 price) private {
        require(price > 0, "Price must be at least 1 wei"); // Price needs to be above 0 to create item

        _idToPcItem[tokenId] = PcItem(tokenId, price, msg.sender, true); //mapping new item

        emit PcItemCreated(tokenId, price, msg.sender, true); //emitting new item
    }

    //Part of mint function from ERC721
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);

        if (from == address(0)) {
            _addTokenToAllTokensEnumeration(tokenId);
        } else if (from != to) {
            _removeTokenFromOwnerEnumeration(from, tokenId);
        }

        if (to == address(0)) {
            _removeTokenFromAllTokensEnumeration(tokenId);
        } else if (to != from) {
            _addTokenToOwnerEnumeration(to, tokenId);
        }
    }

    function _addTokenToAllTokensEnumeration(uint256 tokenId) private {
        _idToPcIndex[tokenId] = _allPcs.length;
        _allPcs.push(tokenId);
    }

    // Add token to address that owns it
    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
        uint256 length = ERC721.balanceOf(to); //Get number of tokens user already owns | ERC721 function

        _ownedTokens[to][length] = tokenId; // mapping pointing to address, poiniting to length (owned pcs), mapping to Id of PC
        _idToOwnedIndex[tokenId] = length; //mapping Id of Pc to length of owned pcs
    }

    //Remove token from owned enums
    function _removeTokenFromOwnerEnumeration(address from, uint256 tokenId)
        private
    {
        uint256 lastTokenIndex = ERC721.balanceOf(from) - 1; // Get number of tokens that user owns and decrement by 1
        uint256 tokenIndex = _idToOwnedIndex[tokenId]; // mapping id to owned index

        if (tokenIndex != lastTokenIndex) {
            uint256 lastTokenId = _ownedTokens[from][lastTokenIndex]; //mapping of account address and the lost token in the array

            _ownedTokens[from][tokenIndex] = lastTokenId; //remmapping token index to last token index
            _idToOwnedIndex[lastTokenId] = tokenIndex; //remapping last token index to token index
        }

        delete _idToOwnedIndex[tokenId]; //delete token Id
        delete _ownedTokens[from][lastTokenIndex]; //remove last token index from adress (decrement it)
    }

    // function to remove token from all enums (to destroy the token)
    function _removeTokenFromAllTokensEnumeration(uint256 tokenId) private {
        uint256 lastTokenIndex = _allPcs.length - 1; //get all PCs length and decrement it
        uint256 tokenIndex = _idToPcIndex[tokenId]; //map id to index
        uint256 lastTokenId = _allPcs[lastTokenIndex]; //accesing id of the last index in the array _allPcs

        _allPcs[tokenIndex] = lastTokenId; //remapping of tokenIndex with tokenId
        _idToPcIndex[lastTokenId] = tokenIndex; //remapping of last token id to token index

        delete _idToPcIndex[tokenId]; //remove tokenId
        _allPcs.pop(); //remove last item from array
    }
}
