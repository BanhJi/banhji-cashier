<template>
    <v-row class="">
        <!-- not modal -->
        <v-col sm="12" cols="12" class="grayBg px-6">
            <!-- <h2 class="font_20">{{$t('sale_form_content')}}</h2>
            <p class="mb-0">{{ $t('sale_form_content_desc') }} </p> -->
            <template>
                <v-simple-table class="attachment_table">
                    <template>
                        <tbody>
                        <tr>
                            <td class="text-bold">{{ $t('default_last_reference_no') }}</td>
                            <td style=""  class="primary--text align-center justify-center d-flex text-bold">
                                <v-text-field
                                    label="message"
                                    v-model="s.lastRefNum"
                                    hide-details="auto"
                                ></v-text-field>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-bold">{{ $t('default_search_option') }}</td>
                            <td style=""  class="primary--text align-center justify-center d-flex text-bold">
                                <v-select class="mt-1"
                                          v-model="s.searchOption"
                                          :items="searchOptions"
                                          :placeholder="$t('search')"
                                          outlined>
                                </v-select>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-bold">{{ $t('default_payment_option') }}</td>
                            <td style=""  class="primary--text align-center justify-center d-flex text-bold">
                                <v-select class="mt-1"
                                          v-model="s.paymentOption"
                                          :items="paymentOptions"
                                          item-text="name"
                                          return-object
                                          :placeholder="$t('search')"
                                          outlined>
                                </v-select>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-bold">{{ $t('default_message_on_receipt_journal') }}</td>
                            <td style=""  class="primary--text align-center justify-center d-flex text-bold">
                                <v-text-field
                                    label="message"
                                    v-model="s.msgJournal"
                                    hide-details="auto"
                                    ></v-text-field>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-bold">{{ $t('segment') }}</td>
                            <td style=""  class="primary--text align-center justify-center d-flex text-bold">
                                <v-select class="mt-1"
                                          v-model="s.segment"
                                          :items="segments"
                                          item-text="name"
                                          item-value="id"
                                          :placeholder="$t('search')"
                                          outlined>
                                </v-select>
                            </td>
                        </tr>
<!--                        <tr>-->
<!--                            <td class="text-bold">{{ $t('default_receipt_form') }}</td>-->
<!--                            <td style=""  class="primary&#45;&#45;text align-center justify-center d-flex text-bold">-->
<!--                                <v-select class="w_100"-->
<!--                                    :label="$t('select')"-->
<!--                                    color="primary"-->
<!--                                />-->
<!--                            </td>-->
<!--                        </tr>-->
<!--                        <tr>-->
<!--                            <td class="text-bold">{{ $t('default_reconciliation_report_rorm') }}</td>-->
<!--                            <td style=""  class="primary&#45;&#45;text align-center justify-center d-flex text-bold">-->
<!--                                <v-select class="w_100"-->
<!--                                    :label="$t('select')"-->
<!--                                    color="primary"-->
<!--                                />-->
<!--                            </td>-->
<!--                        </tr>-->
                        </tbody>
                    </template>
                </v-simple-table>
            </template>
            <v-divider/>

            <v-card outlined dense class="no_border function_footer">
                <v-btn color="primary" class="float-right white--text" @click="onSaveClose">
                    {{ $t('save') }}
                </v-btn>

            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import SettingModel from "@/scripts/session/model/Setting";
const sessionHandler = require("@/scripts/session/handler/sessionHandler")
const paymentOptionHandler = require("@/scripts/paymentOptionHandler")
const OPTION_TYPE = 'Customer'
const strFilter = '?optionType=' + OPTION_TYPE
const cookieJS = require("@/cookie.js");
const cookie = cookieJS.getCookie();
const settingsHandler = require("@/scripts/settingsHandler");
export default {
    components: {},
    data: () => ({
        quotes: ['Quote', 'Proposal', 'Estimate'],
        saleOrders: ['Sale Order', 'Engagement', 'Contract'],
        decimalStyle: [2, 3, 4, 5],
        searchOptions: ['Invoice', 'CRN', 'Payment Code', 'Customer'],
        paymentOptions: [],
        s: new SettingModel({}),
        segments: [],
    }),
    methods: {
        async onSaveClose() {
            window.console.log(this.s, 'setting')
            this.s.user = cookie
            sessionHandler.cashierSettingCreate(new SettingModel(this.s)).then(response => {
                if (response.data.statusCode === 201) {
                    window.console.log(response,'response')
                    this.loadSetting()
                    this.$snotify.success('Update Successfully')
                }
            }).catch(e => {
                this.$snotify.error('Something went wrong')
                this.errors.push(e)
            })
        },
        async loadSetting() {
            sessionHandler.cashierSetting().then(res => {
                if (res.data.statusCode === 200) {
                    const data = res.data.data.filter((obj) => {return obj.user.email == cookie.email})
                    window.console.log(data, 'setting', res)
                    if (data.length > 0) {
                        this.s = data[0]
                    }
                }
            })
        },
        async loadPaymentOption() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved')
                    this.paymentOptions = []
                    paymentOptionHandler.list(strFilter).then(res => {
                        if (res.data.statusCode === 200) {
                            this.showLoading = false
                            this.paymentOptions = res.data.data
                        }
                    }).catch()
                    {
                        this.showLoading = false
                    }
                }, 10)
            })
        },
        loadSegment() {
            settingsHandler.getSeg().then((res) => {
                if (res.data.statusCode === 200) {
                    this.segments = res.data.data
                    window.console.log(this.segments)
                }
            })
        },
    },
    mounted: async function () {
        await this.loadPaymentOption()
        await this.loadSetting()
        await this.loadSegment();
    }
}
;
</script>
<style scoped>
.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:first-child > td:not(.v-data-table__mobile-row) {
    border-top: 3px solid rgba(0, 0, 0, 0.12) !important;
}

.btn_save {
    color: #ffffff;
    text-transform: capitalize;
}
.w_100{
    width: 100px !important;
}

.float-right {
    margin-top: 0px !important;
}

.float-left {
    margin-top: 0px !important;

}

.v-input--switch {
    margin-top: 0px;
    height: 30px;
}



</style>