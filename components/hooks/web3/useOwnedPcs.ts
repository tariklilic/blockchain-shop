import useSWR from "swr"
import { CryptoHookFactory } from "@_types/hooks"
import { Pc } from "@_types/pc"
import { ethers } from "ethers"

type UseOwnedPcsResponse = {
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



    return {
        ...swr,
        data: data || [],
    };
}
