<template>
    <v-row>
        <v-col sm="12" cols="12">
            <v-row>
                <v-col sm="3" cols="12" class="py-0">
                    <v-card>
                        <!--            <v-img class="" height="100" width="100" :src="require(`@/assets/images/${pic}`)"/>-->
                        <v-img style="margin: auto;display: block;"
                               :src="imgURL"/>
                    </v-card>
                </v-col>
                <v-col sm="9" cols="12" class="py-0">
                    <v-simple-table>
                        <template v-slot:default>
                            <tbody>
                            <tr>
                                <td class="text-uppercase">{{ $t('name') }}</td>
                                <td class="text-left text-bold">{{ product.name }}</td>
                            </tr>
                            <tr>
                                <td class="text-uppercase">{{ $t('sku') }}</td>
                                <td class="text-left text-bold">{{ product.sku }}</td>
                            </tr>
                            <tr>
                                <td class="text-uppercase">{{ $t('uom') }}</td>
                                <div v-if="product.uom!==undefined">
                                    <td class="text-left text-bold">{{ itemUOM }}</td>
                                </div>
                            </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-col>
            </v-row>
        </v-col>

        <v-col sm="12" cols="12" class="pb-0">
            <LoadingMe
                :isLoading="showLoading"
                :fullPage="false"
                type="loading"
                :myLoading="true"/>
            <v-simple-table>
                <template v-slot:default>
                    <tbody>
                    <tr class="third text-bold">
                        <td class="text-uppercase  white--text">{{ $t('weighted_average_cost') }}</td>
                        <td class="white--text text-right">{{ wac }}</td>
                    </tr>
                    <tr class="third text-bold">
                        <td class="text-uppercase  white--text">{{ $t('last_purchase_cost') }}</td>
                        <td class="white--text text-right">{{ itemCost }}</td>
                    </tr>
                    <tr>
                        <td class="text-uppercase text-bold">{{ $t('value') }}</td>
                        <td class="primary--text text-right text-bold">{{ balance }}</td>
                    </tr>
                    <tr>
                        <td class="text-uppercase">{{ $t('on_hand') }}</td>
                        <td class="primary--text text-right text-bold">{{ qoh }}</td>
                    </tr>
                    <!-- <tr>
                        <td class="text-uppercase">{{ $t('committed_stock') }}</td>
                        <td class="primary--text text-right text-bold">0</td>
                    </tr>
                    <tr>
                        <td class="text-uppercase">{{ $t('available_stock') }}</td>
                        <td class="primary--text text-right text-bold">92</td>
                    </tr>
                    <tr>
                        <td class="text-uppercase">{{ $t('incoming_stock') }}</td>
                        <td class="primary--text text-right text-bold">0</td>
                    </tr> -->
                    </tbody>
                </template>
            </v-simple-table>
        </v-col>
        <v-col sm="12" cols="12" class="pb-3">
            <v-row>
                <v-col sm="12" cols="12" class="py-0">
                    <!-- <router-link
                        :to="{path: 'product_variant'+`/${this.product.id?this.product.id:''}`, query: { p: `${this.product.productId}` ,type: 'edit'} }">
                      <v-btn width="120" color="primary" :disabled="btnEnabled"
                             class="rounded-pill white--text float-right text-capitalize ml-5">
                        {{ $t('edit_variant') }}
                      </v-btn>
                    </router-link> -->
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>
<script>
import kendo from "@progress/kendo-ui";

