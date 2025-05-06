import { createContext } from "react";

export const ClothingTypeContext = createContext();

const ClothingTypeProvider = ({children})=>{
    return (
        <ClothingTypeContext.Provider value={{}}>
            {children}
        </ClothingTypeContext.Provider>
    )
}