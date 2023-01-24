export type PcAttribute = {
    trait_type: "quality" | "grade" | "warranty";
    value: string;
}

export type PcMeta = {
    name: string;
    description: string;
    image: string;
    attributes: PcAttribute[];
}

export type PcCore = {
    tokenId: number;
    price: number;
    creator: string;
    isListed: boolean;
}

export type Pc = {
    meta: PcMeta
} & PcCore

export type FileReq = {
    bytes: Uint8Array;
    contentType: string;
    fileName: string;
}

export type PinataRes = {
    IpfsHash: string;
    PinSize: number;
    Timestamp: string;
    isDuplicate: boolean;
}