<template>
  <main>
    <header :class="headerClasses">
      <span> Павел Кононов </span>
    </header>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import useMainPageStore from './stores/mainPage.ts';
import { computed } from 'vue';

const store = useMainPageStore();

const headerClasses = computed(() => (store.isHeaderInactive ? ['header-visible'] : ['header-hidden']));
</script>
<style scoped>
main {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 1280px;
  margin: 0 auto;
}

header {
  height: 48px;
  font-size: 2em;
  &.header-hidden {
    opacity: 0;
  }
  &.header-visible {
    opacity: 1;
    position: relative;
    &::before {
      position: absolute;
      content: '';
      width: 100%;
      height: 2px;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(90deg, rgb(98, 0, 128), rgb(255, 0, 212), rgb(98, 0, 128));
      animation: headerLine 2s ease-in;
      &::before {
        content: '';
        position: absolute;
        height: 46px;
        width: 10px;
        background-color: green;
      }
    }
  }
}

@keyframes headerLine {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
