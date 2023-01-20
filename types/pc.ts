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