<template>
    <v-row>
        <v-col class="pt-3" sm="4" cols="12">
            <v-card outlined dense color="grayBg" class="pa-3 no_border mb-3" height="122px">
                <v-text-field outlined
                              :placeholder="$t('name')"
                              append-icon="search"
                              v-model="search"
                              @change="onCategoryChanged"
                              clearable/>
                <v-select tage="Product Category"
                          v-model="mCategory"
                          :items="categories"
                          item-value="id"
                          :item-text="item =>`${item.abbr} - ${item.name}`"
                          @change="onCategoryChanged"
                          return-object
                          :placeholder="$t('category')"
                          outlined/>
            </v-card>
            <v-card outlined dense color="grayBg" class="pa-3  no_border">
                <!-- loading -->
                <div v-if="isLoaded">
                    <LoadingMe
                        :isLoading="showLoading"
                        :fullPage="false"
                        type="loading"
                        :myLoading="true"/>
                </div>
                <v-card outlined dense class="no_border">
                    <!-- loading -->
                    <div v-if="!isLoaded">
                        <LoadingMe
                            :isLoading="showLoading"
                            :fullPage="false"
                            type="loading"
                            :myLoading="true"/>
                    </div>
                    <kendo-datasource ref="productDS"
                                      :data="variants" :schema="gridSchema">
                    </kendo-datasource>
                    <kendo-grid id="gridProduct" class="grid-center center_heigth"
                                :change="onChanged"
                                :data-source-ref="'productDS'"
                                :selectable="true"
                                :persistSelection="true"
                                :noRecords="true"
                                :scrollable="true"
                                :navigatable="true"
                                :height="535"
                                :pageable-numeric="false"
                                :pageable-previous-next="false"
                                :pageable-messages-display="'Showing {2} data items'">
                        <kendo-grid-column
                            :field="'name'"
                            :attributes="{class:'tb_name_td'}"
                            :title="'Name'"
                            :group-header-template="'#=value#'"/>
                    </kendo-grid>
                </v-card>
            </v-card>
        </v-col>
        <v-col sm="8" cols="12" class="pt-3 px-0">
            <v-tabs>
                <v-tab>
                    <span class=" text-uppercase">{{ $t('info') }}</span>
                </v-tab>
                <v-tab>
                    <span class=" text-uppercase">{{ $t('txn_') }}</span>
                </v-tab>
                <v-tab>
                    <span class=" text-uppercase">{{ $t('uom') }}</span>
                </v-tab>
                <v-tab>

                    <span class="text-uppercase">{{ $t('price') }}</span>
                </v-tab>
                <v-tab>
                    <span class=" text-uppercase">{{ $t('image') }}</span>
                </v-tab>
                <v-tab-item>
                    <v-row>
                        <v-col sm="12" cols="12" class="pt-0 pl-3">
                            <v-row class="grayBg">
                                <v-col sm="12" cols="12" class="">
                                    <v-card outlined color="white" class="pa-3">
                                        <Info :product="info" @onUpdate="callback"/>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-tab-item>
                <v-tab-item>
                    <v-row>
                        <v-col sm="12" cols="12" class="pt-0 pl-3">
                            <v-row class="grayBg">
                                <v-col sm="12" cols="12" class="">
                                    <v-card outlined color="white" class="pa-3">
                                        <Transactions :item="info" @onUpdate="callback"/>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-tab-item>
                <v-tab-item>
                    <v-row>
                        <v-col sm="12" cols="12" class="pt-0 pl-3">
                            <v-row class="grayBg">
                                <v-col sm="12" cols="12" class="">
                                    <v-card outlined color="white" class="pa-3">
                                        <Uom :product="info"/>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-tab-item>
                <v-tab-item>
                    <v-row>
                        <v-col sm="12" cols="12" class="pt-0 pl-3">
                            <v-row class="grayBg">
                                <v-col sm="12" cols="12" class="">
                                    <v-card outlined color="white" class="pa-3">
                                        <Price :product="info"/>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-tab-item>
                <!--        <v-tab-item>-->
                <!--          <v-row>-->
                <!--            <v-col sm="12" cols="12" class="pt-0 pl-3">-->
                <!--              <v-row class="grayBg">-->
                <!--                <v-col sm="12" cols="12" class="">-->
                <!--                  <v-card outlined color="white" class="pa-3">-->
                <!--                    <Cost/>-->
                <!--                  </v-card>-->
                <!--                </v-col>-->
                <!--              </v-row>-->
                <!--            </v-col>-->
                <!--          </v-row>-->
                <!--        </v-tab-item>-->
                <v-tab-item>
                    <v-row>
                        <v-col sm="12" cols="12" class="pt-0 pl-3">
                            <v-row class="grayBg">
                                <v-col sm="12" cols="12" class="">
                                    <v-card outlined color="white" class="pa-3">
                                        <Images :product="info" @onUpdate="callback"/>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-tab-item>
            </v-tabs>
        </v-col>

    </v-row>
</template>

<script>
// import ProductModel from "@/scripts/model/Products"

import kendo from "@progress/kendo-ui";

const $ = require("jquery")
const productHandler = require("@/scripts/productHandler")
const categoryHandler = require("@/scripts/categoryHandler")
// let productModel = new ProductModel({})
import {dataStore} from '@/observable/store'
const loanHandler = require("@/scripts/loanHandler")

