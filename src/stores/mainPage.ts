import { defineStore } from 'pinia';
import { ref } from 'vue';

export default defineStore('mainPage', () => {
    const isHeaderInactive = ref(false);

    function activateHeader() {
        isHeaderInactive.value = true;
    }

    const inLoading = ref(false);

    return {
        activateHeader,
        inLoading,
        isHeaderInactive,
    };
});
