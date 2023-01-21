import { createContext, FunctionComponent, useContext, useEffect, useState } from "react";
import { createDefaultState, createWeb3State, loadContract, Web3State } from "./utils";
import { ethers } from "ethers";


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

                setWeb3Api(createWeb3State({
                    ethereum: window.ethereum,
                    provider,
                    contract,
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