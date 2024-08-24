import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TableConfiguration } from "~/types/interface";
import configModel from '~/models/config';
import nodesModel from '~/models/nodes';
import { DEFAULT_COLOR } from '~/constants/colors';

type InitiativeModeProps = {
    onClose: () => void;
}

const lengthOrder: (keyof TableConfiguration['nodeCount'])[] = ['bottom', 'right', 'top', 'left'];

export default ({ onClose }: InitiativeModeProps) => {
    const [config, setConfig] = useState<TableConfiguration>();
    const [updatedNodeConfig, setUpdatedNodeConfig] = useState<Partial<TableConfiguration['nodeCount']>>();

    useEffect(() => {
        (async () => {
            const configuration = await configModel.get();
            setConfig(configuration);
        })()
    }, []);

    const handleLengthChange = useCallback((type: keyof TableConfiguration['nodeCount'], value: number) => {
        const startPosition = lengthOrder.reduce<number>((length, side: keyof TableConfiguration['nodeCount'], index) => {
            if (side === type || index > lengthOrder.indexOf(type)) {
                return length;
            }

            return length + (updatedNodeConfig?.[side] ?? (config?.nodeCount?.[side] ?? 0))
        }, 0);

        const nodes = Array.from({ length: value }).map((_, index) => {
            return index + startPosition
        });

        setUpdatedNodeConfig((currentUpdates) => {
            return {
                ...currentUpdates || {},
                [type]: value
            }
        });

        nodesModel.highlight({
            nodes,
            color: DEFAULT_COLOR
        })
    }, [config, updatedNodeConfig]);

    const handleBlur = useCallback(() => {
        nodesModel.clearAll();
    }, []);

    const handleSave = useCallback(() => {
        (async () => {
            const saveResponse = await configModel.save({
                ...config,
                nodeCount: Object.fromEntries(
                    lengthOrder.map((key) => [key, updatedNodeConfig?.[key] ?? 0])
                ) as TableConfiguration['nodeCount']
            });

            console.log(saveResponse);
            setUpdatedNodeConfig({});
        })();

    }, [config, updatedNodeConfig]);

    if (typeof config === 'undefined') {
        return null;
    }

    return (
        <div>
            <div className="actions -mt-8 mb-10 grid grid-cols-2 gap-x-2 gap-y-4 items-center">
                {updatedNodeConfig && Object.keys(updatedNodeConfig).length && (
                    <button
                        onClick={handleSave}
                        type="button"
                        className="btn btn-primary w-full"
                    >Save</button>
                )}
            </div>
            <div className="collapse collapse-arrow bg-base-200">
                <input type="radio" name="config-node-count" defaultChecked />
                <div className="collapse-title text-xl font-medium">Node Counts</div>
                <div className="collapse-content">
                    {lengthOrder.map((lengthKey) => {
                        const initialValue = config?.nodeCount?.[lengthKey] ?? 0;
                        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                            const value = event.target.value;
                            handleLengthChange(lengthKey, Number.parseInt(value, 10));
                        }
                        const label = lengthKey[0].toUpperCase() + lengthKey.slice(1).toLowerCase();
                        const type = ['bottom', 'top'].includes(lengthKey) ? 'Stile' : 'Rail';

                        return (
                            <label className="form-control w-full max-w-xs" key={lengthKey}>
                                <div className="label">
                                    <span className="label-text">{label} ({type})</span>
                                </div>
                                <input
                                    type="number"
                                    min="1"
                                    defaultValue={initialValue}
                                    placeholder={label}
                                    onChange={handleChange}
                                    className="grow w-full disabled:text-accent py-3 px-4"
                                />
                            </label>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}