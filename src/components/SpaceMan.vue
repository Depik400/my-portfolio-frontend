<script setup lang="ts">
import { useSpacemanScene } from '../hooks/useSpacemanScene';
import spaceman from '../assets/spaceman.glb';
import { Object3DEventMap, Group } from 'three';
const { addToScene, start, component: Scene } = useSpacemanScene();
start();

let scene: Group<Object3DEventMap>;
addToScene('spaceman', spaceman).then(({ scene: innerScene, animations }) => {
  animations['Idle'].play();
  innerScene.position.set(0, 10, 0);
  setTimeout(() => {
    requestAnimationFrame(anime);
  }, 2000);
  scene = innerScene;
});

function anime() {
  let position = 10;
  let step = 0.1;
  const runner = () => {
    if (position < 0) {
      return;
    }
    if (position < 7) {
      step = 0.07;
    }
    if (position < 5) {
      step = 0.05;
    }
    if (position < 4) {
      step = 0.04;
    }
    if (position < 3) {
      step = 0.03;
    }
    if (position < 2) {
      step = 0.02;
    }
    if (position < 1) {
      step = 0.01;
    }
    scene.position.set(0, (position = position - step), 0);
    requestAnimationFrame(runner);
  };
  runner();
}
</script>

<template>
  <Scene></Scene>
</template>
