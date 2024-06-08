import {defineStore} from "pinia";
import {ref} from "vue";

export default defineStore('mainPage', () => {
    const isHeaderInactive = ref(false);

    function activateHeader() {
        isHeaderInactive.value = true;
    }

    return {
         activateHeader,
         isHeaderInactive,
    }
})