<template>
  <v-row class="px-0">
    <v-col sm="4" cols="12" class="grayBg">
      <v-card outlined dense class="pa-3 no_border" color="white" height="100%">
        <v-select class=""
                  tage="Product Category"
                  v-model="mCategory"
                  :items="categories"
                  item-value="id"
                  :item-text="item =>`${item.abbr} - ${item.name}`"
                  @change="onCategoryChanged"
                  return-object
                  :placeholder="$t('category')"
                  clearable
                  outlined/>

        <v-select class=""
                  tage="Product Group"
                  v-model="mGroup"
                  :items="group"
                  item-value="id"
                  :item-text="item =>`${item.abbr} - ${item.name}`"
                  @change="onGroupChanged"
                  return-object
                  :placeholder="$t('group')"
                  clearable
                  outlined/>

        <v-select class=""
                  tage="Sub Group"
                  v-model="mSubGroup"
                  :items="subGroup"
                  item-value="id"
                  :item-text="item =>`${item.abbr} - ${item.name}`"
                  @change="onSubGroupChanged"
                  return-object
                  :placeholder="$t('sub_group')"
                  clearable
                  outlined/>
      </v-card>
    </v-col>
    <v-col sm="8" cols="12" class="pl-0 grayBg">
      <v-card outlined dense class="pa-3 no_border" color="white">
        <LoadingMe :isLoading="showLoading" :fullPage="false" :myLoading="true"/>
        <template>

          <kendo-listview :data-source="catalogData" :template="itemTemplate"
                          id="lstCatalog">
          </kendo-listview>

        </template>
      </v-card>
      <!--            <kendo-pager :data-source="catalogData"></kendo-pager>-->
    </v-col>

  </v-row>
</template>
<script>
// import kendo from "@progress/kendo-ui";

import kendo from "@progress/kendo-ui";

// const $ = require("jquery")
const categoryHandler = require("@/scripts/categoryHandler")
const groupHandler = require("@/scripts/groupHandler")
const subGroupHandler = require("@/scripts/subGroupHandler")
const productVariantHandler = require("@/scripts/productVariantHandler")
import {ListView} from '@progress/kendo-listview-vue-wrapper'
// import {DataSource} from '@progress/kendo-datasource-vue-wrapper'

export default {
  name: "Catalog",
  components: {
    LoadingMe: () => import(`@/components/Loading`),
    'kendo-listview': ListView,
    // 'kendo-pager': Pager,
    // 'kendo-datasource': DataSource
  },
  data() {
    return {
      url: '',
      showLoading: false,
      categories: [],
      groups: [],
      group: [],
      subGroups: [],
      subGroup: [],
      varLists: [],
      mCategory: {},
      mSubGroup: {},
      mGroup: {},
      mGroups: {},
      catalogData: [],
      itemTemplate: `
                <div class="product">
                    <img  src=#=imgUrl# alt="#: name #" />
                    <h3 style="font-size: 12px; margin-bottom: 5px">#:name#</h3>
                    <p>#:sku#</p>
                </div>`
    }
  },
  methods: {
    onGroupChanged() {
      if (this.mGroup) {
        // this.loadData(this.mGroup.id)
      }
    },
    onSubGroupChanged() {
      if (this.mSubGroup) {
        // this.loadData(this.mSubGroup.id)
      }
    },
    async onCategoryChanged() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
          this.mGroup = ''
          this.mSubGroup = ''

          if (this.mCategory) {
            if (this.groups) {
              this.showLoading = true
              this.group = this.groups.filter(m => m.category.id === this.mCategory.id)
              this.showLoading = false
              if (this.group.length > 0) {
                this.mGroup = this.group[0]
                this.subGroup = this.subGroups.filter(m => m.group.id === this.group[0].id)
                if (this.subGroup.length > 0) {
                  this.mSubGroup = this.subGroup[0]
                  this.loadData(this.mSubGroup.id)
                } else {
                  this.loadData(this.mGroup.id)
                }
              } else {
                this.loadData(this.mCategory.id)
                this.showLoading = false
              }
            }
          }
        }, 10);
      })
    },
    async loadCategory() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
          categoryHandler.get().then(res => {
            this.categories = res
            this.categories = this.categories.filter(m => m.type.name === 'Product')
            if (this.categories.length > 0) {
              this.mCategory = this.categories[0]
              this.onCategoryChanged()
            }
          })
        }, 10);
      })
    },
    async loadGroup() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
          groupHandler.get().then(res => {
            this.groups = res
          })
        }, 10);
      })
    },
    async loadSubGroup() {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
          subGroupHandler.get().then(res => {
            this.subGroups = res
          })
        }, 10);
      })
    },
    async loadData(id) {
      new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
          this.catalogData = []
          this.catalogData = new kendo.data.DataSource({
            serverFiltering: true,
            transport: {
              read: {
                url: productVariantHandler.url(id),
              },
              dataType: "json",
            },
            schema: {
              model: {
                id: "id"
              },
              data: function (res) {
                return res.data;
              },
              total: function (res) {
                return res.data.length;
              }
            },
          })
        }, 10);
      })
    },
  },
  mounted: async function () {
    await this.loadCategory()
    await this.loadGroup()
    await this.loadSubGroup()
    // this.$refs.datasource1.kendoDataSource.read();
  },
  created: async function () {

  },

}
</script>
<style>
.catalog {
  width: 100%;
}

#listView {
  padding: 10px 5px;
  margin-bottom: -1px;
  min-height: 300px;
}

.product {
  float: left;
  position: relative;
  width: 110px;
  height: 180px;
  margin: 0 5px;
  padding: 0;
}

.product img {
  width: 110px;
  height: 110px;
}

.product h3 {
  margin: 0;
  padding: 3px 5px 0 0;
  max-width: 96px;
  overflow: hidden;
  line-height: 1.1em;
  font-size: .9em;
  font-weight: normal;
  text-transform: uppercase;
  color: #999;
}

.product p {
  visibility: hidden;
}

.product:hover p {
  visibility: visible;
  position: absolute;
  width: 110px;
  height: 110px;
  top: 0;
  margin: 0;
  padding: 0;
  line-height: 110px;
  vertical-align: middle;
  text-align: center;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.75);
  transition: background .2s linear, color .2s linear;
  -moz-transition: background .2s linear, color .2s linear;
  -webkit-transition: background .2s linear, color .2s linear;
  -o-transition: background .2s linear, color .2s linear;
}

.k-listview:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}


</style>