
import React, { createContext, useContext, useState } from 'react';

interface NavigationContextType {
  hideFloatingButtons: boolean;
  setHideFloatingButtons: (hide: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hideFloatingButtons, setHideFloatingButtons] = useState(false);

  return (
    <NavigationContext.Provider value={{
      hideFloatingButtons,
      setHideFloatingButtons
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
