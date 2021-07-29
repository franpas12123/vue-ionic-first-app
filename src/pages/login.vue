<template>
  <base-layout pageTitle="Login">
    <div class="login-bg"></div>
    <div class="container">
      <ion-grid>
        <ion-row class="ion-margin-bottom">
          <ion-col>
            <ion-img :src="logo"></ion-img>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col class="ion-margin-bottom ion-margin-top">
            <ion-item class="ion-margin-bottom">
              <ion-icon :icon="personOutline" slot="start"></ion-icon>
              <ion-input
                clear-input
                placeholder="Enter email"
                v-model="email"
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-icon :icon="lockClosedOutline" slot="start"></ion-icon>
              <ion-input
                type="password"
                clear-input
                placeholder="Enter password"
                v-model="password"
              ></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col class="ion-margin-top">
            <ion-button expand="block" @click="submit()">Sign In</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from '../layouts/BaseLayout.vue';
import { IonInput, IonItem, IonIcon } from '@ionic/vue';
import { personOutline, lockClosedOutline } from 'ionicons/icons';
import { mapActions } from 'vuex';

export default {
  name: 'Login',
  setup() {
    return {
      personOutline,
      lockClosedOutline,
    };
  },
  data() {
    return {
      email: '',
      emailRegex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      error: '',
      loading: false,
      password: '',
      showPassword: false,
      logo: require('../assets/logo.png'),
    };
  },
  components: { BaseLayout, IonInput, IonItem, IonIcon },
  methods: {
    ...mapActions(['checkStorageForStudent', 'fetchStudent']),
    async submit() {
      if (!this.email || !this.emailRegex.test(this.email)) {
        this.error = 'Please provide a valid email address';
      } else if (!this.password) {
        this.error = 'Please provide a valid password';
      } else {
        this.loading = true;
        await this.fetchStudent({ email: this.email, password: this.password })
          .then(() => {
            this.$emit('close');
            this.loading = false;
            console.log('signin');
            console.log(this.email);
            console.log(this.password);
            this.$router.push('/');
          })
          .catch((error) => {
            this.error = error;
            this.loading = false;
          });
      }
    },
  },
  mounted() {
    this.checkStorageForStudent().then((student) => {
      if (student) this.$router.push({ name: 'LeaderManual' });
    });

    document.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') this.submit();
    });
  },
};
</script>

<style scoped>
ion-item {
  border-radius: 15px;
}
</style>
