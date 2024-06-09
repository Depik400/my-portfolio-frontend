<template>
  <div class="my-info--container" :class="classes">
    <div class="info--contact-me">
      <span>Заинтересованы в сотрудничестве? Напишите мне:</span>
      <div class="info--links">
        <a class="info--link" href="https://vk.com/depik400" target="blank">
          <img :src="VKImage" />
        </a>
        <a class="info--link" href="https://t.me/+79992237363" target="blank">
          <img :src="TelegramImage" />
        </a>
        <a class="info--link" href="mailto:depik400@yandex.ru">
          <img :src="MailImage" />
        </a>
      </div>
    </div>
    <div class="info--info">
      Добро пожаловать! Ты попал на страницу мою страницу. К сожалению секция с моим опытом пока в разработке
      <br />
      <br />
      PS. Человечка слева можно крутить
    </div>
  </div>
</template>

<script lang="ts" setup>
import VKImage from '../assets/vk.svg';
import TelegramImage from '../assets/telegram.svg';
import MailImage from '../assets/mail.svg';
import useMainPageStore from '../stores/mainPage';
import { computed } from 'vue';

const store = useMainPageStore();

const classes = computed(() => (store.isHeaderInactive ? ['my-info--container-visible'] : []));
</script>

<style lang="scss">
.my-info--container {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  font-size: 30px;
  gap: 200px;
  opacity: 0;
  transition: opacity 3s ease;
  &.my-info--container-visible {
    opacity: 1;
  }
  .info--contact-me {
    position: relative;
    z-index: 4;
    display: flex;
    flex-direction: column;
    gap: 12px;
    .info--links {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      .info--link > img:hover {
        cursor: pointer;
        scale: 1.1;
      }
    }
  }
  .info--info {
    position: relative;
    z-index: 4;
  }
}
</style>
