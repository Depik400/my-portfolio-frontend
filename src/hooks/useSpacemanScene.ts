import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { defineComponent } from 'vue';
import { h } from 'vue';
function useGLTFLoader(path: any): Promise<GLTF> {
  const loader = new GLTFLoader();
  const { resolve, promise } = Promise.withResolvers<GLTF>();
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

export function useSpacemanScene() {
  let scene = new THREE.Scene();
  let clock = new THREE.Clock();
  let renderer = new THREE.WebGLRenderer({ alpha: true });
  const camera = new THREE.PerspectiveCamera(75, 600 / 600, 0.1, 1000);
  const controls = new OrbitControls(camera, renderer.domElement);
  const animations: ISceneAnimation = {};
  const component = defineComponent({
    mounted() {
      renderer.domElement.style.setProperty('height', '600px');
      renderer.domElement.style.setProperty('width', '600px');
      this.$el.appendChild(renderer.domElement);
    },
    render() {
      return h('div');
    },
  });

  camera.position.set(2, 2, 2);
  camera.lookAt(0, 0, 0);

  function setSceneSize(x: number, y: number) {
    renderer.setSize(x, y);
  }

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
  async function addToScene(name: string, GLTF: any) {
    const gltf = await useGLTFLoader(GLTF);
    scene.add(gltf.scene);
    animations[name] = animationIdle(gltf);
    return {
      scene: gltf.scene,
      animations: animations[name],
    };
  }

  function animate() {
    let delta = clock.getDelta();
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
    let runner = () => {
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
  setSceneSize(600, 600);
  return {
    component,
    setSceneSize,
    start,
    addToScene,
  };
}
