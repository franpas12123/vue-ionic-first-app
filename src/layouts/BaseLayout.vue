<template>
  <ion-page>
    <!-- <Sidebar></Sidebar> -->
    <ion-header :translucent="true" v-if="pageTitle != 'Login'">
      <!-- <ion-toolbar>
        <ion-img v-if="showLogo" :src="require('@/assets/logo.png')"></ion-img>
        <ion-title>
          <strong>{{ pageTitle }}</strong>
        </ion-title>
        <ion-buttons slot="end">
          <ion-button color="secondary">
            <ion-icon :icon="logOutOutline" slot="start" class="logoIcon"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar> -->
    </ion-header>
    <ion-content :fullscreen="true">
      <slot />
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  // IonToolbar,
  // IonTitle,
  // IonContent,
  // IonButtons,
  // menuController,
} from '@ionic/vue';
import { mapActions } from 'vuex';
import { logOutOutline } from 'ionicons/icons';

export default {
  props: ['pageTitle', 'showLogo'],
  components: {
    IonPage,
    IonHeader,
    // IonToolbar,
    // IonTitle,
    // IonContent,
    // IonButtons,
    // Sidebar,
  },
  data() {
    return {
      logOutOutline,
    };
  },
  // computed: {
  //   logo() {
  //     return this.logoPath ?
  //   },
  // },
  methods: {
    ...mapActions(['getStudent']),
    // openSidebar() {
    //   menuController.enable(true, 'first');
    //   menuController.open('first');
    //   console.log('opensidebar');
    // },
  },
};
</script>

<style scoped>
.logoIcon {
  padding-left: 3px;
}
</style>
