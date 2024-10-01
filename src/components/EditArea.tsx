import { useCallback, useEffect, useState } from "react";
import areaManager from '~/models/areas';
import { AreaData, Segment } from "~/types/interface";

type AddNewSelectionProps = {
    onClose: () => void;
    onSuccess?: ({}) => void;
    area?: AreaData
}

export default ({ onClose, onSuccess, area }: AddNewSelectionProps) => {
    const [allSegments, setAllSegments] = useState<Segment[]>();
    const [name, setName] = useState<string>();
    const [segment, setSegment] = useState<number>();
    const [segmentPre, setSegmentPre] = useState<number>();
    const [segmentPost, setSegmentPost] = useState<number>();
    
    const handleCancelClick = useCallback(() => {
        onClose();
    }, [onClose]);

    const handleConfirmClick = useCallback(async () => {
        if (!name || !segment) {
            return;
        }

        const areaToSave = {
            ...area||{},
            name,
            segment,
            segmentPre,
            segmentPost
        };

        const updatedArea = await areaManager.save(areaToSave);
        if (typeof onSuccess === 'function') {
            onSuccess(updatedArea);
        }

        onClose();
    }, [name, segment, segmentPre, segmentPost, onClose]);

    useEffect(() => {
        (async () => {
            const [_, ...segments] = await areaManager.getAllSegments();

            setAllSegments(segments);
        })()
    }, []);


    if (!allSegments) {
        return 'Loading segments';
    }
    
    return (
        <>
            <div className="flex flex-col justify-between">
                <div className="flex flex-col gap-y-6">
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Area Name</span>
                        </div>
                        <input
                            onChange={(event) => setName(event.target.value)}
                            type="text"
                            placeholder="Name"
                            className={`input input-bordered w-full max-w-xs`}
                            defaultValue={area?.name}
                        />
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Segment</span>
                        </div>
                        <select
                            className="select select-bordered"
                            defaultValue={area?.segment || ''}
                            onChange={(event) => setSegment(event.target.value ? Number(event.target.value) : undefined)}
                        >
                            <option value="">Select a segment</option>
                            {allSegments.map((segment) => {
                                return (
                                    <option value={segment.id}>{segment.name}</option>
                                )
                            })}
                        </select>
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Pre Segment</span>
                        </div>
                        <select
                            className="select select-bordered"
                            defaultValue={area?.segmentPre || ''}
                            onChange={(event) => setSegmentPre(event.target.value ? Number(event.target.value) : undefined)}
                        >                            <option value="">Select a segment</option>
                            {allSegments.map((segment) => {
                                return (
                                    <option value={segment.id}>{segment.name}</option>
                                )
                            })}
                        </select>
                        <div className="label">
                            <span className="label-text-alt">Initiative Right</span>
                        </div>
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Post Segment</span>
                        </div>
                        <select
                            className="select select-bordered"
                            defaultValue={area?.segmentPost || ''}
                            onChange={(event) => setSegmentPost(event.target.value ? Number(event.target.value) : undefined)}
                        >
                            <option value="">Select a segment</option>
                            {allSegments.map((segment) => {
                                return (
                                    <option value={segment.id}>{segment.name}</option>
                                )
                            })}
                        </select>
                        <div className="label">
                            <span className="label-text-alt">Initiative Left</span>
                        </div>
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
                    disabled={!segment || !name}
                    onClick={handleConfirmClick}
                >
                    Confirm
                </button>
            </div>
        </>
    )
}