import { useEffect, useRef, useState } from 'react';
import areaModel from "../models/areas";
import { AreaData } from '../types/interface';
import ToggleView from './ToggleView';

type AreaListingItem = AreaData & {
    visible?: boolean;
};

type ListAreasProps = {
    onClose: () => void
}

export default ({ onClose }: ListAreasProps) => {
    const initialRender = useRef(true);
    const [areas, setAreas] = useState<AreaListingItem[]>();

    useEffect(() => {
        (async () => {
            const items: AreaListingItem[] = await areaModel.list();
            console.log('response', items);
            setAreas(
                items?.map((item) => {
                    item.visible = true;

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

        const visibleAreas = areas!.filter((area) => {
            return area.visible;
        });

        console.log('set canvas visible areas', visibleAreas);
    }, [areas])
    console.log('areas', areas)

    return (
        <div className="menu">
            {areas?.map((area) => {
                const handleVisibilityChange = (isVisible: boolean) => {
                    setAreas((currentAreas) => {
                        return [
                            ...currentAreas!.map((currentArea) => {
                                if (currentArea.id === area.id) {
                                    currentArea.visible = isVisible
                                }

                                return {
                                    ...currentArea
                                };
                            })
                        ]
                    })
                }

                return (
                    <div>
                        <ToggleView onChange={handleVisibilityChange} />
                        {area.name}
                        <button type="button" className="btn btn-circle btn-ghost">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-8 h-8"
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
    )
}