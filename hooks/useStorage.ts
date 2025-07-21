import { storage } from "@/storage"

export default function useStorage() {

    const fetchFromStorage = <T>(key: string): T | undefined => {
        const dataAsString = storage.getString(key);
        return dataAsString ? JSON.parse(dataAsString) as T : undefined;
    }

    const setInStorage = <T>(key: string, data: T): void => {
        const dataAsString = JSON.stringify(data);
        storage.set(key, dataAsString);
    }

    return {fetchFromStorage, setInStorage};
}