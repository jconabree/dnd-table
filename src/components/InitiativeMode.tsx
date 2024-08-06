import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AreaData } from "~/types/interface";
import areasModel from '~/models/areas';

type Character = {
    id: string;
    nickname: string;
    area: AreaData;
    initiative: number;
    showHealth: boolean;
    health: {
        max: number;
        current: number;
    }
}

type InitiativeModeProps = {
    onClose: () => void;
}

export default ({ onClose }: InitiativeModeProps) => {
    const newDropdownRef = useRef<HTMLDetailsElement>(null);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [updateQueue, setUpdateQueue] = useState<Character[]|null>(null);
    const [areas, setAreas] = useState<AreaData[]>();
    const [isStarted, setIsStarted] = useState<boolean>();
    const [currentTurn, setCurrentTurn] = useState<number|null>(null);

    useEffect(() => {
        (async () => {
            const allAreas = await areasModel.list();
            setAreas(allAreas.filter(({ type }) => type === 'dndplayer'));
        })()
    }, []);

    const orderedCharacters = useMemo<Character[]>(() => {
        if (!characters?.length) {
            return [];
        }

        return characters.sort((characterA, characterB) => {
            return characterA.initiative - characterB.initiative;
        });
    }, [characters]);

    const handleCreateNew = useCallback((area: AreaData) => {
        newDropdownRef.current!.removeAttribute('open');
        setCharacters((currentCharacters) => {
            const newCharacter: Character = {
                area,
                id: Date.now().toString(),
                nickname: `New Character (${currentCharacters.length + 1})`,
                initiative: 0,
                showHealth: true,
                health: {
                    max: 40,
                    current: 40
                }
            };

            return [
                newCharacter,
                ...currentCharacters
            ]
        })
    }, []);

    const removeCharacter = useCallback((character: Character) => {
        setCharacters((currentCharacters) => {
            return currentCharacters.filter(({ id }) => id !== character.id);
        })

        setUpdateQueue((updateCharacters) => {
            return updateCharacters?.filter(({ id }) => id !== character.id) || null;
        })
    }, [])

    const updateCharacter = useCallback((character: Character, key: string, value: string|boolean) => {
        let updatedCharacter: Character;

        if (key.includes('health')) {
            const [_, healthKey] = key.split('.');

            updatedCharacter = {
                ...character,
                health: {
                    ...character.health,
                    [healthKey]: value
                }
            }
        } else {
            updatedCharacter = {
                ...character,
                [key]: value
            }
        }

        setUpdateQueue((characterQueue) => {
            return [
                updatedCharacter,
                ...characterQueue?.filter((currentCharacter) => {
                    return currentCharacter.id !== character.id;
                }) || [],
            ]
        })
    }, []);

    const applyUpdates = useCallback(() => {
        if (!updateQueue) {
            return;
        }

        setCharacters((currentCharacters) => {
            return currentCharacters.map((character) => {
                const update = updateQueue.find(({ id }) => id === character.id);

                if (update) {
                    return {
                        ...update
                    }
                }

                return character;
            })
        });

        setUpdateQueue(null);
    }, [updateQueue]);

    const handleStart = useCallback(() => {
        setCurrentTurn(0);
        setIsStarted(true);
    }, []);

    const handleStop = useCallback(() => {
        setCurrentTurn(null);
        setIsStarted(false);
    }, []);

    const handlePrevious = useCallback(() => {
        setCurrentTurn((currentTurnValue) => {
            return currentTurnValue === null || currentTurnValue - 1 < 0 ? characters.length - 1 : currentTurnValue - 1;
        });
    }, [characters]);

    const handleNext = useCallback(() => {
        setCurrentTurn((currentTurnValue) => {
            return currentTurnValue === null || currentTurnValue + 1 >= characters.length ? 0 : currentTurnValue + 1;
        });
    }, [characters]);

    if (typeof areas === 'undefined') {
        return null;
    }

    if (!areas.length) {
        return "Create DND Player areas before using Initiative"
    }

    return (
        <div>
            <div className="actions -mt-8 mb-10 grid grid-cols-2 gap-x-2 gap-y-4">
                {!isStarted && (
                    <button
                        onClick={handleStart}
                        type="button"
                        className="btn btn-primary w-full"
                    >Start</button>
                )}
                {isStarted && (
                    <div className="join">
                        <button className="btn btn-sm btn-accent join-item" onClick={handlePrevious}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                <polygon points="19 20 9 12 19 4 19 20"/>
                                <line x1="5" y1="19" x2="5" y2="5"/>
                            </svg>
                        </button>
                        <button className="btn btn-sm btn-accent join-item" onClick={handleNext}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                <polygon points="5 4 15 12 5 20 5 4"/>
                                <line x1="19" y1="5" x2="19" y2="19"/>
                            </svg>
                        </button>
                        <button className="btn btn-sm btn-accent join-item" onClick={handleStop}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            </svg>
                        </button>
                    </div>
                )}
                <details ref={newDropdownRef} className="dropdown w-full">
                    <summary className="btn btn-primary w-full">New Character</summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                        {areas.map((area) => {
                            return (
                                <li><a onClick={() => { handleCreateNew(area) }}>{area.name}</a></li>
                            )
                        })}
                    </ul>
                </details>
                {updateQueue?.length! > 0 && (
                    <button
                        className="btn btn-accent"
                        onClick={applyUpdates}
                    >
                        Update
                    </button>
                )}
            </div>
            <div className="grid gap-y-8">
                {orderedCharacters.map((orderCharacter) => {
                    const updatedCharacter = updateQueue?.find(({ id }) => id === orderCharacter.id);
                    const character: Character = {
                        ...orderCharacter,
                        ...updatedCharacter || {}
                    };
                    const showHealth = updatedCharacter?.showHealth ?? character.showHealth;

                    return (
                        <div className="p-4 rounded-lg bg-base-100 text-base-content w-full grid grid-cols-2 gap-x-3 gap-y-8 relative">
                            <button className="btn btn-error btn-circle btn-sm absolute -top-3 -right-1" onClick={() => { removeCharacter(orderCharacter) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                                    <line xmlns="http://www.w3.org/2000/svg" x1="5" y1="12" x2="19" y2="12"/>
                                </svg>
                            </button>
                            <label className="input input-sm input-ghost flex items-center gap-2 col-span-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                </svg>
                                <input
                                    type="text"
                                    value={character.nickname}
                                    placeholder="Nickname"
                                    onChange={(event) => {
                                        updateCharacter(character, 'nickname', event.target.value)
                                    }}
                                    className="grow w-full"
                                />
                            </label>
                            <label className="input input-sm input-ghost flex items-center gap-2 col-span-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                                    <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
                                </svg>
                                <input
                                    type="text"
                                    value={character.initiative}
                                    placeholder="Initiative"
                                    onChange={(event) => {
                                        updateCharacter(character, 'initiative', event.target.value)
                                    }}
                                    className="grow w-full"
                                />
                            </label>
                            <div className="bg-accent text-accent-content rounded-md flex items-center justify-center col-span-1">
                                {character.area.name}
                            </div>
                            <div className="w-full flex justify-end items-center pr-2 col-span-1">
                                <input
                                    type="checkbox"
                                    className="toggle toggle-info"
                                    checked={character.showHealth}
                                    onChange={(event) => {
                                        updateCharacter(character, 'showHealth', event.target.checked)
                                    }}
                                />
                            </div>
                            <div className="w-full col-span-1">
                                <div className="join w-full">
                                    <div className="join-item w-2/5">
                                        <input
                                            type="text"
                                            value={character.health.current}
                                            placeholder="HP"
                                            onChange={(event) => {
                                                updateCharacter(character, 'health.current', event.target.value)
                                            }}
                                            disabled={!showHealth}
                                            className="input input-sm input-ghost w-full text-center"
                                        />
                                    </div>
                                    <div className="join-item w-1/5 text-center leading-8">/</div>
                                    <div className="join-item w-2/5">
                                        <input
                                            type="text"
                                            value={character.health.max}
                                            placeholder="Max"
                                            onChange={(event) => {
                                                updateCharacter(character, 'health.max', event.target.value)
                                            }}
                                            disabled={!showHealth}
                                            className="input input-sm input-ghost w-full text-center"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}