<template>
    <v-row>
        <v-col cols="12" sm="12">

            <!-- loading -->
            <LoadingMe
                    :isLoading="compeletLoading"
                    :fullPage="false"
                    :myLoading="true"/>

            <v-row class="report_block">
                <v-col sm="7" cols="12" class="py-0">
                    <v-card outlined dense class="pa-3 no_border" color="whiteGreen" min-height="86px">
                        <v-row>
                            <v-col sm="4" cols="12" class="py-0 border-right" >
                                <p class="text-black mb-0 text-uppercase">{{$t('net_sale')}}</p>
                                <h3 class="text-bold mt-4">$1,000,000</h3>
                            </v-col>
                            <v-col sm="4" cols="12" class="py-0 border-right">
                                <p class="text-black mb-0 text-uppercase">{{$t('cost_of_goods_sold')}}</p>
                                <h3 class="text-bold mt-4">$1,000,000</h3>
                            </v-col>
                            <v-col sm="4" cols="12" class="py-0">
                                <p class=" text-black mb-0 text-uppercase">{{$t('gross_profit')}}</p>
                                <h3 class="text-bold mt-4">$1,000,000</h3>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
                <v-col sm="5" cols="12" class="py-0">
                    <v-card outlined color="white" class="pa-2 no_border" min-height="86px" style=" border: 2px solid #92d050 !important;" >
                        <v-row>
                            <v-col sm="3" cols="12" class="py-0">
                                <p class="mt-3 mb-0 text text-uppercase">{{$t('average_margin')}}</p>
                            </v-col>
                            <v-col sm="3" cols="12" class="py-0">
                                <h2 class="mb-0 mt-3 text-right">40%</h2>
                            </v-col>
                            <v-col sm="3" cols="12" class="py-0">
                                <p class="text-black mb-0 text text-uppercase">{{$t('working_capital_to_sale')}}</p>
                            </v-col>
                            <v-col sm="3" cols="12" class="py-0">
                                <h2 class="mb-0 mt-3 text-right">40%</h2>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>

            <v-row>
                <v-col class="pb-0" cols="">
                    <v-card outlined dense class="pa-3 no_border" color="primary" min-height="88px">
                        <p class="white--text mb-0 text-uppercase">{{$t('total_revenue')}}</p>
                        <h3 class="white--text mt-5 text-right">$1,000,00</h3>
                    </v-card>
                </v-col>
                <v-col class="pb-0" cols="">
                    <v-card outlined dense class="pa-3 no_border" color="primary" min-height="88px">
                        <p class="white--text mb-0 text-uppercase">{{$t('customers')}}</p>
                        <h3 class="white--text mt-5 text-right">$1,000,00</h3>
                    </v-card>
                </v-col>
                <v-col class="pb-0" cols="">
                    <v-card outlined dense class="pa-3 no_border" color="primary" min-height="88px">
                        <p class="white--text mb-0 text-uppercase">{{$t('open_sale_order')}}</p>
                        <h3 class="white--text mt-5 text-right">$1,000,00</h3>
                    </v-card>
                </v-col>
                <v-col class="pb-0" cols="">
                    <v-card outlined dense class="pa-3 no_border" color="primary" min-height="88px">
                        <p class="white--text mb-0 text-uppercase">{{$t('open_quote')}}</p>
                        <h3 class="white--text mt-5 text-right">$1,000,00</h3>
                    </v-card>
                </v-col>
                <v-col class="pb-0" cols="">
                    <v-card outlined dense class="pa-3 no_border" color="third" min-height="88px">
                        <p class="white--text mb-0 text-uppercase">{{$t('required_approved')}}</p>
                        <h3 class="white--text mt-5 text-right">1,000</h3>
                    </v-card>
                </v-col>
            </v-row>

            <v-row class="">
                <v-col sm="4" cols="12" class="py-0">
                    <v-select class="mt-1"
                              :items="dateSorters"
                              @change="onSorterChanges"
                              clearable
                              outlined
                              placeholder="ALL"
                    />
                </v-col>

                <v-col sm="3" cols="12" class="py-0">
                    <app-datepicker :initialDate="start_date" @emitDate="start_date = $event"/>
                </v-col>

                <v-col sm="3" cols="12" class="py-0">
                    <app-datepicker :initialDate="end_date" @emitDate="end_date = $event"/>
                </v-col>

                <v-col sm="1" cols="1" class="">
                    <v-btn class="btn_search" @click="searchTransaction" style="background-color: rgb(237, 241, 245)">
                        <i class="b-search" style="font-size: 18px; color:#fff !important;"/>
                    </v-btn>
                </v-col>
            </v-row>

            <div class="reports_table">
                <template>
                    <v-simple-table class="attachment_table">
                        <template v-slot:default>
                            <thead>
                            <tr>
                                <th>{{$t('date')}}</th>
                                <th>{{$t('name')}}</th>
                                <th>{{$t('type')}}</th>
                                <th>{{$t('reference')}}</th>
                                <th>{{$t('amount')}}</th>
                                <th>{{$t('status')}}</th>
                                <th>{{$t('action')}}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>01</td>
                                <td class="text-bold">ME</td>
                                <td>15/July/2020</td>
                                <td>VARIANCE</td>
                                <td>15/July/2020</td>
                                <td>VARIANCE</td>
                                <td class="text-center">80%</td>
                            </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </template>
            </div>
        </v-col>
    </v-row>
