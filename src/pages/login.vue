<template>
    <base-layout pageTitle="Login">
        <div class="container">
            <ion-grid>
                <ion-row>
                    <ion-col class="ion-margin-bottom">
                        <ion-item>
                            <ion-icon :icon="personOutline" slot="start"></ion-icon>
                            <ion-input clear-input placeholder="Enter email"></ion-input>
                        </ion-item>

                        <ion-item>
                            <ion-icon :icon="lockClosedOutline" slot="start"></ion-icon>
                            <ion-input type="password" clear-input placeholder="Enter password"></ion-input>
                        </ion-item>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col class="ion-margin-top">
                        <ion-button expand="block">Sign In</ion-button>
                    </ion-col>
                </ion-row>
            </ion-grid>
            
        </div>
    </base-layout>
</template>

<script>
import BaseLayout from '../components/BaseLayout.vue';
import {  IonInput, IonItem, IonIcon } from '@ionic/vue';
import { personOutline, lockClosedOutline } from 'ionicons/icons';

export default {
    name: 'Login',
    setup() {
        return {
            personOutline, lockClosedOutline
        }
    },
    components: { BaseLayout, IonInput, IonItem, IonIcon },  
}
</script>