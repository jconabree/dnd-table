import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { RgbaStringColorPicker } from "react-colorful";
import {
    Droppable,
    Draggable,
    DroppableProvided,
    DroppableStateSnapshot,
    DraggableProvided,
    DraggableStateSnapshot
} from 'react-beautiful-dnd';
import clsx from 'clsx';
// import { useConfiguratorContext } from "~/context/ConfiguratorProvider";
import effectManager from '~/models/effects';
import areaManager from '~/models/areas';
import { EffectData, Effect, AreaData } from "~/types/interface";

type EffectFormProps = {
    onChange: (key: string, value: any) => void;
    onRemove: () => void;
    effect: Effect;
}

const EffectForm = ({ onChange, onRemove, effect }: EffectFormProps) => {
    return (
        <div className="card bg-base-100 w-full shadow-xl">
            <div className="card-body">
                <div className="card-actions justify-end">
                    <button className="btn btn-square btn-sm btn-warning" onClick={onRemove}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4"
                        >
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                    </button>
                </div>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Type</span>
                    </div>
                    <select
                        onChange={(event) => { onChange('type', event.target.value)}}
                        className="select select-bordered w-full max-w-xs"
                        defaultValue={effect.type ?? 'solid'}
                    >
                        <option value="solid">Solid</option>
                        <option value="fill">Staggered Fill</option>
                        <option value="gradient">Gradient</option>
                    </select>
                </label>

                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Duration (s)</span>
                    </div>
                    <input
                        onChange={(event) => { onChange('duration', event.target.value)}}
                        type="number"
                        className={`input input-bordered w-full max-w-xs`}
                        defaultValue={effect.duration ?? 0}
                    />
                    <div className="label">
                        <span className="label-text-alt">Less than 1 is infinite</span>
                    </div>
                </label>

                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">Run in Parallel</span>
                        <input
                            type="checkbox"
                            className="toggle"
                            onChange={(event) => { onChange('parallel', event.target.checked)}}
                            defaultChecked={effect.parallel}
                        />
                    </label>
                </div>

                {effect.parallel && (
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Delay (s)</span>
                        </div>
                        <input
                            onChange={(event) => { onChange('delay', event.target.value)}}
                            type="number"
                            className={`input input-bordered w-full max-w-xs`}
                            defaultValue={effect.duration ?? 0}
                        />
                    </label>
                )}
                {effect.duration && effect.duration >= 1 && (
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Repeat</span>
                        </div>
                        <select
                            onChange={(event) => {
                                onChange(
                                    'repeat',
                                    event.target.value === '' ? false :
                                    event.target.value === 'infinite' ? event.target.value :
                                    Number.parseInt(event.target.value)
                                )
                            }}
                            className="select select-bordered w-full max-w-xs"
                            defaultValue={typeof effect.repeat === 'boolean' ? '' : effect.repeat}
                        >
                            <option value="">None</option>
                            <option value="infinite">Infinite</option>
                            {Array.from({ length: 119 }).map((_, index) => {
                                return (
                                    <option key={index} value={index + 1}>{index + 1}</option>
                                );
                            })}
                        </select>
                    </label>
                )}
                {effect.duration && effect.duration >= 1 && effect.repeat && effect.repeat !== 'infinite' && (
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Repeat Direction</span>
                        </div>
                        <select
                            onChange={(event) => { onChange('repeatDirection', event.target.value)}}
                            className="select select-bordered w-full max-w-xs"
                            defaultValue={effect.repeatDirection ?? 'forward'}
                        >
                            <option value="forward">Forward</option>
                            <option value="reverse">Reverse</option>
                        </select>
                    </label>
                )}
                {effect.type === 'solid' && (
                    <label className="form-control w-full max-w-xs mt-3">
                        <div className="label pb-4">
                            <span className="label-text">Solid Color Value</span>
                        </div>
                        <RgbaStringColorPicker
                            color={effect.value as string}
                            onChange={(newColorValue) => { onChange('value', newColorValue) }}
                        />
                        <div className="label">
                            <span className="label-text-alt">{effect.value as string}</span>
                        </div>
                    </label>
                )}
            </div>
        </div>
    )
}

type AreaEffectFormProps = {
    onClose: () => void;
    onSuccess?: ({}) => void;
    effect?: EffectData
}

