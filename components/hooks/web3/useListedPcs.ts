import useSWR from "swr"
import { CryptoHookFactory } from "@_types/hooks"
import { Pc } from "@_types/pc"
import { ethers } from "ethers"
import { useCallback } from "react";
import { toast } from "react-toastify";

type UseListedPcsResponse = {
    buyPc: (token: number, value: number) => Promise<void>;
}

type ListedPcsHookFactory = CryptoHookFactory<any, UseListedPcsResponse>

export type UseListedPcsHook = ReturnType<ListedPcsHookFactory>

export const hookFactory: ListedPcsHookFactory = ({ contract }) => () => {

    const { data, ...swr } = useSWR(
        contract ? "web3/useListedPcs" : null,
        async () => {
            const pcs = [] as Pc[];
            const corePcs = await contract!.getAllPcsOnSale();

            for (let i = 0; i < corePcs.length; i++) {
                const item = corePcs[i];
                const tokenURI = await contract!.tokenURI(item.tokenId);
                const metaRes = await fetch(tokenURI);
                const meta = await metaRes.json();

                pcs.push({
                    price: parseFloat(ethers.utils.formatEther(item.price)),
                    tokenId: item.tokenId.toNumber(),
                    creator: item.creator,
                    isListed: item.isListed,
                    meta
                })
            }

            return pcs;
        }
    )

    // line for reacts use callback
    const _contract = contract;

    //line to buy component 
    const buyPc = useCallback(async (tokenId: number, value: number) => {
        try {
            const result = await _contract!.buyPc(
                tokenId, {
                value: ethers.utils.parseEther(value.toString())
            }
            )

            await toast.promise(result!.wait(), {
                pending: "Processing transaction",
                success: "Component bought, check your profile",
                error: "Processing error"
            })
        } catch (e: any) {
            console.log(e.message);
        }
    }, [_contract])



    return {
        ...swr,
        buyPc,
        data: data || [],
    };
}
