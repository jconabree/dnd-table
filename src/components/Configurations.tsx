import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useConfiguratorContext } from '~/context/ConfiguratorProvider';
import { TableConfiguration } from "~/types/interface";

type InitiativeModeProps = {
    onClose: () => void;
}

const lengthOrder: (keyof TableConfiguration['nodeCount'])[] = ['bottom', 'right', 'top', 'left'];

export default ({ onClose }: InitiativeModeProps) => {
    const { config, saveConfig } = useConfiguratorContext();
    const [updatedNodeConfig, setUpdatedNodeConfig] = useState<Partial<TableConfiguration['nodeCount']>>();
    const [updatedWledAddress, setUpdatedWledAddress] = useState<Partial<TableConfiguration['wledAddress']>>();

    const handleLengthChange = useCallback((type: keyof TableConfiguration['nodeCount'], value: number) => {
        setUpdatedNodeConfig((currentUpdates) => {
            return {
                ...currentUpdates || {},
                [type]: value
            }
        });
    }, [config, updatedNodeConfig]);
    
    const handleWledUpdate = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setUpdatedWledAddress(event.target.value);
    }, [])

    const handleSave = useCallback(() => {
        (async () => {
            const saveResponse = await saveConfig({
                ...config,
                nodeCount: Object.fromEntries(
                    lengthOrder.map((key) => [key, (updatedNodeConfig?.[key] ?? (config?.nodeCount?.[key] ?? 0))])
                ) as TableConfiguration['nodeCount'],
                wledAddress: updatedWledAddress || ''
            });

            console.log(saveResponse);
            setUpdatedNodeConfig({});
            setUpdatedWledAddress(undefined);
        })();

    }, [config, updatedNodeConfig, updatedWledAddress]);

    const hasChanged = (updatedWledAddress) || (updatedNodeConfig && Object.keys(updatedNodeConfig).length > 0)

    if (typeof config === 'undefined') {
        return null;
    }

    return (
        <div>
            <div className="actions -mt-8 mb-10 grid grid-cols-2 gap-x-2 gap-y-4 items-center">
                {hasChanged && (
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
            <div className="collapse collapse-arrow bg-base-200">
                <input type="radio" name="config-node-count" defaultChecked />
                <div className="collapse-title text-xl font-medium">WLED Config</div>
                <div className="collapse-content">
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">WLED Address</span>
                        </div>
                        <input
                            type="text"
                            defaultValue={config.wledAddress}
                            placeholder="eg 192.168.68.54"
                            onChange={handleWledUpdate}
                            className="grow w-full disabled:text-accent py-3 px-4"
                        />
                    </label>
                </div>
            </div>
        </div>
    )
}