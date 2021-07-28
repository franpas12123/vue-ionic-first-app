<template>
  <ion-page>
    <!-- <Sidebar></Sidebar> -->
    <ion-header :translucent="true" v-if="pageTitle != 'Login'">
      <ion-toolbar>
        <ion-title
          ><strong>{{ pageTitle }}</strong></ion-title
        >
        <ion-buttons slot="start">
          <ion-menu-button autoHide="false"></ion-menu-button>
        </ion-buttons>
      </ion-toolbar>
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
  IonToolbar,
  IonTitle,
  IonContent,
  IonMenuButton,
  IonButtons,
  // menuController,
} from '@ionic/vue';
import { mapActions } from 'vuex';
// import Sidebar from './SidebarLayout';

export default {
  props: ['pageTitle'],
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonMenuButton,
    IonButtons,
    // Sidebar,
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions(['getStudent']),
    // openSidebar() {
    //   menuController.enable(true, 'first');
    //   menuController.open('first');
    //   console.log('opensidebar');
    // },
  },
  created() {
    console.log('student');
    console.log(this.getStudent);
    console.log(this.$store.state);
  },
};
</script>
