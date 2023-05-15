import { useState, useEffect } from "react"

const useLocalStorage = (key, initialValue) => {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    const value = localStorage.getItem(key);
    // Set Cookies
    document.cookie = `${key}=${value}; path=/; expires=Thu, 31 Dec 2099 23:59:59 GMT`;

    value != 'null' && setState(value);
  }, [])

  function setValue(valueToStore) {
    localStorage.setItem(key, JSON.stringify(valueToStore));
    // Set Cookies
    document.cookie = `${key}=${valueToStore}; path=/; expires=Thu, 31 Dec 2099 23:59:59 GMT`;
    setState(valueToStore);
  }

  return [state, setValue]
}

export default useLocalStorage