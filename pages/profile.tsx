/* eslint-disable @next/next/no-img-element */

import type { NextPage } from 'next'
import { BaseLayout } from '@ui'

import { Pc } from '@_types/pc';
import { useOwnedPcs } from '@hooks/web3';
import { useEffect, useState } from 'react';

const tabs = [
    { name: 'Your Components', href: '#', current: true },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const Profile: NextPage = () => {
    const { pcs } = useOwnedPcs();
    const [activePc, setActivePc] = useState<Pc>();

    useEffect(() => {
        if (pcs.data && pcs.data.length > 0) {
            setActivePc(pcs.data[0]);
        }

        return () => setActivePc(undefined);
    }, [pcs.data])

    return (
        <BaseLayout>
            <div className="h-full flex">
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 flex items-stretch overflow-hidden">
                        <main className="flex-1 overflow-y-auto">
                            <div className="pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex">
                                    <h1 className="flex-1 text-2xl font-bold text-gray-900">Your Components</h1>
                                </div>
                                <div className="mt-3 sm:mt-2">
                                    <div className="hidden sm:block">
                                        <div className="flex items-center border-b border-gray-200">
                                            <nav className="flex-1 -mb-px flex space-x-6 xl:space-x-8" aria-label="Tabs">
                                                {tabs.map((tab) => (
                                                    <a
                                                        key={tab.name}
                                                        href={tab.href}
                                                        aria-current={tab.current ? 'page' : undefined}
                                                        className={classNames(
                                                            tab.current
                                                                ? 'border-blue-500 text-blue-600'
                                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                                            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                                                        )}
                                                    >
                                                        {tab.name}
                                                    </a>
                                                ))}
                                            </nav>
                                        </div>
                                    </div>
                                </div>

                                <section className="mt-8 pb-16" aria-labelledby="gallery-heading">
                                    <ul
                                        role="list"
                                        className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
                                    >
                                        {(pcs.data as Pc[]).map((pc) => (
                                            <li
                                                key={pc.tokenId}
                                                onClick={() => setActivePc(pc)}
                                                className="relative">
                                                <div
                                                    className={classNames(
                                                        pc.tokenId === activePc?.tokenId
                                                            ? 'ring-2 ring-offset-2 ring-blue-500'
                                                            : 'focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-blue-500',
                                                        'group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 overflow-hidden'
                                                    )}
                                                >
                                                    <img
                                                        src={pc.meta.image}
                                                        alt=""
                                                        className={classNames(
                                                            pc.tokenId === activePc?.tokenId ? '' : 'group-hover:opacity-75',
                                                            'object-cover pointer-events-none'
                                                        )}
                                                    />
                                                    <button type="button" className="absolute inset-0 focus:outline-none">
                                                        <span className="sr-only">View details for {pc.meta.name}</span>
                                                    </button>
                                                </div>
                                                <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
                                                    {pc.meta.name}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            </div>
                        </main>

                        {/* Details sidebar */}
                        <aside className="hidden w-96 bg-white p-8 border-l border-gray-200 overflow-y-auto lg:block">
                            {activePc &&
                                <div className="pb-16 space-y-6">
                                    <div>
                                        <div className="block w-full aspect-w-10 aspect-h-7 rounded-lg overflow-hidden">
                                            <img src={activePc.meta.image} alt="" className="object-cover" />
                                        </div>
                                        <div className="mt-4 flex items-start justify-between">
                                            <div>
                                                <h2 className="text-lg font-medium text-gray-900">
                                                    <span className="sr-only">Details for </span>
                                                    {activePc.meta.name}
                                                </h2>
                                                <p className="text-sm font-medium text-gray-500">{activePc.meta.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Information</h3>
                                        <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
                                            {activePc.meta.attributes.map((attr) => (
                                                <div key={attr.trait_type} className="py-3 flex justify-between text-sm font-medium">
                                                    <dt className="text-gray-500">{attr.trait_type}: </dt>
                                                    <dd className="text-gray-900 text-right">{attr.value}</dd>
                                                </div>
                                            ))}
                                        </dl>
                                    </div>

                                    <div className="flex">
                                        <button
                                            disabled={activePc.isListed}
                                            onClick={() => {
                                                pcs.listPc(
                                                    activePc.tokenId,
                                                    activePc.price
                                                )
                                            }}
                                            type="button"
                                            className="disabled:text-gray-400 disabled:cursor-not-allowed flex-1 ml-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            {activePc.isListed ? "Item is listed" : "List Item"}
                                        </button>
                                    </div>
                                </div>
                            }
                        </aside>
                    </div>
                </div>
            </div>
        </BaseLayout>
    )
}

export default Profile