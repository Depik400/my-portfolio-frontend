<script setup lang="ts">
import { useScene } from '../hooks/useScene';
import { Group, Object3DEventMap } from 'three';
import { useCache } from '../hooks/useCache';
import { onMounted, onUnmounted, reactive } from 'vue';

const { get } = useCache();

const rect = reactive({ x: getSize(), y: 600 });
const { addToScene, start, component: Scene } = useScene(rect);

onMounted(() => {
    window.addEventListener('resize', resize);
});

onUnmounted(() => {
    window.removeEventListener('resize', resize);
});

function resize() {
    Object.assign(rect, { x: getSize() });
}

function getSize(width?: number) {
    width ??= window.innerWidth;
    // if(width > 600) {
    //   return 600
    // }
    return width;
}

//initScene
addPlanetToScene();
addSpacemanToScene();
start();

async function addSpacemanToScene() {
    const { scene: innerScene, animations } = await addToScene('spaceman', await get('spaceman'));
    animations['Idle'].play();
    innerScene.position.set(0, 7, 0);
    innerScene.rotation.set(0, 0, 0);
    setTimeout(() => {
        animeSpaceman(innerScene);
    }, 2400);
}

async function addPlanetToScene() {
    const { scene: innerScene, animations } = await addToScene('planet', await get('planet'));
    animations['Animation'].play();
    innerScene.scale.set(1, 1, 1);
    animatePlanet(innerScene);
}

function easeInOutSine(t: number) {
    return -0.5 * (Math.cos(Math.PI * t) - 1);
}

function animeSpaceman(scene: Group<Object3DEventMap>) {
    let position = 7;
    let startPosition = 7;
    let rotation = -2;
    const runner = () => {
        if (position < 0.1) {
            return;
        }
        let step = easeInOutSine((position * 100) / startPosition / 100);
        let rotStep = easeInOutSine((rotation * 100) / 4 / 100);
        scene.position.set(0, (position = position - step), 0);
        scene.rotation.set(0, (rotation = rotation + rotStep) + 3.6, 0);
        requestAnimationFrame(runner);
    };
    requestAnimationFrame(runner);
}

function animatePlanet(scene: Group<Object3DEventMap>) {
    let positionX = -0.1;
    let positionY = -0.1;
    let positionZ = -0.1;
    let endPositionX = -10;
    let endPositionY = -10;
    let endPositionZ = -10;
    let scale = 1;
    let endScale = 3;
    const runner = () => {
        if (positionZ < -9.8) {
            return;
        }

        let stepX = easeInOutSine((positionX * 100) / endPositionX / 100) * 3;
        let stepY = easeInOutSine((positionY * 100) / endPositionY / 100) * 3;
        let stepZ = easeInOutSine((positionZ * 100) / endPositionZ / 100) * 3;
        scene.position.set(
            (positionX = positionX - stepX),
            (positionY = positionY - stepY),
            (positionZ = positionZ - stepZ)
        );
        let scaleStep = easeInOutSine((scale * 100) / endScale / 100) / 40;
        scale = scale + scaleStep;
        scene.scale.set(scale, scale, scale);
        requestAnimationFrame(runner);
    };
    requestAnimationFrame(runner);
}
</script>

<template>
    <Scene class="scene"></Scene>
</template>

<style></style>
