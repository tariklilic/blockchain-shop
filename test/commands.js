const instance = await PcMarket.deployed();

instance.mintToken("https://gateway.pinata.cloud/ipfs/QmULg6wNycwxVz8ViQyQUARHV86qKMmT5uHrvp313HtMvm", "500000000000000000", { value: "25000000000000000", from: accounts[0] });
instance.mintToken("https://gateway.pinata.cloud/ipfs/QmYUjVDYdntVM1HJF7W5MVdgxHmaD2U47iErPS8Q5RVaYK", "300000000000000000", { value: "25000000000000000", from: accounts[0] });