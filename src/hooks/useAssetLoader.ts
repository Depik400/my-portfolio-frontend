import spaceman from '../assets/spaceman.glb';
import planet from '../assets/stylized_planet.glb';
import { useCache } from './useCache';
import { useQuerySelector } from './useQuerySelector';
import { useGLTFLoader } from './useScene';

const { get } = useCache();
const { selectOne } = useQuerySelector();

export function loadGLTF() {
    return Promise.allSettled([
        get('spaceman', () => useGLTFLoader(spaceman)),
        get('planet', () => useGLTFLoader(planet)),
    ]);
}

export function loadFonts() {
    return document.fonts.ready;
}

async function loadBackground() {
    const { promise, resolve } = Promise.withResolvers<void>();
    if (document.readyState === 'complete') {
        resolve();
    }
    const img = new Image();
    const selector = await selectOne('main');
    const style = getComputedStyle(selector, '::before');
    const match = style.background.match(/url\("(?<url>.*)"\)/);
    if (match?.groups?.url) {
        img.onload = () => resolve();
        img.src = match.groups.url;
    }

    return promise;
}

export function loadImages() {
    return Promise.allSettled([loadBackground()]);
}

export async function useAssetLoader(loadMs: number = 0) {
    const awaiter = new Promise<void>((resolve) => {
        setTimeout(() => resolve(), loadMs);
    });
    return Promise.allSettled([loadGLTF(), loadFonts(), loadImages(), awaiter]).then(() => true);
}
