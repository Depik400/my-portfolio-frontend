const cache: Record<string | symbol | number, unknown> = {};

export function useCache() {
    async function get<T>(key: string | symbol | number, fallback?: () => Promise<T>) {
        if (cache[key]) {
            return cache[key] as T;
        }
        if (fallback) {
            return (cache[key] = (await fallback()) as T);
        }
        throw new Error('Cache for key not founded');
    }

    return {
        get,
    };
}
