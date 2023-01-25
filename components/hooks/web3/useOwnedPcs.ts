import useSWR from "swr"
import { CryptoHookFactory } from "@_types/hooks"
import { Pc } from "@_types/pc"
import { ethers } from "ethers"
import { useCallback } from "react";
import { toast } from "react-toastify";

type UseOwnedPcsResponse = {
    listPc: (tokenId: number, price: number) => Promise<void>;
}

type OwnedPcsHookFactory = CryptoHookFactory<any, UseOwnedPcsResponse>

export type UseOwnedPcsHook = ReturnType<OwnedPcsHookFactory>

export const hookFactory: OwnedPcsHookFactory = ({ contract }) => () => {

    const { data, ...swr } = useSWR(
        contract ? "web3/useOwnedPcs" : null,
        async () => {
            const pcs = [] as Pc[];
            const corePcs = await contract!.getOwnedPcs();

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

    //function to sell component
    const listPc = useCallback(async (tokenId: number, price: number) => {
        try {
            const result = await _contract!.placePcOnSale(
                tokenId,
                ethers.utils.parseEther(price.toString()),
                {
                    value: ethers.utils.parseEther(0.025.toString())
                }
            )

            await toast.promise(result!.wait(), {
                pending: "Processing transaction",
                success: "Item has been listed",
                error: "Processing error"
            })

        } catch (e: any) {
            console.log(e.message);
        }
    }, [_contract])



    return {
        ...swr,
        listPc,
        data: data || [],
    };
}
