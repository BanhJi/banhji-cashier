<template>
  <div id="app">
    <v-app id="inspire" class="custom_theme">
      <div v-if="validUser">
        <Header />
      </div>
      <div v-else>
        <NotAuthentication />
      </div>
      <v-main>
        <router-view />
        <vue-snotify />
        <!-- <Footer/> -->
        <Resource />
      </v-main>
    </v-app>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
// import Footer from '@/components/Footer'
import NotAuthentication from "./components/NotAuthentication.vue";
import { dataStore } from "@/observable/store";
const instituteHandler = require("@/scripts/instituteHandler.js");

export default {
  name: "App",
  components: {
    Header,
    NotAuthentication,
    // Footer
    Resource: () => import("@/components/Resource"),
  },
  data: () => ({}),
  computed: {
    validUser() {
      return dataStore.isValidUser;
    },
  },
  created() {
    // Initial Institute
    instituteHandler.init();
  },
};
</script>
