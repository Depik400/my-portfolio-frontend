export function useQuerySelector() {
    function selectOne<K extends keyof HTMLElementTagNameMap>(selectors: K): Promise<HTMLElementTagNameMap[K]>;
    function selectOne<K extends keyof SVGElementTagNameMap>(selectors: K): Promise<SVGElementTagNameMap[K]>;
    function selectOne<K extends keyof MathMLElementTagNameMap>(selectors: K): Promise<MathMLElementTagNameMap[K]>;
    function selectOne(selector: string) {
        return new Promise<unknown>((res, reject) => {
            if (document.readyState === 'complete') {
                const main = document.querySelector(selector);
                if (main) res(main);
                reject();
            } else {
                document.addEventListener(
                    'DOMContentLoaded',
                    () => {
                        const main = document.querySelector(selector);
                        if (main) res(main);
                        reject();
                    },
                    { once: true }
                );
            }
        });
    }

    return {
        selectOne,
    };
}
