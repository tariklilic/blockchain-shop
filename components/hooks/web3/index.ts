import { useHooks } from "@providers/web3"

export const useAccount = () => {
    const hooks = useHooks();
    const swrRes = hooks.useAccount();
    return {
        account: swrRes
    }
}

export const useNetwork = () => {
    const hooks = useHooks();
    const swrRes = hooks.useNetwork();
    return {
        network: swrRes
    }
}

export const useListedPcs = () => {
    const hooks = useHooks();
    const swrRes = hooks.useListedPcs();
    return {
        pcs: swrRes
    }
}

export const useOwnedPcs = () => {
    const hooks = useHooks();
    const swrRes = hooks.useOwnedPcs();
    return {
        pcs: swrRes
    }
}