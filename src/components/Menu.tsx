import React, { useRef, useState } from "react";
import EffectList from '~/components/EffectList';
import InitiativeMode from '~/components/InitiativeMode';
import ListAreas from '~/components/ListAreas';

enum DrawerTypes {
    EFFECTS,
    AREAS,
    INITATIVE
}
export const Menu = () => {
    const drawerRef = useRef<HTMLInputElement>(null);
    const [menuMode, setMenuMode] = useState<DrawerTypes|null>(null);

    const handleEffectsClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setMenuMode(DrawerTypes.EFFECTS);
        drawerRef.current!.checked = true;
    }

    const handleAreaClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setMenuMode(DrawerTypes.AREAS);
        drawerRef.current!.checked = true;
    }
    
    const handleInitiativeClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setMenuMode(DrawerTypes.INITATIVE);
        drawerRef.current!.checked = true;
    }

    const handleSidebarClose = () => {
        drawerRef.current!.checked = false;
        setMenuMode(null);
    }

    return (
        <div className="drawer drawer-end">
            <input ref={drawerRef} id="sidebar" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <nav className="fixed left-6 top-1/2 -translate-y-1/2">
                    <ul className="menu bg-base-200 rounded-box gap-y-2">
                        <li>
                            <a className="tooltip tooltip-right py-4" data-tip="Areas" onClick={handleAreaClick}>
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
                                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a className="tooltip tooltip-right py-4" data-tip="Effects" onClick={handleEffectsClick}>
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
                                    <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a className="tooltip tooltip-right py-4" data-tip="Initiative" onClick={handleInitiativeClick}>
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
                                    <polygon xmlns="http://www.w3.org/2000/svg" points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>
                                </svg>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="drawer-side !pointer-events-none">
                <div className="bg-base-200 text-base-content min-h-full w-96 p-4 pr-8 pt-24 relative !pointer-events-auto">
                    <button
                        onClick={handleSidebarClose}
                        type="button"
                        aria-label="close sidebar"
                        className="btn btn-ghost btn-circle absolute top-1 right-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    {drawerRef.current?.checked && menuMode === DrawerTypes.AREAS ? (
                        <ListAreas onClose={handleSidebarClose} />
                    ) : null}
                    {drawerRef.current?.checked && menuMode === DrawerTypes.EFFECTS ? (
                        <EffectList onClose={handleSidebarClose} />
                    ) : null}
                    {drawerRef.current?.checked && menuMode === DrawerTypes.INITATIVE ? (
                        <InitiativeMode onClose={handleSidebarClose} />
                    ) : null}
                </div>
            </div>
        </div>
    )
}