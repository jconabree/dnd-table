import { useCallback, useEffect, useRef, useState } from 'react';
import effectsModel from "../models/effects";
import nodesModel from '~/models/nodes';
import { EffectData } from '../types/interface';
import ToggleView from './ToggleView';
import EditEffect from './EditEffect';

type EffectListingItem = EffectData & {
    active?: boolean;
};

type EffectListProps = {
    onClose: () => void;
}
export default ({ onClose }: EffectListProps) => {
    const initialRender = useRef(true);
    const [effects, setEffects] = useState<EffectListingItem[]>();
    const [selectedEffect, setSelectedEffect] = useState<EffectData>();
    const [showEditForm, setShowEditForm] = useState<boolean>(false);

    const handleNewClick = useCallback(() => {
        setShowEditForm(true);
    }, []);

    const handleEditClose = useCallback(() => {
        setSelectedEffect(undefined);
        setShowEditForm(false);
    }, []);

    const handleClearAll = useCallback(() => {
        nodesModel.clearAll();
    }, []);

    const loadList = useCallback(async () => {
        const items: EffectListingItem[] = await effectsModel.list();
        console.log('response', items);
        setEffects((currentItems) => {
            return items?.map((item) => {
                const currentItem = currentItems?.find(({ id }) => id === item.id);
                item.active = currentItem?.active ?? false;

                return item;
            })
        });
    }, []);

    const handleDeleteItem = useCallback((itemId: string) => {
        effectsModel.delete(itemId);
        loadList();
    }, []);

    useEffect(() => {
        loadList();
    }, []);
    
    useEffect(() => {
        if (!effects) {
            return;
        }

        if (initialRender.current) {
            initialRender.current = false;

            return;
        }

        const activeEffect = effects!.find((effect) => {
            return effect.active;
        });

        console.log('set canvas active effects', activeEffect);
    }, [effects])

    if (showEditForm) {
        return <EditEffect onClose={handleEditClose} onSuccess={loadList} effect={selectedEffect} />;
    }

    return (
        <div>
            <div className="actions -mt-8 mb-10 grid grid-cols-2 gap-x-2">
                <button
                    onClick={handleClearAll}
                    type="button"
                    className="btn btn-primary w-full"
                >Clear Effects</button>
                <button
                    onClick={handleNewClick}
                    type="button"
                    className="btn btn-primary w-full"
                >New Effect</button>
            </div>
            <div className="menu">
                {effects?.map((effect) => {
                    const handleActiveChange = (isActive: boolean) => {
                        setEffects((currentEffects) => {
                            return [
                                ...currentEffects!.map((currentEffect) => {
                                    currentEffect.active = currentEffect.id === effect.id && isActive;

                                    return {
                                        ...currentEffect
                                    };
                                })
                            ]
                        });

                        effectsModel.changeActiveEffect(effect.id, isActive);
                    }

                    const handleEditClick = () => {
                        setSelectedEffect(effect);
                        setShowEditForm(true);
                    }

                    const handleDeleteClick = () => {
                        handleDeleteItem(effect.id!);
                    }

                    return (
                        <div key={effect.id} className="flex justify-between items-center py-2 border-t last:border-b border-gray-400">
                            <ToggleView
                                onChange={handleActiveChange}
                                state={effect.active}
                                onIcon={(
                                    <svg
                                        className="swap-on w-5 h-5 stroke-primary"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>
                                    </svg>
                                )}
                                offIcon={(
                                    <svg
                                        className="swap-off w-5 h-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>
                                    </svg>
                                )}
                            />
                            <span className="flex self-center">
                                {effect.name}
                            </span>
                            <details className="dropdown">
                                <summary className="btn m-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
                                    </svg>
                                </summary>
                                <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                    <li><a onClick={handleEditClick}>Edit</a></li>
                                    <li><a onClick={handleDeleteClick}>Delete</a></li>
                                </ul>
                            </details>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}