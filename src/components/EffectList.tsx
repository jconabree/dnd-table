import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import effectsModel from "../models/effects";
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
    // return (
    //     <div>
    //         <ul>
    //             <li>Create effects and attach them to areas</li>
    //             <li>Activate effects</li>
    //             <li>Can quick disable or remove areas from effects</li>
    //         </ul>
    //     </div>
    // )

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

    useEffect(() => {
        (async () => {
            const items: EffectListingItem[] = await effectsModel.list();
            console.log('response', items);
            setEffects(
                items?.map((item) => {
                    item.active = false;

                    return item;
                })
            );
        })();
    }, []);
    
    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;

            return;
        }

        const activeEffects = effects!.filter((effect) => {
            return effect.active;
        });

        console.log('set canvas active effects', activeEffects);
    }, [effects])

    if (showEditForm) {
        return <EditEffect onClose={handleEditClose} effect={selectedEffect} />;
    }

    return (
        <div>
            <div className="actions -mt-8 mb-10 grid grid-cols-2 gap-x-2">
                <button
                    onClick={() => console.log('implement clear all')}
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
                                    if (currentEffect.id === effect.id) {
                                        currentEffect.active = isActive
                                    }

                                    return {
                                        ...currentEffects
                                    };
                                })
                            ]
                        });
                    }

                    const handleEditClick = () => {
                        setSelectedEffect(effect);
                        setShowEditForm(true);
                    }

                    return (
                        <div key={effect.id} className="flex justify-between items-center py-2 border-t last:border-b border-gray-400">
                            <ToggleView onChange={handleActiveChange} />
                            <span className="flex self-center">
                                {effect.name}
                            </span>
                            <button onClick={handleEditClick} type="button" className="btn btn-circle btn-ghost">
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
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}