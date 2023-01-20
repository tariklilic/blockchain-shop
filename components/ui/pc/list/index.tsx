import { FunctionComponent } from 'react';
import PcItem from '../item';
import { PcMeta } from '../../../../types/pc';

type PcListProps = {
    PcParts: PcMeta[]
}

const PcList: FunctionComponent<PcListProps> = ({ PcParts }) => {

    return (
        <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            {
                PcParts.map(pc =>
                    <div key={pc.image} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                        <PcItem
                            item={pc}
                        />
                    </div>
                )
            }
        </div>
    )
}

export default PcList;