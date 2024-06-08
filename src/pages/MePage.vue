<template>
  <div id="me">
    <div class="me" :class="meClasses" ref="me">
      <span class="me__name" v-for="letter in name">{{ letter }}</span>
    </div>
    <space-man />
  </div>
</template>

<script setup lang="ts">
import animation from 'animejs';
import { onMounted, reactive, ref } from 'vue';
import { useTrain } from '../hooks/useTrain';
import useMainPageStore from '../stores/mainPage';
import SpaceMan from '../components/SpaceMan.vue';
const name = 'Павел Кононов';
const me = ref<HTMLDivElement>();
const meClasses = reactive<string[]>([]);
const { runAsThenable } = useTrain();

const mainPageStore = useMainPageStore();

onMounted(() => {
  runAsThenable(animateName, animeHeader);
});
function animateName() {
  const { resolve, promise } = Promise.withResolvers();
  let timeline = animation.timeline().add({
    targets: '.me .me__name',
    translateY: [100, 0],
    easing: 'easeOutExpo',
    duration: 1400,
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
</style>
