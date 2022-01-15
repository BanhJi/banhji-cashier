<template>
    <v-app>
        <v-container>
            <v-row>
                <v-col sm="12" cols="12" class="pb-0">
                    <v-row>
                        <LoadingMe
                            :isLoading="showLoading"
                            :fullPage="true"
                            :myLoading="true"/>
                        <v-col class="py-0 px-md-2" sm="12" cols="12">
                            <!--                            <v-row>-->
                            <!--                                <v-col class="py-0 px-md-2" sm="4" cols="4">-->
                            <!--                                    <v-card-->
                            <!--                                        color="white"-->
                            <!--                                        outlined-->
                            <!--                                        dense-->
                            <!--                                        class="pa-4 mt-4 no_border"-->
                            <!--                                        min-height="338"-->
                            <!--                                        style="margin-top: 0!important;text-align: center;"-->
                            <!--                                    >-->
                            <!--                                        <img-->
                            <!--                                            :src="logoUrl"-->
                            <!--                                            width="55%"-->
                            <!--                                            :alt="$t('please_upload_your_logo')"-->
                            <!--                                            class="mt-4"-->
                            <!--                                        />-->
                            <!--                                        <h3 class="font_20 pb-1 mt-4">{{ institute.name }}</h3>-->
                            <!--                                    </v-card>-->
                            <!--                                </v-col>-->
                            <!--                                <v-col class="py-0 px-md-2" sm="4" cols="4">-->
                            <!--                                    <v-card-->
                            <!--                                        color="white"-->
                            <!--                                        outlined-->
                            <!--                                        dense-->
                            <!--                                        class="pa-4 no_border"-->
                            <!--                                        min-height="338"-->
                            <!--                                        >-->
                            <!--                                        <h3 class="font_20 pb-1">{{ $t("share") }}</h3>-->
                            <!--                                        <p class="mb-0">{{ $t("capital_credit_business_description") }}</p>-->
                            <!--                                        <h2 class="primary&#45;&#45;text mb-0 niradei_black pa-0 col-sm-12 text-right">{{totalSharePrice}}</h2>-->
                            <!--                                        <v-row>-->
                            <!--                                            <v-col sm="12" cols="12" class="pr-0 pb-0">-->
                            <!--                                                <template>-->
                            <!--                                                    <v-simple-table>-->
                            <!--                                                        <template>-->
                            <!--                                                            <tbody>-->
                            <!--                                                                <tr>-->
                            <!--                                                                    <td class="text-left tdbig">-->
                            <!--                                                                        <span class="niradei_medium font_14 grey&#45;&#45;text">-->
                            <!--                                                                            {{ $t("total_share") }}-->
                            <!--                                                                        </span>-->
                            <!--                                                                    </td>-->
                            <!--                                                                    <td class="text-right">-->
                            <!--                                                                        <span class="niradei_heavy font_18 dark_grey">-->
                            <!--                                                                            {{totalShare}}-->
                            <!--                                                                        </span>-->
                            <!--                                                                    </td>-->
                            <!--                                                                </tr>-->
                            <!--                                                                <tr>-->
                            <!--                                                                    <td class="text-left tdbig">-->
                            <!--                                                                        <span class="niradei_medium font_14 grey&#45;&#45;text">-->
                            <!--                                                                            {{ $t("number_of_women") }}-->
                            <!--                                                                        </span>-->
                            <!--                                                                    </td>-->
                            <!--                                                                    <td class="text-right">-->
                            <!--                                                                        <span class="niradei_heavy font_18 dark_grey">-->
                            <!--                                                                        {{totalFemaleShare}}-->
                            <!--                                                                        </span>-->
                            <!--                                                                    </td>-->
                            <!--                                                                </tr>-->
                            <!--                                                                <tr>-->
                            <!--                                                                    <td class="text-left tdbig">-->
                            <!--                                                                        <span class="niradei_medium font_14 grey&#45;&#45;text">-->
                            <!--                                                                        {{ $t("_women") }}-->
                            <!--                                                                        </span>-->
                            <!--                                                                    </td>-->
                            <!--                                                                    <td class="text-right">-->
                            <!--                                                                        <span class="niradei_heavy font_18 dark_grey">-->
                            <!--                                                                        {{totalFemaleP}}-->
                            <!--                                                                        </span>-->
                            <!--                                                                    </td>-->
                            <!--                                                                </tr>-->
                            <!--                                                                -->
                            <!--                                                            </tbody>-->
                            <!--                                                        </template>-->
                            <!--                                                    </v-simple-table>-->
                            <!--                                                </template>-->
                            <!--                                            </v-col>-->
                            <!--                                        </v-row>-->
                            <!--                                    </v-card>-->
                            <!--                                </v-col>-->
                            <!--                                <v-col class="py-0 px-md-2" sm="4" cols="4">-->
                            <!--                                    <v-card-->
                            <!--                                        color="white"-->
                            <!--                                        outlined-->
                            <!--                                        dense-->
                            <!--                                        class="pa-4 no_border"-->
                            <!--                                        min-height="338"-->
                            <!--                                        >-->
                            <!--                                        <h3 class="font_20 pb-1">{{ $t("member") }}</h3>-->
                            <!--                                        <p class="mb-0">{{ $t("as_of_today") }}</p>-->
                            <!--                                        <h2 class="primary&#45;&#45;text mb-0 niradei_black pa-0 col-sm-12 text-right">{{totalMember}}</h2>-->
                            <!--                                        <v-row>-->
                            <!--                                            <v-col sm="12" cols="12" class="pr-0 pb-0">-->
                            <!--                                                <template>-->
                            <!--                                                    <v-simple-table>-->
                            <!--                                                        <template>-->
                            <!--                                                            <tbody>-->
                            <!--                                                                <tr>-->
                            <!--                                                                    <td class="text-left tdbig">-->
                            <!--                                                                        <span class="niradei_medium font_14 grey&#45;&#45;text">-->
                            <!--                                                                            {{ $t("total_members") }}-->
                            <!--                                                                        </span>-->
                            <!--                                                                    </td>-->
                            <!--                                                                    <td class="text-right">-->
                            <!--                                                                        <span class="niradei_heavy font_18 dark_grey">-->
                            <!--                                                                            {{totalMember}}-->
                            <!--                                                                        </span>-->
                            <!--                                                                    </td>-->
                            <!--                                                                </tr>-->
                            <!--                                                                <tr>-->
                            <!--                                                                    <td class="text-left tdbig">-->
                            <!--                                                                        <span class="niradei_medium font_14 grey&#45;&#45;text">-->
                            <!--                                                                            {{ $t("number_of_women") }}-->
                            <!--                                                                        </span>-->
                            <!--                                                                    </td>-->
                            <!--                                                                    <td class="text-right">-->
                            <!--                                                                        <span class="niradei_heavy font_18 dark_grey">-->
                            <!--                                                                        {{totalFemaleMember}}-->
                            <!--                                                                        </span>-->
                            <!--                                                                    </td>-->
                            <!--                                                                </tr>-->
                            <!--                                                                <tr>-->
                            <!--                                                                    <td class="text-left tdbig">-->
                            <!--                                                                        <span class="niradei_medium font_14 grey&#45;&#45;text">-->
                            <!--                                                                        {{ $t("man") }}-->
                            <!--                                                                        </span>-->
                            <!--                                                                    </td>-->
                            <!--                                                                    <td class="text-right">-->
                            <!--                                                                        <span class="niradei_heavy font_18 dark_grey">-->
                            <!--                                                                        {{totalMaleMember}}-->
                            <!--                                                                        </span>-->
                            <!--                                                                    </td>-->
                            <!--                                                                </tr>-->
                            <!--                                                                -->
                            <!--                                                            </tbody>-->
                            <!--                                                        </template>-->
                            <!--                                                    </v-simple-table>-->
                            <!--                                                </template>-->
                            <!--                                            </v-col>-->
                            <!--                                        </v-row>-->
                            <!--                                    </v-card>-->
                            <!--                                </v-col>-->
                            <!--                                -->
                            <!--                            </v-row>-->
                            <v-row>
                                <v-col sm="8" cols="8" class=" px-md-2">
                                    <h3 class="font_20 pb-1">{{ $t("session") }}</h3>
                                </v-col>
                                <v-col sm="4" cols="4" class=" px-md-2">
                                    <v-btn class="white--text float-right text-capitalize" color="primary"
                                           v-show="hasSession"
                                           @click="goReconcile">
                                        {{ $t('close_session') }}
                                    </v-btn>
                                    <v-dialog v-model="showSession" max-width="400px">
                                        <template v-slot:activator="{ on }">
                                            <v-btn class="white--text float-right text-capitalize" color="primary"
                                                   v-on="on"
                                                   v-show="!hasSession"
                                                   @click="showAddSession">
                                                {{ $t('add_session') }}
                                            </v-btn>
                                        </template>
                                        <v-form ref="form" v-model="valid" lazy-validation>
                                            <v-card>
                                                <v-card-title>{{ $t('add_session') }}</v-card-title>
                                                <v-icon class="btn_close" @click="showSession = false">close</v-icon>
                                                <v-divider/>
                                                <v-card-text
                                                    style="height: 310px; background-color: #EDF1F5; color: #333333;">
                                                    <v-row>
                                                        <v-col sm="12" cols="12" class="pb-0">
                                                            <label class="label">{{ $t('number') }}</label>
                                                            <v-text-field
                                                                class="mt-1"
                                                                v-model="s.number"
                                                                disabled
                                                                outlined
                                                                placeholder=""
                                                                :rules="[v => !!v || 'Number is required']"
                                                            />
                                                        </v-col>
                                                        <v-col v-for="cur in currencyData" v-bind:key="cur.id" sm="12" cols="12" class="pb-0">
                                                            <label class="label">{{ cur.code }}</label>
                                                            <v-text-field
                                                                class="mt-1"
                                                                v-model="cur.amount"
                                                                outlined
                                                                placeholder=""
                                                            />
                                                        </v-col>
                                                    </v-row>
                                                </v-card-text>
                                                <v-divider/>
                                                <v-card-actions class="pa-4">
                                                    <v-row>
                                                        <v-col sm="6" cols="6" class="py-0">
                                                            <v-btn color="black"
                                                                   outlined
                                                                   class=" text-capitalize  black--text float-left"
                                                                   @click="dialogm2 = false">{{ $t('cancel') }}
                                                            </v-btn>
                                                        </v-col>
                                                        <v-col sm="6" cols="6" class="py-0">
                                                            <v-btn color="secondary"
                                                                   class="px-3  white--text text-capitalize float-right"
                                                                   @click="addSession">
                                                                {{ $t('save_close') }}
                                                            </v-btn>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-actions>

                                            </v-card>
                                        </v-form>
                                    </v-dialog>
                                </v-col>
                                <v-col sm="12" cols="12" class="py-0 px-md-2">
                                    <template>
                                        <kendo-datasource
                                            ref="sessionDS"
                                            :type="'JSON'"
                                            :data="sessionData"
                                            :server-paging="false"/>
                                        <kendo-grid
                                            id="sessionDS" class="grid-function"
                                            :data-source-ref="'sessionDS'"
                                            :editable="false"
                                            :groupable="false"
                                            :column-menu="true"
                                            :noRecords="true"
                                            :scrollable-virtual="true">
                                            <kendo-grid-column
                                                :title="$t('number')"
                                                :width="100"
                                                :template="rowNumberTmpl"
                                                :column-menu="false"
                                                :headerAttributes="{style: 'background-color: #EDF1F5;',class: 'text-products' }"
                                                :attributes="{ style: 'text-align: products'}"
                                            />
                                            <kendo-grid-column
                                                :field="'user'"
                                                :title="$t('employee')"
                                                :width="200"
                                                :template="'<span>#= user.user_name#</span>'"
                                                :headerAttributes="{ style: 'background-color: #EDF1F5, color: green !important' }"
                                                :attributes="{style: 'text-align: right; '}"
                                            />
                                            <kendo-grid-column
                                                :field="'number'"
                                                :title="$t('number')"
                                                :width="200"
                                                :headerAttributes="{ style: 'background-color: #EDF1F5, color: green !important' }"
                                                :attributes="{style: 'text-align: right; '}"
                                            />
                                            <kendo-grid-column
                                                :field="'startDate'"
                                                :title="$t('start')"
                                                :template="'<span>#= kendo.toString(new Date(startDate), `yyyy-MM-dd H:m:s`) #</span>'"
                                                :headerAttributes="{ style: 'background-color: #EDF1F5, color: green !important' }"
                                                :attributes="{style: 'text-align: right; '}"
                                            />
                                            <kendo-grid-column
                                                :field="'end'"
                                                :title="$t('end')"
                                                :template="'<span>#= endDate != `` ? kendo.toString(new Date(endDate), `yyyy-MM-dd H:m:s`) : ``#</span>'"
                                                :headerAttributes="{ style: 'background-color: #EDF1F5, color: green !important' }"
                                                :attributes="{style: 'text-align: right; '}"
                                            />
                                            <kendo-grid-column
                                                :field="'status'"
                                                :title="$t('status')"
                                                :template="statusTmpl"
                                                :headerAttributes="{ style: 'background-color: #EDF1F5, color: green !important' }"
                                                :attributes="{style: 'text-align: right; '}"
                                            />
                                        </kendo-grid>
                                    </template>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
