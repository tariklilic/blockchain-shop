import { FunctionComponent } from 'react';
import PcItem from '../item';
import { useListedPcs } from '@hooks/web3';
import { Pc } from '@_types/pc';

const PcList: FunctionComponent = () => {
    const { pcs } = useListedPcs();
    return (
        <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            {
                pcs.data?.map((pc: Pc) =>
                    <div key={pc.meta.image} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                        <PcItem
                            item={pc}
                            buyPc={pcs.buyPc}
                        />
                    </div>
                )
            }
        </div>
    )
}

export default PcList;