import { useCallback, useEffect, useRef, useState } from "react";
import { useConfiguratorContext } from "~/context/ConfiguratorProvider";
import areaManager from '~/models/areas';
import nodeManager from '~/models/nodes';
import { AreaData } from "~/types/interface";

type AddNewSelectionProps = {
    onClose: () => void;
    onSuccess?: ({}) => void;
    area?: AreaData
}

export default ({ onClose, onSuccess, area }: AddNewSelectionProps) => {
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
        nodeManager.clearAll();
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

        const areaToSave = {
            ...area||{},
            name,
            type: type as AreaData['type'],
            nodes: selection
        };

        const updatedArea = await areaManager.save(areaToSave);
        if (typeof onSuccess === 'function') {
            onSuccess(updatedArea);
        }
        resetForm();
        onClose();
    }, [selection, resetForm, onClose]);

    useEffect(() => {
        setIsSelectMode(true);
        if (area) {
            setSelection(area.nodes ?? []);
        }

        return () => {
            setIsSelectMode(false);
        }
    }, []);

    useEffect(() => {
        if (selection) {
            nodeManager.highlight({
                nodes: selection
            });
        } else {
            nodeManager.clearAll();
        }
    }, [selection]);
    
    return (
        <>
            <div className="flex flex-col justify-between">
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
                            defaultValue={area?.name}
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
                            defaultValue={area?.type}
                        >
                            <option disabled value="">Select Type...</option>
                            <option value="dndplayer">DND Player</option>
                            <option value="player">Player</option>
                            <option value="basic">Basic</option>
                        </select>
                    </label>
                </div>
            </div>
            <div className="absolute bottom-0 h-16 join w-full pr-12">
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
        </>
    )
}