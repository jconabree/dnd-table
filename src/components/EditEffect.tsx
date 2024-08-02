import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { HexColorPicker } from "react-colorful";
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
        <div className="card bg-base-100 w-96 shadow-xl">
            <div className="card-body">
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
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">Repeat</span>
                        <select
                            onChange={(event) => { onChange('repeat', event.target.value)}}
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
                </div>
                {effect.repeat && effect.repeat !== 'infinite' && (
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text">Repeat Direction</span>
                            <select
                                onChange={(event) => { onChange('repeatDirection', event.target.value)}}
                                className="select select-bordered w-full max-w-xs"
                                defaultValue={effect.repeatDirection ?? 'forward'}
                            >
                                <option value="forward">Forward</option>
                                <option value="reverse">Reverse</option>
                            </select>
                        </label>
                    </div>
                )}
                {effect.type === 'solid' && (
                    <HexColorPicker
                        color={effect.value as string}
                        onChange={(newColorValue) => { onChange('value', newColorValue) }}
                    />
                )}
                <div className="card-actions justify-end">
                    <button className="btn btn-danger" onClick={onRemove}>Remove</button>
                </div>
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
    const [typeError, setTypeError] = useState<boolean>();
    const [availableAreas, setAvailableAreas] = useState<AreaData[]>();
    const [selectedAreas, setSelectedAreas] = useState<AreaData['id'][]>([]);
    const [areaSearch, setAreaSearch] = useState<string>('');
    const [effects, setEffects] = useState<Effect[]>(() => {
        if (!effect) {
            return [];
        }

        return effect.effects;
    })
    const nameRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<HTMLSelectElement>(null);

    const filteredAreas = useMemo(() => {
        return availableAreas?.filter((area) => area.name.includes(areaSearch)) ?? [];
    }, [availableAreas, areaSearch]);

    const resetForm = useCallback(() => {
        setNameError(false);
        setTypeError(false);
        nameRef.current!.value = '';
        typeRef.current!.value = '';
        const defaultOption: HTMLOptionElement = typeRef.current!.querySelector('option[value=""]')!;
        defaultOption.selected = true;
    }, []);

    const handleNameChange = useCallback(() => {
        setNameError(false);
    }, []);

    const handleAddEffect = useCallback(() => {
        setEffects((currentEffects) => {
            return [
                {
                    type: 'solid',
                    value: '#FFFFFF'
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
        const name = nameRef.current!.value;
        const type = typeRef.current!.value;

        if (!name) {
            setNameError(true);
        }

        if (!type) {
            setTypeError(true);
        }

        if (!name || !type) {
            return;
        }

        const effectToSave = {
            ...effect||{},
            name,
            effects: [{
                type: type as Effect['type'],
                duration: 30, // in seconds
                // parallel?: boolean; // execute in parallel with others. By default it will execute when the previous one finishes
                // delay?: number; // Used with parallel
                // type: 'solid'|'fill'|'gradient';
                repeat: false,
                value: '#FF0000'
            }],
            areas: ['123']
        };
        console.log('save selection', effectToSave);
        const updatedArea = await effectManager.save(effectToSave);
        if (typeof onSuccess === 'function') {
            onSuccess(updatedArea);
        }
        resetForm();
        onClose();
    }, [resetForm, onClose]);

    useEffect(() => {
        (async() => {
            const areas = await areaManager.list();

            setAvailableAreas(areas);
        })();
    }, []);
    
    return (
        <div className="h-full flex flex-col justify-between">
            <div className="flex flex-col gap-y-6">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Effect Name</span>
                    </div>
                    <input
                        ref={nameRef}
                        onChange={handleNameChange}
                        type="text"
                        placeholder="Name"
                        className={`input input-bordered w-full max-w-xs ${nameError ? 'input-error' : ''}`}
                        defaultValue={effect?.name}
                    />
                </label>

                <Combobox multiple value={selectedAreas} onChange={setSelectedAreas} onClose={() => setAreaSearch('')}>
                    {selectedAreas.length > 0 && (
                        <ul>
                        {selectedAreas.map((areaId: AreaData['id']) => (
                            <li key={areaId}>{areaId}</li>
                        ))}
                        </ul>
                    )}
                    <ComboboxInput aria-label="Assignees" onChange={(event) => setAreaSearch(event.target.value)} />
                    <ComboboxOptions anchor="bottom" className="border empty:invisible">
                        {filteredAreas.map((area) => (
                        <ComboboxOption key={area.id} value={area.id} className="data-[focus]:bg-blue-100">
                            {area.name}
                        </ComboboxOption>
                        ))}
                    </ComboboxOptions>
                </Combobox>
                
                <div>
                    Effects <button type="button" className="btn btn-primary" onClick={handleAddEffect}>+</button>
                    {effects.map((addedEffect, index) => {
                        const handleEffectChange = (key: string, value: any) => {
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
                            <EffectForm effect={addedEffect} onChange={handleEffectChange} onRemove={handleRemove} />
                        )
                    })}
                </div>
            </div>
            <div className="join w-full">
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
                    disabled={!selection?.length}
                    onClick={handleConfirmClick}
                >
                    Confirm
                </button>
            </div>
        </div>
    )
}