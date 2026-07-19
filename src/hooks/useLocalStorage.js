import { useState } from "react";

/**
 * Custom hook to manage state in local storage.
 * @param {string} key Local storage key
 * @param {any} initialValue Initial state value
 * @returns {[any, Function]} State and setter function
 */
export function useLocalStorage(key, initialValue) {
  // Prevent build errors if window is undefined
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
export default useLocalStorage;
