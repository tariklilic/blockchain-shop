// TRUFFLE FUNCTIONS (available in truffle console)

const PcMarket = artifacts.require("PcMarket");
const { ethers } = require("ethers");

contract("PcMarket", accounts => {
    let _contract = null;
    let _pcPrice = ethers.utils.parseEther("0.3").toString();
    let _listingPrice = ethers.utils.parseEther("0.025").toString();

    before(async () => {
        _contract = await PcMarket.deployed();
    })

    //test mint
    describe("Mint token", () => {
        const tokenURI = "https://test.com";
        before(async () => {
            await _contract.mintToken(tokenURI, _pcPrice, {
                from: accounts[0],
                value: _listingPrice
            })
        })

        it("owner of the first token should be address[0]", async () => {
            const owner = await _contract.ownerOf(1);
            assert.equal(owner, accounts[0], "Owner of token is not matching address[0]");
        })

        it("first token should point to the correct tokenURI", async () => {
            const actualTokenURI = await _contract.tokenURI(1);

            assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
        })

        it("should not be possible to create a PC Item with used tokenURI", async () => {
            try {
                await _contract.mintToken(tokenURI, _pcPrice, {
                    from: accounts[0]
                })
            } catch (error) {
                assert(error, "PC Item was minted with previously used tokenURI");
            }
        })

        it("should have one listed item", async () => {
            const listedItemCount = await _contract.listedItemsCount();
            assert.equal(listedItemCount.toNumber(), 1, "Listed items count is not 1");
        })

        it("should have create PC Iem item", async () => {
            const pcItem = await _contract.getPcItem(1);

            assert.equal(pcItem.tokenId, 1, "Token id is not 1");
            assert.equal(pcItem.price, _pcPrice, "Pc price is not correct");
            assert.equal(pcItem.creator, accounts[0], "Creator is not account[0]");
            assert.equal(pcItem.isListed, true, "Token is not listed");
        })

        //buy item test
        describe("Buy Component", () => {
            before(async () => {
                await _contract.buyPc(1, {
                    from: accounts[1],
                    value: _pcPrice
                })
            })

            it("should unlist the item", async () => {
                const listedItem = await _contract.getPcItem(1);
                assert.equal(listedItem.isListed, false, "Item is still listed");
            })

            it("should decrease listed items count", async () => {
                const listedItemsCount = await _contract.listedItemsCount();
                assert.equal(listedItemsCount.toNumber(), 0, "Count has not been decrement");
            })

            it("should change the owner", async () => {
                const currentOwner = await _contract.ownerOf(1);
                assert.equal(currentOwner, accounts[1], "Item is still listed");
            })
        })

        //Before token transfer test
        describe("Token transfers", () => {
            const tokenURI = "https://test-json-2.com";
            before(async () => {
                await _contract.mintToken(tokenURI, _pcPrice, {
                    from: accounts[0],
                    value: _listingPrice
                })
            })

            it("should have two PCs created", async () => {
                const totalSupply = await _contract.totalSupply();
                assert.equal(totalSupply.toNumber(), 2, "Total supply of token is not correct");
            })

            it("should be able to retreive pc by index", async () => {
                const pcId1 = await _contract.tokenByIndex(0);
                const pcId2 = await _contract.tokenByIndex(1);


                assert.equal(pcId1.toNumber(), 1, "Pc id is wrong");
                assert.equal(pcId2.toNumber(), 2, "Pc id is wrong");
            })

            it("should have one listed PC", async () => {
                const allPcs = await _contract.getAllPcsOnSale();
                assert.equal(allPcs[0].tokenId, 2, "PC has a wrong id");
            })

            it("account[1] should have one owned PC", async () => {
                const ownedPcs = await _contract.getOwnedPcs({ from: accounts[1] });
                assert.equal(ownedPcs[0].tokenId, 1, "Pc has a wrong id");
            })

            it("account[0] should have one owned PC", async () => {
                const ownedPcs = await _contract.getOwnedPcs({ from: accounts[0] });
                assert.equal(ownedPcs[0].tokenId, 2, "Pc has a wrong id");
            })
        })
    })
})