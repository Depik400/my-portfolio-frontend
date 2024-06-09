<template>
  <div id="me">
    <div ref="me" class="me" :class="meClasses">
      <span v-for="letter in name" :key="letter" class="me__name">{{ letter }}</span>
    </div>
    <div class="info--container">
      <space-man class="spaceman" />
      <my-info class="info"></my-info>
    </div>
  </div>
</template>

<script setup lang="ts">
import animation from 'animejs';
import { onMounted, reactive, ref } from 'vue';
import { useTrain } from '../hooks/useTrain';
import useMainPageStore from '../stores/mainPage';
const name = 'Pavel Kononov';
const me = ref<HTMLDivElement>();
const meClasses = reactive<string[]>([]);
const { runNormal } = useTrain();

const mainPageStore = useMainPageStore();

onMounted(() => {
  runNormal(animateName, animeHeader);
});
function animateName() {
  const { resolve, promise } = Promise.withResolvers();
  let timeline = animation.timeline().add({
    targets: '.me .me__name',
    translateY: [100, 0],
    easing: 'easeOutExpo',
    duration: 1000,
    delay: animation.stagger(100),
  });
  const { top } = me.value!.getBoundingClientRect();
  timeline.add({
    targets: '.me',

    translateY: -top - 48 / 2 + 4,
    easing: 'easeOutExpo',
    duration: 1400,
    begin: () => {
      meClasses.push('me_minify');
    },
    complete: () => {
      meClasses.push('me_hidden');
      resolve(null);
    },
  });
  return promise;
}

async function animeHeader() {
  mainPageStore.activateHeader();
  return Promise.resolve();
}
</script>

<style lang="scss">
#me {
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
.me {
  position: absolute;
  text-align: center;
  z-index: 5;
  overflow: hidden;
  font-size: 4em;
  white-space: break-spaces;
  transition: font-size 1s ease-out;
  &.me_minify {
    font-size: 2em;
  }
  &.me_hidden {
    display: none;
  }
}

.me__name {
  display: inline-block;
}

.info--container {
  min-height: 600px;
  position: relative;
  .spaceman {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  }
}
</style>
