'use client'

import { createContext, useState } from 'react';

export const CursorContext = createContext<[string, Function] | []>([]);

export const CursorProvider = ({ children }: { children: React.ReactNode }) => {
    const [cursorType, setCursorType] = useState<string>("default");
    return <CursorContext.Provider value={[cursorType, setCursorType]}>{children}</CursorContext.Provider>;
};