</template>

<script>
    import kendo from '@progress/kendo-ui'
    import {i18n} from '@/i18n'
    import LoadingMe from '@/components/Loading'
    import DatePickerComponent from '@/components/custom_templates/DatePickerComponent'

    // const $ = require("jquery")
    const store = require("@/institute.js")
    const institute = store.default.state.institute
    const accountTypeHandler = require("@/scripts/accountTypeHandler.js")
    const accountHandler = require("@/scripts/handler/accounting/accountHandler.js")
    const journalHandler = require("@/scripts/journalHandler.js")

    export default {
        name: "Cash",
        components: {
            LoadingMe,
            'app-datepicker': DatePickerComponent,
        },
        data: () => ({
            // Search transaction dates
            start_date: "",
            end_date: "",
            dateSorters: ['Today', 'This Week', 'This Month', 'This Year'],
            journal_entries: [],
            // COA sidebar
            searchText: '',
            accounts: [],
            accounts_bk: [],
            account_types: [],
            // Account information
            account: [],
            files: [],
            attachments: [],
            balance: 0,
            backdated: 0,
            forwarded: 0,
            // LoadingMe
            compeletLoading: false,
            isLoaded: false,
            // Kendo dataSource
            schemaDefinition: {
                model: {id: "id"}
            },
            /* Sort by account number */
            sortDefinition: {field: "number"},
            // Group order by account_type_id asc
            groupDefinition: {
                field: "account_type.name",
                compare: function (a, b) {
                    if (a.items[0].number === b.items[0].number) {
                        return 0;
                    } else if (a.items[0].number > b.items[0].number) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
            },
        }),
        methods: {
            /* Date format */
            dateFormat(theDate) {
                return kendo.toString(new Date(theDate), institute.dateFormat)
            },
            // On Sorter Changes
            onSorterChanges(val) {
                let today = new Date()

                switch (val) {
                    case "Today":
                        this.start_date = kendo.toString(today, 'yyyy-MM-dd')
                        this.end_date = kendo.toString(today, 'yyyy-MM-dd')

                        break
                    case "This Week":
                        var first = today.getDate() - today.getDay(),
                            last = first + 6;

                        this.start_date = kendo.toString(new Date(today.setDate(first)), 'yyyy-MM-dd')
                        this.end_date = kendo.toString(new Date(today.setDate(last)), 'yyyy-MM-dd')

                        break
                    case "This Month":
                        this.start_date = kendo.toString(new Date(today.getFullYear(), today.getMonth(), 1), 'yyyy-MM-dd')
                        this.end_date = kendo.toString(new Date(today.getFullYear(), today.getMonth(), 31), 'yyyy-MM-dd')

                        break
                    case "This Year":
                        this.start_date = kendo.toString(new Date(today.getFullYear(), 0, 1), 'yyyy-MM-dd')
                        this.end_date = kendo.toString(new Date(today.getFullYear(), 11, 31), 'yyyy-MM-dd')

                        break
                    default:
                        this.start_date = "";
                        this.end_date = "";
                }
            },
            // Search Transaction
            searchTransaction() {
                let self = this,
                    account = this.account,
                    sdate = this.start_date,
                    edate = this.end_date;

                if (account.id) {
                    if (sdate && edate) {
                        sdate = kendo.toString(new Date(sdate), 'yyyy-MM-dd') + 'T00:00:00.000Z'

                        edate = new Date(edate)
                        edate = kendo.toString(edate, 'yyyy-MM-dd') + 'T23:59:59.999Z'
                    } else {
                        sdate = 0
                        edate = 0
                    }

                    this.isLoaded = true
                    this.compeletLoading = true
                    journalHandler.getEntryDetailByAccount({
                        params: {
                            account_uuid: account.id,
                            start_date: sdate,
                            end_date: edate,
                        }
                    })
                        .then(res => {
                            if (res) {
                                this.balance = kendo.toString(res.balance, 'n')
                                this.backdated = kendo.toString(res.back_date_transaction, 'n')
                                this.forwarded = kendo.toString(res.future_date_transaction, 'n')
                                this.journal_entries = res.entries_detail
                            }
                        })
                        .finally(function () {
                            self.compeletLoading = false
                        })
                }
            },
            // On Account Type Changes
            async onAccountTypeChanges(accountTypeNumber) {
                new Promise(resolve => {
                    resolve('resolved')

                    if (accountTypeNumber === undefined) {
                        this.accounts = this.accounts_bk
                    } else {
                        this.accounts = this.accounts_bk.filter(
                            m => m.account_type_number === accountTypeNumber
                        )
                    }
                })
            },
            // On Search Changes
            async onSearchChanges(searchText) {
                new Promise(resolve => {
                    resolve('resolved')

                    if (searchText !== '') {
                        this.accounts = this.accounts_bk.filter(
                            m => (m.number.toLowerCase().indexOf(searchText) > -1 || m.name.toLowerCase().indexOf(searchText) > -1)
                        );
                    } else {
                        this.accounts = this.accounts_bk
                    }
                })
            },
            // On Change item selection
            onCOAGridChange() {
                let grid = kendo.jQuery("#gridCOA").data("kendoGrid")
                let selectedItem = grid.dataItem(grid.select())

                if (this.account.id !== selectedItem.id) {
                    this.account = selectedItem
                    this.searchTransaction()
                }
            },
            // Go To Edit Page
            goEdit() {
                if (this.account.id) {
                    this.$router.push({name: 'Account', params: {id: this.account.id}})
                }
            },
        },
        mounted() {
            // Call Account Type List
            accountTypeHandler.getAll()
                .then(res => {
                    this.account_types = res.filter(item => item.number == 1 || item.number == 5) // Filter Cash Account Type [1,5]
                })

            // Call Account List
            accountHandler.getListByParent()
                .then(res => {
                    if (res) {
                        let accts = res.filter(item => item.account_type.number == 1 || item.account_type.number == 5) // Filter Cash Account [1,5]
                        this.accounts = accts
                        this.accounts_bk = accts
                        this.compeletLoading = false
                    }
                })
        },
        computed: {
            headers() {
                return [
                    {text: i18n.t('date'), value: 'journal_date'},
                    {text: i18n.t('type'), value: 'journal_type'},
                    {text: i18n.t('number'), value: 'journal_number'},
                    {text: i18n.t('description'), value: 'description'},
                    {text: i18n.t('debit'), value: 'dr'},
                    {text: i18n.t('credit'), value: 'cr'},
                ]
            },
        },
    };
</script>
<style scoped>
    .border-right{
        border-right: 1px solid #789068 !important;
    }

    .purchases {
        position: relative;
        width: 100%;
        background-color: #fff;
        padding: 20px 20px 5px;
    }

    .report_filter {
        background-color: #edf1f5;
        padding: 0 20px 0px 20px;
    }

    .report_block .v-card.third {
        background-color: #00b050;
        border: none;
        box-shadow: none;
        color: #ffffff;
        float: left;
        width: 100%;
    }

    .report_block .v-card.third p.text {
        text-align: left;
        font-size: 17px;
    }

    .report_block .v-card.third p.number {
        text-align: center;
        font-size: 25px;
        font-weight: 700;
        margin-bottom: 0;
    }

    .dv_mt {
        margin-top: 20px;
    }

    .report_block .left_card p:nth-child(2) {
        width: 100%;
        font-size: 19px;
        font-family: "Krasar-Bold", serif;
        padding: 7px 0 0 0;
        text-align: right;
    }

    .attachment_table table tr th {
        height: 55px !important;
    }

    @media (max-width: 576px) {
        .dv_mt,
        .dv_mt8 {
            margin-top: 0;
        }

        .purchases {
            margin-top: 0;
        }
    }
</style>