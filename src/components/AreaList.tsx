import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import areaModel from "../models/areas";
import nodesModel from '~/models/nodes';
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

    const loadList = useCallback(async () => {
        const items: AreaListingItem[] = await areaModel.list();
        console.log('response', items);
        setAreas((currentItems) =>{
            return items?.map((item) => {
                const currentItem = currentItems?.find(({ id }) => id === item.id);
                item.visible = currentItem?.visible ?? false;

                return item;
            });
        });
    }, [])

    const handleDeleteItem = useCallback((itemId: string) => {
        areaModel.delete(itemId);
        loadList();
    }, []);

    useEffect(() => {
        loadList();

        return () => {
            nodesModel.clearAll();
        }
    }, []);
    
    useEffect(() => {
        if (!areas) {
            return;
        }

        if (initialRender.current) {
            initialRender.current = false;

            return;
        }

        nodesModel.clearAll();

        areas!.filter((area) => {
            return area.visible;
        }).forEach((area) => {
            return nodesModel.highlight({
                nodes: area.nodes
            });
        });
    }, [areas])

    if (showEditForm) {
        return <EditArea onClose={handleEditClose} onSuccess={loadList} area={selectedArea} />;
    }

    return (
        <div>
            <div className="actions -mt-8 mb-10 grid grid-cols-2 gap-x-2">
                <div className="dropdown dropdown-left w-full">
                    <button type="button" className="btn btn-neutral w-full">Filter By Type</button>
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

                    const handleDeleteClick = () => {
                        handleDeleteItem(area.id!);
                    }

                    return (
                        <div key={area.id} className="flex justify-between items-center py-2 border-t last:border-b border-gray-400">
                            <ToggleView onChange={handleVisibilityChange} isOnByDefault={area.visible} />
                            <span className="flex self-center">
                                {area.name}
                            </span>
                            <details className="dropdown">
                                <summary className="btn m-1">
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
                                        <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
                                    </svg>
                                </summary>
                                <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                    <li><a onClick={handleEditClick}>Edit</a></li>
                                    <li><a onClick={handleDeleteClick}>Delete</a></li>
                                </ul>
                            </details>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}