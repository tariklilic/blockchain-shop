import { Web3Dependencies } from "@_types/hooks";
import { hookFactory as createAccountHook, UseAccountHook } from "./useAccount";
import { hookFactory as createNetworkHook, UseNetworkHook } from "./useNetwork";
import { hookFactory as createListedPcsHook, UseListedPcsHook } from "./useListedPcs";
import { hookFactory as createOwnedPcsHook, UseOwnedPcsHook } from "./useOwnedPcs";

export type Web3Hooks = {
    useAccount: UseAccountHook;
    useNetwork: UseNetworkHook;
    useListedPcs: UseListedPcsHook;
    useOwnedPcs: UseOwnedPcsHook;
}

export type SetupHooks = {
    (d: Web3Dependencies): Web3Hooks
}

export const setupHooks: SetupHooks = (deps) => {
    return {
        useAccount: createAccountHook(deps),
        useNetwork: createNetworkHook(deps),
        useListedPcs: createListedPcsHook(deps),
        useOwnedPcs: createOwnedPcsHook(deps)
    }
}