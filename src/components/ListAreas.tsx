import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import areaModel from "../models/areas";
import { AreaData } from '../types/interface';
import ToggleView from './ToggleView';
import EditArea from './EditArea';

type AreaListingItem = AreaData & {
    visible?: boolean;
};

type ListAreasProps = {
    onClose: () => void
}

export default ({ onClose }: ListAreasProps) => {
    const initialRender = useRef(true);
    const [areas, setAreas] = useState<AreaListingItem[]>();
    const [filteredType, setFilteredType] = useState<string>();
    const [selectedArea, setSelectedArea] = useState<AreaData>();
    const [showEditForm, setShowEditForm] = useState<boolean>(false);

    const handleNewClick = useCallback(() => {
        setShowEditForm(true);
    }, []);

    const handleEditClose = useCallback(() => {
        setSelectedArea(undefined);
        setShowEditForm(false);
    }, []);

    const filters = useMemo(() => {
        return areas?.reduce((allFilters: string[], area) => {
            if (!allFilters.includes(area.type)) {
                allFilters.push(area.type);
            }

            return allFilters;
        }, ['All']);
    }, [areas]);

    const filteredAreas = useMemo(() => {
        if (!filteredType || filteredType === 'All') {
            return areas;
        }

        return areas?.filter(({ type }) => type === filteredType);
    }, [areas, filteredType]);

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

    if (showEditForm) {
        return <EditArea onClose={handleEditClose} area={selectedArea} />;
    }

    return (
        <div>
            <div className="actions -mt-8 mb-10 grid grid-cols-2 gap-x-2">
                <div className="dropdown dropdown-left w-full">
                    <button type="button" className="btn btn-neutral w-full">Filter By Area</button>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                        {filters?.map((filter) => {
                            return (
                                <li
                                    key={filter}
                                    className={filter === filteredType ? 'bg-gray-200' : ''}
                                >
                                    <a onClick={() => setFilteredType(filter)}>{filter}</a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <button
                    onClick={handleNewClick}
                    type="button"
                    className="btn btn-primary w-full"
                >New Area</button>
            </div>
            <div className="menu">
                {filteredAreas?.map((area) => {
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

                    const handleEditClick = () => {
                        setSelectedArea(area);
                        setShowEditForm(true);
                    }

                    return (
                        <div key={area.id} className="flex justify-between items-center py-2 border-t last:border-b border-gray-400">
                            <ToggleView onChange={handleVisibilityChange} />
                            <span className="flex self-center">
                                {area.name}
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