const billingHandler = require("@/scripts/invoice/handler/billingHandler")
export default {
    name: "ItemInfo",
    components: {
        LoadingMe: () => import(`@/components/Loading`),
    },
    props: {
        product: {}
    },
    mounted: async function () {
        await this.lastPurchaseCost()
    },
    computed: {
        imgURL() {
            if (this.product.images) {
                let img = this.product.images
                let imgDefault = img.default
                if (imgDefault) {
                    return this.url + imgDefault.thumb
                } else {
                    return ''
                }
            } else {
                return ''
            }
        },
        itemUOM() {
            if (this.product) {
                const uom = this.product.uom
                if (uom.hasOwnProperty('toUOM')) {
                    return uom.toUOM.name || ``
                } else {
                    return uom.name || ``
                }
            } else {
                return ''
            }
        },
        btnEnabled() {
            return !this.product.images;
        },
        id() {
            if (this.product) {
                return this.product.id
            } else {
                return ''
            }
        }
    },
    data: () => ({
        pic: "amret.png",
        url: 'https://s3-ap-southeast-1.amazonaws.com/images.banhji/',
        showLoading: false,
        itemCost: 0,
        balance: 0,
        qoh: 0,
        wac: 0,
        transactionDate: new Date().toISOString().substr(0, 10),
    }),
    watch: {
        // '$route': 'callback',
        product() {
            if (this.product !== undefined) {
                this.showLoading = true
                this.lastPurchaseCost()
                this.inventoryBalance()
                this.callback()
                this.showLoading = false
            }
        }
    },
    methods: {
        numberFormat(value, decimal) {
            return kendo.toString(value, decimal)
        },
        onUpdate() {
            this.$emit('onUpdate', this.product)
        },
        callback() {
            if (this.$route.params !== null && this.$route.params.hasOwnProperty('data')) {
                // this.service = this.$route.params.data
                this.showLoading = true
                this.$emit('onUpdate', this.$route.params.data)
                this.showLoading = false
            }
            // window.console.log('im changed', this.product)
        },
        async lastPurchaseCost() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved')
                    this.showLoading = true
                    const startDate = this.transactionDate
                    let strFilter = '?date=' + startDate + '&id=' + this.id
                    if (this.id !== undefined || this.id !== null) {
                        // strFilter = '?date=' + startDate + '&id=' + this.id
                        strFilter = '?date=' + startDate + '&id=' + this.id + '&item='+ true
                        this.itemCost = 0
                        billingHandler.inventoryItemPurchaseCost(strFilter).then(res => {
                            if (res.data.statusCode === 200) {
                                this.showLoading = false
                                const response = res.data.data
                                this.itemCost = 0
                                if (response) {
                                    if (Object.keys(response).length > 0) {
                                        this.itemCost = this.numberFormat(response.exchangeCost, response.decimalFormat)
                                    }
                                }
                            }
                        })
                    }
                }, 10)
            })
        },
        async inventoryBalance() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved')
                    this.showLoading = true
                    const startDate = new Date().toISOString().substr(0, 10)
                    let strFilter = '?asOf=' + startDate + '&id=' + this.id
                    if (this.id !== undefined || this.id !== null) {
                        // strFilter = '?asOf=' + startDate + '&id=' + this.id
                        strFilter = '?asOf=' + startDate + '&id=' + this.id + '&item=' + true
                        billingHandler.inventoryBalance(strFilter).then(res => {
                            if (res.data.statusCode === 200) {
                                this.showLoading = false
                                const response = res.data.data
                                this.qoh = this.balance = this.wac = 0
                                if (response.length > 0) {
                                    this.qoh = this.numberFormat(response[0].qoh, response[0].decimalFormat)
                                    this.balance = this.numberFormat(response[0].bValue, response[0].decimalFormat)
                                    this.wac = this.numberFormat(response[0].wac, response[0].decimalFormat)
                                }
                            }
                        })
                    }
                }, 10)
            })
        },
    }
}
</script>
<style scoped>
.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    background-color: transparent !important;
}

.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr.third:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    background-color: #4d4848 !important;
}

.theme--light.v-data-table {
    background-color: transparent !important;
    border-top: thin solid #ddd;
    border-bottom: thin solid #ddd;
    border-radius: 0 !important;
}

.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > td:not(.v-data-table__mobile-row),
.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > th:not(.v-data-table__mobile-row) {
    border-bottom: thin solid #ddd;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    height: 32px !important;
}
</style>