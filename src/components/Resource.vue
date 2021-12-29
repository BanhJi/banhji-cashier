<template>
  <div class="box">
    <div v-if="show" class="box_resource">
      <div>
        <div class="headerbox">
          <v-row class="px-3">
            <v-col cols="9" class="pb-0">
              <v-text-field
                @keyup="submitSearch"
                v-model="keyword"
                outlined
                placeholder="Search"
              />
            </v-col>
            <v-col cols="3" class="pb-0">
              <v-icon class="float-right mt-1" @click="Close" size="32"
                >close</v-icon
              >
            </v-col>
          </v-row>
        </div>
        <div class="scroll pb-10" v-if="resources == ''">
          <v-row class=" pa-3 mb-14" v-if="searchResult.length > 0">
            <LoadingMe
              :isLoading="isLoading"
              :fullPage="false"
              type="loading"
              :myLoading="true"
            />
            <v-col
              sm="12"
              class="py-1"
              cols="12"
              v-for="sr in searchResult"
              :key="sr.id"
            >
              <v-card
                @click="Detial(sr)"
                elevation="0"
                color="white"
                class="pa-3"
              >
                <v-row>
                  <v-col sm="3" cols="12" class="py-2 pr-0">
                    <img class="res_img" :src="sr.image" />
                  </v-col>
                  <v-col sm="9" cols="12" class="py-2">
                    <h3 class="mb-1">
                      {{ lang == "en" ? sr.title : sr.title_kh }}
                    </h3>
                    <p class="mb-0 line_18">
                      {{ lang == "en" ? sr.feature : sr.feature_kh }}
                    </p>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          <v-row class=" pa-3" v-else>
            <v-col sm="12" class="py-1" cols="12">
              <v-card
                @click="Detial(sr)"
                elevation="0"
                color="white"
                class="pa-3"
              >
                <v-row>
                  <v-col sm="9" cols="12" class="py-2">
                    <h3 class="mb-1">Not Found!</h3>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </div>
        <div v-else class="pa-3 scroll pb-15">
          <v-icon @click="submitSearch" class="black--text" size="20"
            >mdi-arrow-left</v-icon
          >
          <h3 class="mt-2 font_20 mb-1">
            {{ lang == "en" ? resources.title : resources.title_kh }}
          </h3>
          <v-divider />
          <div
            class="pb-15 mt-2"
            v-html="lang == 'en' ? resources.content : resources.content_kh"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { i18n } from "@/i18n";
import { data, dataStore } from "@/observable/store";
import { Search } from "@/scripts/resources/resourceHandle";
import { getOneCompany } from "@/scripts/instituteHandler";
const store = require("@/institute.js");
const { instituteId } = store.default.state.cookies;
export default {
  name: "RoureceDetial",
  components: {
    LoadingMe: () => import(`@/components/Loading`),
  },
  data: () => ({
    // show: data.show
    keyword: "",
    search: "",
    searchResult: [],
    isLoading: false,
  }),
  computed: {
    show() {
      if (data.show == true) {
        this.submitSearch();
      }
      return data.show;
    },
    key() {
      return data.keyword;
    },
    resources() {
      return data.resources;
    },
    lang() {
      return i18n.locale;
    },
  },
  // watch:{
  //     show(){
  //         window.console.log("keyword",dat.keyword)
  //         this.submitSearch();
  //     }
  // },
  methods: {
    Close() {
      data.show = false;
      data.resources = "";
    },
    Detial(item) {
      data.resources = item;
    },
    submitSearch() {
      let vm = this;
      data.resources = "";
      this.isLoading = true;
      Search(this.keyword).then((res) => {
        if (res.status == "SUCCESS") {
          vm.searchResult = res.data.Items;
          vm.isLoading = false;
        }
      });
    },
    getStoreCompapany() {
      getOneCompany(instituteId).then((res) => {
        dataStore.company = res;
      });
    },
  },
  watch: {
    key() {
      this.keyword = data.keyword;
    },
  },
  mounted() {
    this.getStoreCompapany();
  },
};
</script>
<style scoped>
.headerbox {
  background: #fff;
  height: 65px;
  top: 0px;
  left: 0px;
  right: 0px;
}
.box_resource {
  border: 1px solid #e5e5e5;
  position: fixed;
  height: 550px;
  width: 350px;
  box-shadow: 17px -2px 114px -60px rgb(0 0 0 / 75%);
  background: #f8f8f9;
  bottom: 0px;
  right: 0px;
}
.scroll {
  height: 80vh;
  overflow-y: scroll;
  position: relative;
}
.res_img {
  margin: auto;
  display: block;
  width: 100%;
}
.scroll::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px #dfdfdf;
  /* border-radius: 14px; */
  background-color: #ffffff;
}

.scroll::-webkit-scrollbar {
  height: 10px;
  width: 10px;
  background-color: #9f9f9f;
}

.scroll::-webkit-scrollbar-thumb {
  /* border-radius: 6px; */
  /* -webkit-box-shadow: inset 0 0 6px rgb(0 0 0 / 30%); */
  background-color: #cecece;
}
</style>
