import React, { createContext, useContext } from "react";
import useConfiguratorProvider, { ConfiguratorContextValues } from '~/hooks/useConfiguratorProvider';

const ConfiguratorContext = createContext<ConfiguratorContextValues|null>(null);

export default ({ children }: { children: React.ReactNode }) => {
    const configuratorValues = useConfiguratorProvider();
    return (
        <ConfiguratorContext.Provider value={configuratorValues}>
            {children}
        </ConfiguratorContext.Provider>
    )
}

export const useConfiguratorContext = () => useContext(ConfiguratorContext)!;