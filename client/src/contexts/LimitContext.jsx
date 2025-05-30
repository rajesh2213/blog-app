import { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const LimitContext =  createContext()

export const LimitProvider = ({ children }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const pageReresh = performance.getEntriesByType('navigation')[0]?.type === 'reload'
    const initialLimit = pageReresh ? 2 : parseInt(searchParams.get('limit')) || 2;
    const [limit, setLimit] = useState(initialLimit)
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        setSearchParams({limit})
    }, [limit])

    return (
        <LimitContext.Provider value={{ limit, setLimit, offset, setOffset }}>
            {children}
        </LimitContext.Provider>
    )
};

export const useLimit = () => useContext(LimitContext)