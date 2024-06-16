<template>
    <main :class="mainClasses">
        <header :class="headerClasses">
            <span> Pavel Kononov </span>
        </header>
        <div class="main">
            <RouterView v-if="isLoaded" />
            <div v-else class="loader loader-center">
                <span class="loader--text">Loading...</span>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { useAssetLoader } from './hooks/useAssetLoader.ts';
import useMainPageStore from './stores/mainPage.ts';
import { computed, ref } from 'vue';

const store = useMainPageStore();

const headerClasses = computed(() => (store.isHeaderInactive ? ['header-visible'] : ['header-hidden']));
const mainClasses = computed(() => (store.isHeaderInactive ? ['background'] : []));

const isLoaded = ref(false);

useAssetLoader(3000).then(() => {
    isLoaded.value = true;
});
</script>

<style scoped>
main {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: 0 auto;
    &::before {
        position: absolute;
        content: '';
        background: url('assets/surface.svg');
        width: 100%;
        height: 100%;
        filter: brightness(0%);
    }
    &.background::before {
        position: absolute;
        content: '';
        width: 100%;
        height: 100%;
        filter: brightness(30%);
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        transition: filter 1.2s ease-out;
    }
    .main {
        height: 100%;
        max-width: 1280px;
        min-width: 300px;
        margin: 0 auto;
    }
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

.loader-center {
    position: absolute;
    top: 50%;
    left: 50%;
    scale: 2;
    transform: translate(-25%, -50%);

    .loader--text {
        position: absolute;
        bottom: -2rem;
        left: 50%;
        transform: translateX(-50%);
        clip-path: inset(0px 12px 0px 0px);
        animation: loader-dots 1s infinite reverse;
    }
}

@keyframes loader-dots {
    0% {
        clip-path: inset(0px 0px 0px 0px);
    }
    32% {
        clip-path: inset(0px 0px 0px 0px);
    }
    33% {
        clip-path: inset(0px 4px 0px 0px);
    }
    65% {
        clip-path: inset(0px 4px 0px 0px);
    }
    66% {
        clip-path: inset(0px 8px 0px 0px);
    }
    99% {
        clip-path: inset(0px 8px 0px 0px);
    }
    100% {
        clip-path: inset(0px 12px 0px 0px);
    }
}
</style>