import {i18n} from "@/i18n";
const sessionHandler = require("@/scripts/session/handler/sessionHandler")
const currencyHandler = require("@/scripts/currency/handler/currencyHandler")
import SessionModel from '@/scripts/session/model/Session'
const store = require("@/institute.js")
const {cookies} = store.default.state
import {UserModel} from "@/scripts/model/AppModels"
export default {
    components: {
        LoadingMe: () => import(`@/components/Loading`),
    },
    data: () => ({
        valid: true,
        institutes: [],
        mInstitute: {},
        check: ["1"],
        categories: [
            i18n.t("jan"),
            i18n.t("feb"),
            i18n.t("mar"),
            i18n.t("apr"),
            i18n.t("may"),
            i18n.t("jun"),
        ],
        categoryAxisBar: [],
        valueAxisBar: [],
        tooltipBar: [],
        memberSeries: [
            {
                type: "pie",
                startAngle: 180,
                data: [
                    {
                        category: i18n.t("bad_loans"),
                        value: 22,
                        color: "#D85604",
                    },
                    {
                        category: i18n.t("total_loan_to_members"),
                        value: 70,
                        color: "#c80000",
                    },
                    {
                        category: i18n.t("total_loan_to_customers"),
                        value: 20,
                        color: "#F44336",
                    },
                    // {
                    //     category: i18n.t("overdraft"),
                    //     value: 22,
                    //     color: "#E88D14",
                    // },
                ],
            },
        ],
        //Bar
        seriesBar: [
            {
                name: "Total Visits",
                data: [56000, 63000, 74000, 91000, 117000, 138000],
                color: '#4d4848',
                border: {
                    width: 0
                },
            },
            {
                name: "Unique visitors",
                data: [52000, 34000, 23000, 48000, 67000, 83000],
                color: '#898C8F',
                border: {
                    width: 0
                },
            },
        ],
        labelTemplate: "#= category # #= value #%",
        tooltipTemplate: "#= category # : #= value #%",
        series: [
            {
                type: "pie",
                startAngle: 180,
                data: [
                    {
                        category: i18n.t("bad_loans"),
                        value: 22,
                        color: "#D85604",
                    },
                    {
                        category: i18n.t("total_loan_to_members"),
                        value: 70,
                        color: "#c80000",
                    },
                    {
                        category: i18n.t("total_loan_to_customers"),
                        value: 20,
                        color: "#F44336",
                    },
                    // {
                    //     category: i18n.t("overdraft"),
                    //     value: 22,
                    //     color: "#E88D14",
                    // },
                ],
            },
        ],
        series1: [
            {
                type: "pie",
                startAngle: 180,
                data: [
                    {
                        category: i18n.t("total_share"),
                        value: 60,
                        color: "#D85604",
                    },
                    {
                        category: i18n.t("total_saving"),
                        value: 30,
                        color: "#c80000",
                    },
                    {
                        category: i18n.t("other_capital"),
                        value: 10,
                        color: "#F44336",
                    },
                    // {
                    //     category: i18n.t("overdraft"),
                    //     value: 22,
                    //     color: "#E88D14",
                    // },
                ],
            },
        ],
        series_line: [
            {
                type: "line",
                name: "Price",
                data: [0, 500000, 400000, 600000, 900000, 200000],
                color: "#F44336",
            },
        ],
        categories_line: [
            i18n.t("jan"),
            i18n.t("feb"),
            i18n.t("mar"),
            i18n.t("apr"),
            i18n.t("may"),
            i18n.t("jun"),
        ],
        valueAxis_line: [
            {
                max: 1000000,
                // visible: false,
                labels: {
                    format: "{0}",
                },
            },
        ],
        series_round: [
            {
                type: "donut",
                name: "Price",
                data: [
                    {
                        value: 22,
                        color: "#D85604",
                    },
                    {
                        value: 22,
                        color: "#E88D14",
                    },
                    {
                        value: 45,
                        color: "#c80000",
                    },
                    {
                        value: 11,
                        color: "#F44336",
                    },
                ],
                color: "#F44336",
            },
        ],
        valueAxis_round: [
            {
                labels: {
                    format: "{0}",
                },
            },
        ],
        totalMember: 0,
        totalMaleMember: 0,
        totalFemaleMember: 0,
        //share
        totalShare: 0,
        totalFemaleShare: 0,
        totalMaleShare: 0,
        totalFemaleP: 0,
        totalSharePrice: 0,
        asOf: new Date(),
        shareList: [],
        decimals: [],
        //loan
        loanList: [],
        totalLoanMember: 0,
        totalLMember: 0,
        totalLoanCustomer: 0,
        totalLoan: 0,
        //par
        provision: 0,
        late30: 0,
        late60: 0,
        late90: 0,
        over90: 0,
        totalProvision: 0,
        //saving
        totalSaving: 0,
        totalSavingAmount: 0,
        totalSavingFemaleA: 0,
        totalSavingFemaleP: 0,
        l: [],
        logoUrl: '@/assets/images/sample_logo.png',
        institute: {},
        totalSavingMale: 0,
        memberList: [],
        sessionData: [],
        isUser: true,
        s: new SessionModel({}),
        showSession: false,
        currencyData: [],
        showLoading: false,
        hasSession: false,
        activeSession: {}
    }),
    mounted: async function () {
        // await this.loadInstLogo()
        // await this.loadDecimal()
        // await this.loadInstitute();
        // await this.loadInstitutes();
        // await this.getCookieData();
        // await this.loadMember()
        // await this.loadShare()
        // await this.loadLoan()
        // await this.loadPar()
        // await this.loadSaving()
    },
    methods: {
        rowNumberTmpl(dataItem) {
            var ds = this.$refs.sessionDS.kendoWidget(),
                index = ds.indexOf(dataItem);
            return index + 1;
        },
        statusTmpl(dataItem) {
            let st = i18n.t('open')
            if(parseInt(dataItem.status) == 2){
                st = i18n.t('reconciled')
            }
            return st
        },
        async showAddSession() {
            this.s = new SessionModel({})
            this.showSession = true
            await this.getLastNumber()
            await this.loadCurrencyData()
        },
        async loadSession() {
            this.showLoading = true
            this.sessionData = []
            sessionHandler.list().then(response => {
                this.showLoading = false
                if (response.data.statusCode === 200) {
                    let data = response.data.data
                    window.console.log(data, 'session data')
                    if(data.length > 0){
                        this.sessionData = data
                    }
                }
            }).catch()
            {
                this.showLoading = false
            }
        },
        async loadSessionByUser() {
            this.showLoading = true
            this.sessionData = []
            sessionHandler.byuser(new UserModel(cookies.user).user_name).then(response => {
                this.showLoading = false
                if (response.data.statusCode === 200) {
                    let data = response.data.data
                    window.console.log(data, 'session data')
                    if(data.length > 0){
                        this.sessionData = data
                    }
                }
            }).catch()
            {
                this.showLoading = false
            }
        },
        async loadCurrencyData() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved')
                    this.showLoading = true
                    this.currencyData = []
                    currencyHandler.list('fun-c').then(response => {
                        this.showLoading = false
                        if (response.data.statusCode === 200) {
                            let data = response.data.data
                            window.console.log(data, 'currency')
                            data.forEach(element => {
                                this.currencyData.push({
                                    code: element.code,
                                    amount: 0,
                                    id: element.id
                                })
                            });
                        }
                    }).catch()
                    {
                        this.showLoading = false
                    }
                }, 300)
            })
        },
        addSession(){
            this.s.openBalance = this.currencyData
            this.s.startDate = Date.parse(new Date())
            this.s.user = new UserModel(cookies.user)
            window.console.log(this.s)
            this.showLoading = true
            sessionHandler.create(new SessionModel(this.s)).then(res => {
                this.showLoading = false
                this.showSession = false
                window.console.log(res, 'response')
                if (res.data.statusCode === 201) {
                    this.$snotify.success('Successfully')
                }
            }).catch(e => {
                this.$snotify.error('Something went wrong')
                this.errors.push(e)
                window.console.log(e)
            })
        },
        async getLastNumber() {
            if (this.$route.params.id == undefined) {
                new Promise(resolve => {
                    setTimeout(() => {
                        resolve('resolved');
                        let data = {
                        }
                        sessionHandler.getLastNumber(data).then(res => {
                            window.console.log(res.data.data, 'last number')
                            this.s.lastNumber = res.data.data.lastNumber
                            this.generateNumber()
                        }).catch(e => {
                            this.$snotify.error('Something went wrong')
                            this.errors.push(e)
                            // window.console.log(e)
                        })
                    }, 300);
                })
            }
        },
        generateNumber() {
            if (this.$route.params.id == undefined) {
                let newNum = ''
                let lnum = this.zeroPad(this.s.lastNumber, 6)
                let year = new Date().getFullYear().toString().substr(-2)
                let mo = this.zeroPad(new Date().getMonth() + 1, 2)
                newNum = 'SES-' +year + mo + '-' + lnum
                this.s.number = newNum
            }
        },
        zeroPad(num, places) {
            return String(num).padStart(places, '0')
        },
        checkSession(){
            this.showLoading = true
            let data = {
                user_name : new UserModel(cookies.user).user_name
            }
            sessionHandler.checkSession(data).then(res => {
                this.showLoading = false
                if(res.data.data.length > 0){
                    this.hasSession = true
                    this.activeSession = res.data.data[0]
                }else{
                    this.activeSession = {}
                }
            }).catch(e => {
                this.showLoading = false
                this.$snotify.error('Something went wrong')
                this.errors.push(e)
                window.console.log(e)
            })
        },
        goReconcile(){
            window.console.log(this.activeSession, 'aactive session')
        }
    },
    computed: {
        lang() {
            return "/" + i18n.locale;
        },
    },
    created: async function () {
        await this.loadSession()
        await this.loadSessionByUser()
        this.checkSession()
    }
};
</script>
<style scoped>
.k-chart {
    height: 177px !important;
}

.five {
    font-weight: 700;
    font-size: 26px;
}

.theme--light.v-data-table {
    background-color: transparent !important;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    height: 32px;
    border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
}

.tdbig {
    height: 50px !important;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr:first-child > td {
    border-top: thin solid rgba(0, 0, 0, 0.12) !important;
}

.theme--light.v-data-table
> .v-data-table__wrapper
> table
> tbody
> tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    background-color: transparent !important;
}

.border-bottom {
    border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;
}

.font-small {
    font-size: 12px;
    line-height: 15px;
}

.font-26 {
    font-size: 26px !important;
}

.round_checkbox label:after {
    content: "";
    height: 7px;
    left: 3px !important;
    opacity: 0;
    position: absolute;
    top: 4px !important;
}

.round_checkbox label {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 50%;
    cursor: pointer;
    height: 20px !important;
    left: 0;
    position: absolute;
    top: 0;
    width: 20px !important;
}

.dark_grey {
    color: #7e7a7a;
}

.path {
    stroke: gainsboro !important;
}

@media (max-width: 576px) {
}
</style>
