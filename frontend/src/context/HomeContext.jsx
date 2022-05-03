import React, { createContext, useState } from 'react'

const HomeContext = createContext()

export const HomeProvider = ({ children }) => {
  const [isSortNameAsc, setIsSortNameAsc] = useState(false)
  const [isSortNameDesc, setIsSortNameDesc] = useState(false)
  const [isSortPriceAsc, setIsSortPriceAsc] = useState(false)
  const [isSortPriceDesc, setIsSortPriceDesc] = useState(false)
  

  return (
    <HomeContext.Provider
      value={{
        isSortNameAsc,
        setIsSortNameAsc,
        isSortNameDesc,
        setIsSortNameDesc,
        isSortPriceAsc,
        setIsSortPriceAsc,
        isSortPriceDesc,
        setIsSortPriceDesc,
      }}
    >
      {children}
    </HomeContext.Provider>
  )
}

export default HomeContext