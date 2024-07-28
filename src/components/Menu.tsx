import React, { useRef, useState } from "react";
import { useConfiguratorContext } from "~/context/ConfiguratorProvider";
import EditArea from '~/components/EditArea';
import ListAreas from '~/components/ListAreas';

export const Menu = () => {
    const drawerRef = useRef<HTMLInputElement>();
    const { setIsSelectMode } = useConfiguratorContext();
    const [menuMode, setMenuMode] = useState<'add'|'list'>('add');

    const handleAddClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setMenuMode('add');
        setIsSelectMode(true);
        drawerRef.current!.checked = true;
    }

    const handleListClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setMenuMode('list');
        drawerRef.current!.checked = true;
    }

    const handleSidebarClose = () => {
        drawerRef.current!.checked = false;
        setIsSelectMode(false);
    }

    return (
        <div className="drawer drawer-end">
            <input ref={drawerRef} id="sidebar" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <nav className="fixed left-6 top-1/2 -translate-y-1/2">
                    <ul className="menu bg-base-200 rounded-box gap-y-2">
                        <li>
                            <a className="tooltip tooltip-right py-4" data-tip="List" onClick={handleListClick}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                            </a>
                        </li>
                        <li>
                            <a className="tooltip tooltip-right py-4" data-tip="Add" onClick={handleAddClick}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="drawer-side !pointer-events-none">
                <div className="bg-base-200 text-base-content min-h-full h-full w-80 p-4 pt-24 relative !pointer-events-auto">
                    <button
                        onClick={handleSidebarClose}
                        type="button"
                        aria-label="close sidebar"
                        className="btn btn-ghost btn-circle absolute top-1 right-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    {menuMode === 'add' ? (
                        <EditArea onClose={handleSidebarClose} />
                    ) : null}
                    {menuMode === 'list' ? (
                        <ListAreas onClose={handleSidebarClose} />
                    ) : null}
                </div>
            </div>
        </div>
    )
}