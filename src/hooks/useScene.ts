import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { defineComponent, h, onUnmounted, reactive, UnwrapNestedRefs, watch } from 'vue';

export function useGLTFLoader(path: any): Promise<GLTF> {
    const { resolve, promise } = Promise.withResolvers<GLTF>();
    const loader = new GLTFLoader();
    loader.load(path, (gltf: GLTF) => {
        resolve(gltf);
    });
    return promise;
}

type ISceneAnimationHandler = {
    update: (delta: number) => void;
    play: () => void;
    stop: () => void;
    isActive: () => boolean;
};
type ISceneAnimation = {
    [sceneName: string]: {
        [animationName: string]: ISceneAnimationHandler;
    };
};

export function useScene(rect?: UnwrapNestedRefs<{ x: number; y: number }>) {
    if (!rect) {
        rect = reactive({ x: 600, y: 600 });
    }
    const scene = new THREE.Scene();
    const clock = new THREE.Clock();
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const camera = new THREE.PerspectiveCamera(75, rect.x / rect.y, 0.1, 1000);
    const controls = new OrbitControls(camera, renderer.domElement);
    const light = new THREE.PointLight(0xff0040, 0.3, 3);
    const animations: ISceneAnimation = {};
    const component = defineComponent({
        mounted() {
            renderer.domElement.style.setProperty('height', `${rect.y}px`);
            renderer.domElement.style.setProperty('width', `${rect.x}px`);
            this.$el.appendChild(renderer.domElement);
        },
        render() {
            return h('div');
        },
    });

    camera.position.set(2, 2, 2);
    camera.lookAt(0, 0, 0);
    light.position.set(0, 1, 0);
    light.lookAt(0, 0, 0);
    camera.add(light);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.enablePan = false;

    function animationIdle(gltf: GLTF) {
        const mixer = new THREE.AnimationMixer(gltf.scene);
        let isActive = false;
        gltf.scene.scale.set(1, 1, 1);
        gltf.scene.rotation.set(0.3, 0.3, 0.3);
        return gltf.animations
            .map((item) => ({
                [item.name]: {
                    update: (delta: number) => {
                        mixer.update(delta);
                    },
                    play: () => {
                        isActive = true;
                        mixer.clipAction(item).play();
                    },
                    stop: () => {
                        isActive = false;
                        mixer.clipAction(item).stop();
                    },
                    isActive: () => isActive,
                },
            }))
            .reduce((agg, prev) => ({ ...agg, ...prev }), {});
    }
    async function addToScene(
        name: string,
        gltf: GLTF,
        perform?: (scene: THREE.Scene, camera: THREE.Camera, gltf: GLTF) => Promise<void>
    ) {
        if (perform) {
            await perform(scene, camera, gltf);
        } else {
            scene.add(gltf.scene);
        }
        animations[name] = animationIdle(gltf);
        return {
            scene: gltf.scene,
            animations: animations[name],
        };
    }

    function animate() {
        const delta = clock.getDelta();
        for (const sceneKey in animations) {
            const scene = animations[sceneKey];
            for (const animationKey in scene) {
                const animation = scene[animationKey];
                if (animation.isActive()) {
                    animation.update(delta);
                }
            }
        }
        controls.update(delta);
        renderer.render(scene, camera);
    }

    function start() {
        let isRunning = true;
        const runner = () => {
            if (isRunning) {
                animate();
                requestAnimationFrame(runner);
            }
        };
        requestAnimationFrame(runner);
        return () => {
            isRunning = false;
        };
    }

    function updateSize({ x, y }: { x: number; y: number }) {
        renderer.setSize(x, y);
        camera.aspect = x / y;
        camera.updateProjectionMatrix();
        animate();
    }

    const stopHandler = watch(rect, updateSize);
    onUnmounted(() => {
        stopHandler();
    });

    updateSize(rect);
    renderer.render(scene, camera);
    return {
        component,
        start,
        addToScene,
    };
}