export default {
    name: "Product",
    props: ['product'],
    components: {
        Images: () => import(`./Images`),
        // Cost: () => import(`./Cost`),
        Uom: () => import(`./Uom`),
        Info: () => import(`./Info`),
        Transactions: () => import(`./Transactions`),
        Price: () => import(`./Price`),
        LoadingMe: () => import(`@/components/Loading`)
    },
    data: () => ({
        variants: [],
        isLoaded: true,
        showLoading: false,
        info: {},
        mCategory: '',
        categories: [],
        search: '',
        gridSchema: {
            model: {
                id: "id"
            }
        },
        businessCategory: []
    }),
    watch: {},
    methods: {
        // Pass value to other component
        async productInfo() {
            this.$emit('onUpdate', this.product)
        },
        async onChanged() {
            let grid = kendo.jQuery("#gridProduct").data("kendoGrid")
            let selectedItem = grid.dataItem(grid.select())
            this.info = selectedItem

            this.$emit('onUpdate', selectedItem)
            // window.console.log(selectedItem['images'])
        },
        async loadProducts() {
            this.isLoaded = true
            this.showLoading = true
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved');
                    productHandler.get().then(res => {
                        this.showLoading = false
                        this.variants = res
                    })
                }, 50);
            })
        },
        async onCategoryChanged() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved');
                    if (this.mCategory) {
                        const cateId = this.mCategory.id || ''
                        if (cateId) {
                            this.isLoaded = true
                            this.showLoading = true
                            productHandler.filter(this.mCategory.id, this.search).then(res => {
                                this.showLoading = false
                                this.variants = res
                                // window.console.log(res)
                            })
                        }
                    }
                }, 50);
            })
        },
        async loadCategory() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved');
                    categoryHandler.get().then(res => {
                        this.showLoading = false
                        let self = this;
                        this.categories = []
                        let categories = res.filter(m => m.hasOwnProperty('type') && m.type.name === 'Product')
                        window.console.log(categories, this.businessCategory, 'categ')
                        if (categories.length > 0) {
                            $.each(categories, function(i,v){
                                if($.inArray(v.id, self.businessCategory) != -1) {
                                    self.categories.push(v)
                                }
                            })
                            if(this.categories.length > 0) {
                                this.mCategory = this.categories[0]
                                this.onCategoryChanged()
                            }
                        }
                    })
                }, 10);
            })
        },
        callback(variant) {
            const index = this.variants.findIndex(item => {
                return (variant.id === item.id)
            })
            if (index < 0) {
                this.variants.push(variant)
            } else {
                this.variants.splice(index, 1, variant)
            }
        },
        async loadSegment() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved')
                    // this.segment = {}
                    loanHandler.businessSettingGet().then(res => {
                        this.showLoading = true
                        if (res.data.statusCode === 200) {
                            this.showLoading = false
                            let s = res.data.data.filter((obj) => {
                                return obj.type == dataStore.businessType
                            })
                            if (s.length > 0) {
                                // this.segments.push(s[0].segment)
                                // this.invoice.segment = s[0].segment
                                this.businessCategory = []
                                if (s[0].productCategories.length > 0) {
                                    let self = this
                                    $.each(s[0].productCategories, function (i, v) {
                                        self.businessCategory.push(v.category.id)
                                    })
                                }
                                if (s[0].serviceCategories.length > 0) {
                                    let self = this
                                    $.each(s[0].serviceCategories, function (i, v) {
                                        self.businessCategory.push(v.category.id)
                                    })
                                }
                                this.loadCategory()
                            } else {
                                this.$snotify.error('Please select segment on setting page')
                                this.cancel()
                            }
                        }
                    }).catch()
                    {
                        this.showLoading = false
                    }
                }, 300)
            })
        },
    },
    mounted: async function () {
        await this.loadSegment()
    },
    created: async function() {
        // await this.loadSegment()
    }
};
</script>
<style scoped>
.v-tab {
    justify-content: left;
}

.v-tab--active {
    background-color: rgb(255, 255, 255);
}

.v-menu__content {
    top: 141px !important;
    left: 1098px !important;
}

.v-menu__content .v-list .v-list-item {
    min-height: 35px !important;
}

.tab_wrapper {
    position: relative;
    display: inherit;
}

.v-tab {
    min-width: 30px;
    font-size: 15px;
    text-transform: capitalize;
}

.v-icon--left {
    margin-right: 0px;
}

.Light_grey {
    background-color: #F8F8F9 !important;
}

.theme--light.v-tabs >>> .v-tabs-bar {
    border-bottom: none !important;
}

.v-tabs-bar {
    border-bottom: none !important;
}

.v-card__text {
    padding: 0 !important;
}

.v-window-item--active {
    padding-left: 12px !important;
    padding-right: 12px !important;
}

.grayBg {
    background-color: #F8F8F9;
}

.v-tab--active {
    background-color: #E5EFFA;
    color: #000;
}

@media (max-width: 576px) {
    .v-tab {
        min-width: auto !important;
    }

    .paddingLeft {
        margin-left: 15px;
    }
}

</style>