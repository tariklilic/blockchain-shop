import { FunctionComponent } from 'react';
import PcItem from '../item';
import { Pc, PcMeta } from '../../../../types/pc';

type PcListProps = {
    pcs: Pc[]
}

const PcList: FunctionComponent<PcListProps> = ({ pcs }) => {

    return (
        <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            {
                pcs.map(pc =>
                    <div key={pc.meta.image} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
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