export default ({ onClose, onSuccess, effect }: AreaEffectFormProps) => {
    // const { selection, setSelection, setIsSelectMode } = useConfiguratorContext();
    const [nameError, setNameError] = useState<boolean>();
    const [name, setName] = useState<string>(effect?.name || '');
    const [availableAreas, setAvailableAreas] = useState<AreaData[]>();
    const [selectedAreas, setSelectedAreas] = useState<AreaData[]>([]);
    const [areaSearch, setAreaSearch] = useState<string>('');
    const [effects, setEffects] = useState<Effect[]>(() => {
        if (!effect) {
            return [];
        }

        return effect.effects as Effect[];
    })

    const filteredAreas = useMemo(() => {
        return availableAreas?.filter((area) => area.name.includes(areaSearch)) ?? [];
    }, [availableAreas, areaSearch]);

    const resetForm = useCallback(() => {
        setNameError(false);
    }, []);

    const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
        setNameError(false);
    }, []);

    const handleAddEffect = useCallback(() => {
        setEffects((currentEffects) => {
            return [
                {
                    type: 'solid',
                    value: 'rgba(255,255,255,1)'
                },
                ...currentEffects
            ]
        })
    }, []);

    const handleRemoveEffect = useCallback((index: number) => {
        setEffects((currentEffects) => {
            currentEffects.splice(index, 1);
            return [...currentEffects];
        })
    }, []);
    
    const handleCancelClick = useCallback(() => {
        resetForm();
        onClose();
    }, [onClose, resetForm]);

    const handleConfirmClick = useCallback(async () => {
        if (!name) {
            setNameError(true);
        }

        console.log('confirm click', name, selectedAreas, effects);
        if (!name || !selectedAreas.length || !effects.length) {
            return;
        }

        const effectToSave = {
            ...effect||{},
            name,
            effects: effects,
            areas: selectedAreas.map((area) => area.id!)
        };

        console.log('effect to save', effectToSave);

        const updatedArea = await effectManager.save(effectToSave);
        if (typeof onSuccess === 'function') {
            onSuccess(updatedArea);
        }

        resetForm();
        onClose();
    }, [resetForm, onClose, effects, name, selectedAreas]);

    useEffect(() => {
        (async() => {
            const areas = await areaManager.list();

            setAvailableAreas(areas);

            if (effect) {
                setSelectedAreas(areas.filter((area) => effect.areas.includes(area.id!)));
            }
        })();
    }, []);
    
    if (typeof availableAreas === 'undefined') {
        return null;
    }

    return (
        <>
            <div className="flex flex-col justify-between pb-12">
                <div className="flex flex-col gap-y-6">
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Effect Name</span>
                        </div>
                        <input
                            onChange={handleNameChange}
                            type="text"
                            placeholder="Name"
                            className={`input input-bordered w-full max-w-xs ${nameError ? 'input-error' : ''}`}
                            defaultValue={effect?.name}
                        />
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <Combobox immediate multiple value={selectedAreas} onChange={setSelectedAreas} onClose={() => setAreaSearch('')}>
                            <div className="label">
                                <span className="label-text">Areas</span>
                            </div>
                            <ComboboxInput
                                className="input input-bordered w-full max-w-xs"
                                onChange={(event) => setAreaSearch(event.target.value)}
                            />
                            <ComboboxOptions
                                anchor="bottom"
                                transition
                                className={clsx(
                                    'w-[var(--input-width)] rounded-xl border border-primary bg-neutral text-base-content p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
                                    'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                                )}
                            >
                                {filteredAreas.map((area) => (
                                    <ComboboxOption
                                        key={area.id}
                                        value={area}
                                        className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[selected]:bg-accent data-[selected]:text-accent-content data-[focus]:bg-white/10"
                                    >
                                        {area.name}
                                    </ComboboxOption>
                                ))}
                            </ComboboxOptions>
                        </Combobox>
                        {selectedAreas.length > 0 && (
                            <div className="py-3">
                                <span className="font-semibold">Selected Areas:</span>
                                <ul className="pl-4">
                                    {selectedAreas.map((area: AreaData) => (
                                        <li key={area.id} className="py-2">{area.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </label>
                    
                    <div>
                        <div className="flex justify-between items-center pb-4">
                            <span className="text-lg font-bold">Effects</span>
                            <button type="button" className="btn btn-sm btn-accent" onClick={handleAddEffect}>Add +</button>
                        </div>
                        {effects.length > 0 && (
                            // <Droppable droppableId="droppable">
                            //     {(provided:DroppableProvided, snapshot:DroppableStateSnapshot) => (
                            //         <div
                            //             ref={provided.innerRef}
                            //             {...provided.droppableProps}
                            //             className={`
                            //                 min-h-80
                            //                 ${snapshot.isDraggingOver ? 'bg-accent' : 'bg-neutral'}
                            //             `}
                            //         >
                                    <div className="grid gap-y-4 pb-6">
                                        {effects.map((addedEffect, index) => {
                                            // const effectId = index.toString();
                                            const handleEffectChange = (key: string, value: any) => {
                                                console.log('effect change', key, value)
                                                setEffects((currentEffects) => {
                                                    currentEffects[index] = {
                                                        ...addedEffect,
                                                        [key]: value
                                                    };

                                                    return [
                                                        ...currentEffects
                                                    ]
                                                })
                                            };

                                            const handleRemove = () => {
                                                handleRemoveEffect(index);
                                            }

                                            return (
                                                // <Draggable key={index} index={index} draggableId={effectId}>
                                                //     {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                                //         <div
                                                //             ref={provided.innerRef}
                                                //             {...provided.draggableProps}
                                                //             {...provided.dragHandleProps}
                                                //         >
                                                            <EffectForm
                                                                key={index}
                                                                effect={addedEffect}
                                                                onChange={handleEffectChange}
                                                                onRemove={handleRemove}
                                                            />
                                                //         </div>
                                                //     )}
                                                // </Draggable>
                                            )
                                        })}
                                    </div>
                            //         </div>
                            //     )}
                            // </Droppable>
                        )}
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 h-12 join w-full pr-12">
                <button
                    type="button"
                    className="btn btn-neutral join-item w-1/2"
                    onClick={handleCancelClick}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="btn join-item w-1/2 btn-success"
                    onClick={handleConfirmClick}
                >
                    Confirm
                </button>
            </div>
        </>
    )
}