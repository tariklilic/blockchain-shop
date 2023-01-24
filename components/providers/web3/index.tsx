import { createContext, FunctionComponent, useContext, useEffect, useState } from "react";
import { createDefaultState, createWeb3State, loadContract, Web3State } from "./utils";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { PcMarketContract } from "@_types/pcMarketContract";

const pageReload = () => { window.location.reload(); }

const handleAccount = (ethereum: MetaMaskInpageProvider) => async () => {
    const isLocked = !(await ethereum._metamask.isUnlocked());
    if (isLocked) { pageReload(); }
}

const setGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
    ethereum.on("chainChanged", pageReload);
    ethereum.on("accountsChanged", handleAccount(ethereum));
}

const removeGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
    ethereum?.removeListener("chainChanged", pageReload);
    ethereum?.removeListener("accountsChanged", handleAccount);
}


interface Props {
    children: React.ReactNode;
}

const Web3Context = createContext<Web3State>(createDefaultState());

const Web3Provider: FunctionComponent<Props> = ({ children }) => {

    const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState())

    useEffect(() => {
        async function initWeb3() {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum as any);
                const contract = await loadContract("PcMarket", provider);

                const signer = provider.getSigner();
                const signedContract = contract.connect(signer);

                setGlobalListeners(window.ethereum);
                setWeb3Api(createWeb3State({
                    ethereum: window.ethereum,
                    provider,
                    contract: signedContract as unknown as PcMarketContract,
                    isLoading: false
                }))
            } catch (e: any) {  // when metamask isnt installed
                console.error(e.message);
                setWeb3Api((api) => createWeb3State({
                    ...api as any,
                    isLoading: false,
                }))
            }
        }

        initWeb3();
        return () => removeGlobalListeners(window.ethereum);
    }, [])

    return (
        <Web3Context.Provider value={web3Api}>
            {children}
        </Web3Context.Provider>
    )
}

export function useWeb3() {
    return useContext(Web3Context);
}

export function useHooks() {
    const { hooks } = useWeb3();
    return hooks;
}

export default Web3Provider;