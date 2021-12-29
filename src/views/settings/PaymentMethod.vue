<template>
    <v-row class="">
        <v-col sm="12" cols="12" class="pt-0">
            <h2 class="mb-0">{{$t('payment_method')}}</h2>
            <v-dialog v-model="dialogm2" max-width="380px">
                <template v-slot:activator="{ on }">
                    <v-btn color="primary" class="rounded-pill text-capitalize white--text float-right" v-on="on" @click="onNewClick">
                        {{$t('create_new')}}
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title>{{$t('payment_method')}}</v-card-title>
                    <v-icon class="btn_close" @click="dialogm2 = false">close</v-icon>
                    <v-divider/>
                    <v-card-text style="height: 380px; background-color: #EDF1F5; color: #333;">
                        <v-row>
                            <v-col sm="12" cols="12" class="">
                                <label class="label">{{$t('payment_method_code')}}</label>
                                <p class="text_tip">{{$t('payment_method_code_desc')}}</p>
                                <v-text-field class="mt-1"
                                              outlined
                                              placeholder=""
                                              tage="Payment Method Code"
                                              v-model="paymentMethod.code"/>

                                <label class="label">{{$t('payment_method_name')}}</label>
                                <p class="text_tip">{{$t('payment_method_name_desc')}}</p>
                                <v-text-field class="mt-1"
                                              outlined
                                              placeholder=""
                                              tage="Payment Method Name"
                                              v-model="paymentMethod.name"/>

                                <label class="label">{{$t('default_account')}}</label>
                                <p class="text_tip">{{$t('default_account_desc1')}}</p>
                                <v-select class="mt-1"
                                          id="acc_type_selector"
                                          :items="accountTypes"
                                          item-text="name"
                                          item-value="uuid"
                                          v-model="accountType"
                                          tage="Default Account"
                                          outlined
                                          return-object/>

                                <v-checkbox class="ma-0 "
                                            label="This is a digital based payment method"
                                            v-model="paymentMethod.digital"/>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-divider/>
                    <v-card-actions class="pa-5">
                        <v-row>
                            <v-col sm="6" cols="6" class="py-0 text-left">
                                <v-btn
                                        color="black"
                                        outlined
                                        class=" text-capitalize rounded-pill black--text float-left"
                                        @click="dialogm2 = false"
                                >{{ $t("cancel") }}
                                </v-btn
                                >
                            </v-col>
                            <v-col sm="6" cols="6" class="py-0 text-right">
                                <v-btn
                                        color="primary"
                                        class="px-3 rounded-pill white--text text-capitalize"
                                        @click.native="OnSaveClick(false,option)"
                                >{{ $t("save_close") }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <p class="mb-0">
                {{$t('bank_transaction_rules_desc')}}
            </p>
        </v-col>

        <v-col sm="12" cols="12">
            <template>
                <v-simple-table class="exchange-table">
                    <template v-slot:default>
                        <thead>
                        <tr>
                            <th class="text-uppercase">{{$t('code')}}</th>
                            <th class="text-uppercase">{{$t('name')}}</th>
                            <th class="text-uppercase">{{$t('digital')}}</th>
                            <th class="text-uppercase">{{$t('account')}}</th>
                            <th class="text-uppercase">{{$t('action')}}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="payment in paymentOptions" v-bind:key="payment.id">
                            <td class="">{{payment.code}}</td>
                            <td class="text-bold">{{payment.name}}</td>
                            <td class="">
                                <div v-if="payment.digital==1">
                                    <i class="fa fa-check" aria-hidden="true"></i>
                                </div>
                            </td>
                            <td class="">{{payment.account.name}}</td>

                            <td>
                                <v-btn class="btn_edit_setting" @click="onEditClick(payment)">
                                    <v-icon class="white--text" size="14">mdi-pen</v-icon>
                                    <span class="capitalize ml-1 white--text font_14">{{$t('edit')}}</span>
                                </v-btn>
                            </td>
                        </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </template>
        </v-col>
    </v-row>
</template>

<script>
    const axios = require('axios')
    const apiUrl = require('../../apiUrl.js')
    // const store = require("../../institute.js")
    // const accountGroup = require("../../scripts/model/AcountGroup")
    // const institute_id = store.default.state.cookies.instituteId
    import {i18n} from '@/i18n'

    export default {
        components: {},
        data: () => ({
            dialogm1: '',
            dialogm2: false,
            compeletLoading: true,
            isFullpage: false,
            snackbar: false,
            textStatus: 'Success',
            color: '#3DA72E',
            timeout: 6000,
            x: 'right',
            y: 'top',
            accountTypes: [],
            accountType: {
                name: '',
                nature: '',
                statement_group: '',
                number: 0,
            },
            paymentOptions: [],
            paymentMethod: {
                id: '',
                code: '',
                name: '',
                account: [],
                type: 'pmd',
                digital: 0
            },
            headers: [
                {
                    text: i18n.t('name'),
                    align: 'start',
                    sortable: false,
                    value: 'name',
                },
                {text: i18n.t('description'), value: 'description', sortable: false,},
                {text: i18n.t('account_type'), value: 'account_type', sortable: false, align: ' d-none'},
                {text: i18n.t('account_type'), value: 'account_type.name', sortable: false,},
                {text: i18n.t('action'), value: 'actions', sortable: false},
            ],
            option: 1
        }),
        props: {},
        computed: {},
        watch: {
            dialogm2(val) {
                val || this.close()
            },
        },
        created() {
        },
        methods: {
            async onEditClick(value) {
                new Promise(resolve => {
                    setTimeout(() => {
                        resolve('resolved');
                        this.paymentMethod = value
                        this.accountType = value.account
                        this.dialogm2 = true
                        this.option = 2
                    }, 300);
                })
            },
            onNewClick() {
                this.option = 1
                this.clear()
            },
            OnSaveClick(isNew, option) {
                //eslint-disable-next-line no-console
                let self = this
                let url, method = ''
                if (option === 1) { // Create
                    url = apiUrl.wcap_setting_post
                    method = 'post'
                } else if (option === 2) { // Update
                    url = apiUrl.wcap_setting_put + self.paymentMethod.id
                    method = 'put'
                }

                let data = {
                    code: self.paymentMethod.code,
                    name: self.paymentMethod.name,
                    type: 'pmd',
                    account: self.accountType,
                    digital: self.paymentMethod.digital === undefined ? 0 : self.paymentMethod.digital
                }
                window.console.log(method, option)
                axios({
                    method: method,
                    url: url,
                    data: data
                }).then(function (response) {
                    if (response.status === 200) {
                        self.snackbar = true
                        self.textStatus = "Success"
                        self.color = "#3DA72E"
                        if (isNew === false) {
                            // clear form
                            self.loadPayment('pmd')
                            self.dialogm2 = false
                            self.clear()
                        }
                    }
                }).catch(function (error) {
                    self.snackbar = true
                    self.textStatus = "Failed"
                    self.color = "#EF5350"
                    //eslint-disable-next-line no-console
                    console.log(error)
                });
            },
            close() {
                this.dialogm2 = false
            },
            clear() {
                this.accountType = []
                this.paymentMethod = []
            },
            async loadAccountTypes() {
                new Promise(resolve => {
                    setTimeout(() => {
                        resolve('resolved')
                        axios.get(apiUrl.accounts)
                            .then(res => {
                                this.accountTypes = res.data
                            })
                    }, 300)
                })
            },
            async loadPayment(type) {
                new Promise(resolve => {
                    setTimeout(() => {
                        resolve('resolved')
                        axios.get(apiUrl.wcap_setting_get + type)
                            .then(res => {
                                this.paymentOptions = res.data.data
                            })
                    }, 300)
                })
            },
        },
        mounted: async function () {
            this.loadAccountTypes()
            this.loadPayment('pmd')
        }
    };
</script>
<style scoped>
    .acc_group header {
        height: 10px !important;
    }

    table.acc_group tr td {
        border-bottom: 1px solid #ccc;
        padding: 8px;
        vertical-align: middle;
    }

    table.acc_group tr td:first-child {
        font-weight: 700;
    }

    table.acc_group tr td:last-child {
        text-align: center;
    }

    .v-card__actions .v-btn.v-btn {
        padding: 0 16px;
    }

    .exchange-table.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
        font-family: 'Krasar-Bold', serif;
        color: #000 !important;
        border-top: 1px solid #000 !important;
        border-bottom: 1px solid #000 !important;
        font-size: 15px !important;
    }

    .exchange-table.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > td {
        color: #000 !important;
        padding: 5px !important;
    }

    .exchange-table.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr:last-child td {
        border-bottom: 1px solid #000 !important;
    }

    .function_footer {
        padding: 15px;
        display: inline-block;
    }

    @media (max-width: 576px) {

    }
</style>