import { useCallback, useEffect, useRef, useState } from "react";
import { useConfiguratorContext } from "~/context/ConfiguratorProvider";
import effectManager from '~/models/effects';
import { EffectData, Effect } from "~/types/interface";

type EffectFormProps = {
    onClose: () => void;
    onSuccess?: ({}) => void;
    effect?: EffectData
}

export default ({ onClose, onSuccess, effect }: EffectFormProps) => {
    const { selection, setSelection, setIsSelectMode } = useConfiguratorContext();
    const [nameError, setNameError] = useState<boolean>();
    const [typeError, setTypeError] = useState<boolean>();
    const nameRef = useRef<HTMLInputElement>(null);
    const typeRef = useRef<HTMLSelectElement>(null);

    const resetForm = useCallback(() => {
        setNameError(false);
        setTypeError(false);
        nameRef.current!.value = '';
        typeRef.current!.value = '';
        const defaultOption: HTMLOptionElement = typeRef.current!.querySelector('option[value=""]')!;
        defaultOption.selected = true;
        setSelection([]);
    }, [setSelection]);

    const handleNameChange = useCallback(() => {
        setNameError(false);
    }, []);

    const handleTypeChange = useCallback(() => {
        setTypeError(false);
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
    }, [selection, resetForm, onClose]);

    useEffect(() => {
        setIsSelectMode(true);

        return () => {
            setIsSelectMode(false);
        }
    }, []);
    
    return (
        <div className="h-full flex flex-col justify-between">
            <div className="flex flex-col gap-y-6">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Area Name</span>
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
                
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Area Type</span>
                    </div>
                    <select
                        ref={typeRef}
                        onChange={handleTypeChange}
                        className={`select select-bordered w-full max-w-xs ${typeError ? 'select-error' : ''}`}
                        defaultValue={effect?.type}
                    >
                        <option disabled value="">Select Type...</option>
                        <option value="solid">Solid</option>
                        <option value="fill">Staggered Fill</option>
                        <option value="gradient">Gradient</option>
                    </select>
                </label>
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