import React, { useRef, useState } from "react";
import Configurations from '~/components/Configurations';
import InitiativeMode from '~/components/InitiativeMode';
import AreaList from '~/components/AreaList';

enum DrawerTypes {
    AREAS,
    INITATIVE,
    CONFIGURATION
}
export const Menu = () => {
    const drawerRef = useRef<HTMLInputElement>(null);
    const [menuMode, setMenuMode] = useState<DrawerTypes|null>(null);

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
    
    const handleConfigClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setMenuMode(DrawerTypes.CONFIGURATION);
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
                        <li>
                            <a className="tooltip tooltip-right py-4" data-tip="Configurations" onClick={handleConfigClick}>
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
                                    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                                </svg>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="drawer-side !pointer-events-none">
                <div className={`bg-base-200 text-base-content min-h-full w-96 p-4 pt-24 pb-16 relative !pointer-events-auto ${drawerRef.current?.checked && 'right-4'}`}>
                    <button
                        onClick={handleSidebarClose}
                        type="button"
                        aria-label="close sidebar"
                        className="btn btn-ghost btn-circle absolute top-1 right-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    {drawerRef.current?.checked && menuMode === DrawerTypes.AREAS ? (
                        <AreaList onClose={handleSidebarClose} />
                    ) : null}
                    {drawerRef.current?.checked && menuMode === DrawerTypes.INITATIVE ? (
                        <InitiativeMode onClose={handleSidebarClose} />
                    ) : null}
                    {drawerRef.current?.checked && menuMode === DrawerTypes.CONFIGURATION ? (
                        <Configurations onClose={handleSidebarClose} />
                    ) : null}
                </div>
            </div>
        </div>
    )
}