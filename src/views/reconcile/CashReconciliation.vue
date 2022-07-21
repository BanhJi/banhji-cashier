<template>
    <v-app>
        <v-container>
            <v-row>
                <v-col cols="12" sm="12">
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <v-card outlined dense class="pa-4 no_border rounded-sm" color="white">
                            <v-card outlined dense class="no_border">
                                <h2 class="mb-0">{{ $t('cash_reconciliation') }}</h2>
                                <v-icon
                                    onclick="window.history.go(-1); return false;"
                                    style="cursor: pointer; color: #333; font-size: 40px;"
                                    class="float-right"
                                >close
                                </v-icon>
                            </v-card>

                            <v-card outlined dense class="px-3 no_border" color="grayBg">
                                <v-row class="">
                                    <v-col sm="3" cols="12" class="pb-0">
                                        <label class="label">{{ $t('journal_date') }}</label>
                                        <app-datepicker
                                            :initialDate="reconcile.issuedDate"
                                            @emitDate="reconcile.issuedDate = $event"
                                            @onChanged="loadExchangeRate"/>
                                    </v-col>
                                    <v-col sm="3" cols="12" class="pb-0 pl-0">
                                        <label class="label">{{ $t('number') }}</label>
                                        <v-row>
                                            <v-col sm="10" cols="10" class="pr-0 pb-0 pt-1">
                                                <v-text-field
                                                    v-model="reconcile.number"
                                                    outlined
                                                    :rules="[v => !!v || 'Number is required']"
                                                    readonly
                                                    required/>
                                            </v-col>
                                            <v-col sm="2" cols="2" class="pl-0 pb-0 pt-1">
                                                <v-icon color="black" size="30" class="border_qrcode"
                                                        @click="generateNumber">mdi-qrcode
                                                </v-icon>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col sm="3" cols="12" class="pb-0">
                                        <label class="label">{{ $t('ending_balance_date') }}</label>
                                        <app-datepicker
                                            :initialDate="reconcile.endingBalanceDate"
                                            @emitDate="reconcile.endingBalanceDate = $event"
                                            @onChanged="loadEndingBalance"/>
                                    </v-col>
                                    <v-col sm="3" cols="12" class="pb-0 pl-0">
                                        <label class="label">{{ $t('cashier') }}</label>
                                        <h3 style="margin-top: 10px;">{{loggedUser.name}}</h3>
<!--                                        <app-cash-account-dropdownlist-->
<!--                                            :initAccount="reconcile.account"-->
<!--                                            @emitAccount="reconcile.account = $event"-->
<!--                                            @onChanged="loadEndingBalance"-->
<!--                                        />-->
                                    </v-col>
                                </v-row>
                                <v-row class="mt-0">
                                    <v-col sm="6" cols="12" class="py-0">
                                        <v-card outlined
                                                dense
                                                class="pa-3 rounded-4 no_border white--text "
                                                color="secondary"
                                                height="60px">
                                            <h3 class="text-left flex-1  font_12 text-uppercase">
                                                {{ $t("ending_balance") }}
                                            </h3>
                                            <h3 class="text-right flex-1 font_20">
                                                {{ numFormat(reconcile.endingBalance) }}
                                            </h3>
                                        </v-card>
                                    </v-col>
                                    <v-col sm="6" cols="12" class="py-0">
                                        <v-card outlined
                                                dense
                                                class="pa-3 rounded-4 no_border white--text "
                                                color="secondary"
                                                height="60px">
                                            <h3 class="text-left flex-1  font_12 text-uppercase">
                                                {{ $t("actual_amount") }}
                                            </h3>
                                            <h3 class="text-right flex-1 font_20">
                                                {{ Number(reconcile.actualAmount).toLocaleString() }}
                                            </h3>
                                        </v-card>
                                    </v-col>
                                </v-row>
                                <v-row class="">
                                    <v-col sm="6" cols="12">
                                        <v-card outlined
                                                dense
                                                class="pa-3 rounded-4 no_border black--text "
                                                color="white"
                                                height="60px">
                                            <h3 class="text-left flex-1  font_12 text-uppercase">
                                                {{ $t("variance") }}
                                            </h3>
                                            <h3 class="text-right flex-1 font_20">
                                                {{ numFormat(reconcile.varianceAmount) }}
                                            </h3>
                                        </v-card>
                                    </v-col>
                                    <v-col sm="6" cols="12">
                                        <v-card height="60px" color="white" elevation="0"
                                                style="padding-top: 6.3px !important;" class="pa-3 rounded-4 ">
<!--                                            <app-account-dropdownlist-->
<!--                                                :disabled="reconcile.variance_amount === 0"-->
<!--                                                :initAccount="reconcile.adjustment_account"-->
<!--                                                @emitAccount="reconcile.adjustment_account = $event"-->
<!--                                            />-->
                                            <v-select
                                                class="mt-1"
                                                :disabled="reconcile.varianceAmount === 0"
                                                :items="listAccounts"
                                                placeholder="select"
                                                item-text="name"
                                                v-model="reconcile.adjustmentAccount"
                                                return-object
                                                outlined/>
                                        </v-card>
                                    </v-col>
                                </v-row>

                            </v-card>
                            <v-card outlined dense class="no_border" color="white">
                                <v-row style="">
                                    <v-col sm="12" cols="12" class="pb-1">
                                        <kendo-datasource ref="noteDS"
                                                          :data="notes"
                                                          :change="onDataSourceChanges"/>

                                        <kendo-grid id="noteGrid" ref="noteGrid"
                                                    class="grid-function"
                                                    :data-source-ref="'noteDS'"
                                                    :sortable="false"
                                                    :filterable="false"
                                                    :column-menu="true"
                                                    :editable="true"
                                                    :scrollable-virtual="true"
                                        >
                                            <kendo-grid-column
                                                :title="$t('no.')"
                                                :template="rowNumberTmpl"
                                                :width="55"
                                                :column-menu="false"
                                                :headerAttributes="{
													style: 'background-color: #EDF1F5;',
													class: 'text-products'
												}"
                                                :attributes="{
													style: 'text-align: products'
												}"/>
                                            <kendo-grid-column
                                                :field="'currency'"
                                                :title="$t('currency')"
                                                :width="120"
                                                :template="'<span>#=currency.code#</span>'"
                                                :editor="CurrencyEditor"
                                                :headerAttributes="{
													style: 'background-color: #EDF1F5'
												}"/>
                                            <kendo-grid-column
                                                :field="'note'"
                                                :title="$t('note')"
                                                :width="90"
                                                :headerAttributes="{
													style: 'background-color: #EDF1F5'
												}"/>
                                            <kendo-grid-column
                                                :field="'unit'"
                                                :title="$t('unit')"
                                                :width="90"
                                                :headerAttributes="{
													style: 'background-color: #EDF1F5'
												}"/>
                                            <kendo-grid-column
                                                :field="'amount'"
                                                :title="$t('amount')"
                                                :format="'{0:n}'"
                                                :editable="function(){ return false }"
                                                :width="150"
                                                :headerAttributes="{style: 'text-align: right; background-color: #EDF1F5'}"
                                                :attributes="{style: 'text-align: right; '}"/>
                                            <kendo-grid-column
                                                :field="'exchange_rate'"
                                                :title="$t('rate')"
                                                :editable="function(){ return false }"
                                                :width="100"
                                                :headerAttributes="{style: 'text-align: right; background-color: #EDF1F5'}"
                                                :attributes="{style: 'text-align: right; '}"/>
                                            <kendo-grid-column
                                                :field="'exchanged_amount'"
                                                :title="$t('exchanged_amount')"
                                                :format="'{0:n}'"
                                                :editable="function(){ return false }"
                                                :width="150"
                                                :headerAttributes="{style: 'text-align: right; background-color: #EDF1F5'}"
                                                :attributes="{style: 'text-align: right; '}"/>
                                            <kendo-grid-column
                                                :field="'remark'"
                                                :title="$t('remark')"
                                                :hidden="true"
                                                :width="150"
                                                :headerAttributes="{
													style: 'background-color: #EDF1F5'
												}"/>
                                            <kendo-grid-column
                                                :command="{ iconClass: 'k-icon k-i-trash', text: ' ', click: removeRow, class: 'btn-plus' }"
                                                :title="'&nbsp;'"
                                                :width="50"
                                                :headerAttributes="{
													style: 'text-align: right; background-color: #EDF1F5'
												}"
                                            />
                                        </kendo-grid>
                                    </v-col>
                                </v-row>
                                <v-row style="background-color: #fff;">
                                    <v-col sm="5" cols="12" class="pt-0">
                                        <v-btn color="primary" class="float-left btn_plus rounded-0 white--text"
                                               @click="addRow">
                                            <v-icon size="" class="ma-1">mdi-plus</v-icon>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-card>
                            <v-divider/>
                            <v-card outlined dense class="no_border function_footer">
                                <!-- Warning Message -->
                                <v-alert type="warning"
                                         v-model="alert"
                                         dismissible>
                                    <span v-html="errorMessage"/>
                                </v-alert>

<!--                                <v-menu>-->
<!--                                    <template v-slot:activator="{ on }">-->
<!--                                        <v-btn class="mr-2 text-capitalize  black&#45;&#45;text float-left" v-on="on">-->
<!--                                            {{ $t('select_template') }}-->
<!--                                            <v-icon size="" class="ma-1">expand_more</v-icon>-->
<!--                                        </v-btn>-->
<!--                                    </template>-->
<!--                                    <v-list>-->
<!--                                        <v-list-item v-for="(item, index) in templates" :key="index">-->
<!--                                            <v-list-item-title>{{ item.title }}</v-list-item-title>-->
<!--                                        </v-list-item>-->
<!--                                    </v-list>-->
<!--                                </v-menu>-->
                                <v-btn color="primary" outlined class="text-capitalize  black--text float-left"
                                       @click="cancel">{{ $t('cancel') }}
                                </v-btn>
                                <v-btn color="primary" class="ml-2 float-right text-capitalize  white--text"
                                       @click="onSaveOptionClick(SaveOption.SAVECLOSE)">{{ $t('reconcile') }}
                                </v-btn>
                                <v-btn color="primary" class="ml-2 float-right text-capitalize  white--text"
                                       @click="onSaveOptionClick(SaveOption.SAVEDRAFT)" v-show="!isEdit">
                                    {{ $t('save_for_later') }}
                                </v-btn>
                            </v-card>
                        </v-card>
                    </v-form>
                </v-col>
            </v-row>

            <LoadingMe
                :isLoading="showLoading"
                :fullPage="false"
                :myLoading="true"
                type="loading"
            />

        </v-container>
    </v-app>
</template>

<script>
import kendo from '@progress/kendo-ui';
import {i18n} from '@/i18n';
import Helper from "@/helper.js";
import {uuid} from 'vue-uuid'
import {
    ReconcileDetailModel,
    JournalModel,
    JournalEntryModel,
    AccountModel,
    CurrencyModel,
} from "@/scripts/model/AppModels";

import ReconcileModel from "@/scripts/session/model/Reconcile";
const $ = kendo.jQuery;

/* Store */
// import store from "@/store"

// const institute = store.state.institute.institute
const prefixHandler = require("@/scripts/prefixHandler")
const {
    journalHandler,
    currencyHandler,
} = require("@/scripts/AppHandlers");
const {CurrencyEditor} = require("@/scripts/kendo_editor/Collections");
const {
    SaveOption,
    EntityType,
} = require("@/scripts/default_setup/Collections");
const sessionHandler = require("@/scripts/session/handler/sessionHandler")
const cookieJS = require("@/cookie.js");
const cookie = cookieJS.getCookie();
const accountHandler = require("@/scripts/accountHandler")
const saleFormContentHandler = require("@/scripts/saleFormContentHandler")
import SessionModel from '@/scripts/session/model/Session'
const instituteHandler = require("@/scripts/instituteHandler")
export default {
    name: "CashReconciliation",
    components: {
        "LoadingMe": () => import('@/components/Loading'),
        "app-datepicker": () => import('@/components/custom_templates/DatePickerComponent'),
        // "app-account-dropdownlist": () => import('@/components/dropdownlist/Account'),
        // "app-cash-account-dropdownlist": () => import('@/components/dropdownlist/CashAccount'),
    },
    props: {
        initCashReconciliation: {
            type: ReconcileModel,
        },
    },
    data: () => ({
        listAccounts: [],
        // Obj
        reconcile: new ReconcileModel(),
        adjustmentJournal: new JournalModel(),
        adjustmentEntries: new JournalEntryModel(),
        notes: [],
        currencies: [],
        exchangeRates: [],
        // Entry Uuid
        debitEntryUuid: '',
        creditEntryUuid: '',
        // Form validation
        valid: true,
        isEdit: false,
        alert: false,
        errorMessage: "",
        saveMode: "",
        SaveOption: SaveOption,
        // Other
        files: [],
        templates: [],
        user: Helper.getUser(),
        // Editors
        CurrencyEditor: CurrencyEditor,
        // LoadingMe
        showLoading: false,
        loadingAlert: false,
        loadingColorAlert: "",
        loadingTextAlert: "",
        activeSession: {},
        loggedUser: {
            id: cookie.creator,
            name: cookie.user['custom:firstName'] + ' ' + cookie.user['custom:lastName'],
            username: cookie.email,
            email: cookie.email
        },
        saleFormContent: {},
        baseCurrency: {},
        setting: {},
        journalId: uuid.v1(),
        journal: new JournalModel(),
    }),
    methods: {
        // Initial Data
        initialData() {
            this.loadAccount()
        },
        // Set default data
        setDefaultData() {
            // Brand New Mode
            this.isEdit = false;

            this.reconcile = new ReconcileModel({
                issuedDate: new Date().toISOString().substr(0, 10),
                type: EntityType.CASH_RECONCILIATION,
                endingBalanceDate: new Date().toISOString().substr(0, 10),
            });

            // Entry Uuid
            this.debitEntryUuid = '';
            this.creditEntryUuid = '';

            // Generate number
            this.generateNumber();

            // Reset lines and Add 2 default lines
            let self = this
            setTimeout(() => {
                if(self.notes !== undefined){
                    if(Object.keys(self.notes).length == 0) {
                        self.addRow()
                        self.addRow()
                    }
                }else{
                    self.addRow()
                    self.addRow()
                }
            }, 500)
        },
        // Bind data from prop for edit mode
        bindData() {
            // Edit Mode
            this.isEdit = true;

            this.notes = this.reconcile.notes;

            // Journal
            if (this.reconcile.adjustment_journal_id !== '') {
                journalHandler.getOne(this.reconcile.adjustment_journal_id)
                    .then((res) => {
                        this.adjustmentJournal = new JournalModel(res.data);

                        this.adjustmentJournal.journal_entries.forEach(value => {
                            if (value.amount > 0) {
                                this.debitEntryUuid = value.uuid;
                            } else {
                                this.creditEntryUuid = value.uuid;
                            }
                        });
                    });
            }
        },
        // Number
        async loadPrefix() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved');
                    prefixHandler.get('cash reconciliation').then(res => {
                        if (res.data.statusCode === 200) {
                            this.showLoading = false
                            this.transactionTypes = res.data.data
                            if (this.transactionTypes.length > 0) {
                                this.reconcile.transactionType = this.transactionTypes[0]
                                if (!this.$route.params.id) {
                                    this.generateNumber()
                                }
                            }
                        }
                    })
                }, 10);
            })
        },
        async generateNumber() {
            // window.console.log(this.reconcile.transactionType)
            if (!this.isEdit) {
                let num = await Helper.generateAccountingNumberA(this.reconcile.type, this.reconcile.issuedDate);
                window.console.log(num, 'num')
                this.reconcile.number = num.number + '-2';
                this.reconcile.prefix_format = num.prefix_format;
            }
        },
        // Get Exchange Rate
        loadExchangeRate() {
            currencyHandler.getLastExchangeRateByDate(this.reconcile.issuedDate)
                .then(res => {
                    this.exchangeRates = res.data.data;
                });
        },
        /* Kendo */
        // DataSource Changes
        onDataSourceChanges(e) {
            if (e.field) {
                let dataRow = e.items[0];

                if (e.field === "currency") {
                    this.addExtraRow(dataRow.uid);
                }

                this.autoCalculate();
            }
        },
        // Auto Calculate In DataSource
        autoCalculate() {
            let ds = this.$refs.noteDS.kendoWidget(),
                totalExchangeAmount = 0;

            ds.data().forEach(value => {
                let amount = kendo.parseFloat(value.note) * kendo.parseFloat(value.unit),
                    xrate = this.exchangeRates.find(xr => xr.code === value.currency.code);

                value.set("amount", amount);

                if (xrate) {
                    let xamount = amount * kendo.parseFloat(xrate.rate);

                    value.set("exchange_rate_uuid", xrate.id);
                    value.set("exchange_rate", xrate.rate);
                    value.set("exchanged_amount", xamount);
                    totalExchangeAmount += xamount;
                }
            })
            let decimal = this.saleFormContent.decimal
            this.reconcile.actualAmount = totalExchangeAmount;
            this.reconcile.varianceAmount = parseFloat(this.reconcile.endingBalance.toFixed(decimal)) - parseFloat(totalExchangeAmount.toFixed(decimal))
        },
        // Row Number Template
        rowNumberTmpl(dataItem) {
            let ds = this.$refs.noteDS.kendoWidget(),
                index = ds.indexOf(dataItem);

            return index + 1;
        },
        // Add New Row
        addRow() {
            let ds = this.$refs.noteDS.kendoWidget(),
                last = ds.total(),
                note = new ReconcileDetailModel();

            ds.insert(last, note);
        },
        // Add Extra Row
        addExtraRow(uid) {
            let ds = this.$refs.noteDS.kendoWidget(),
                total = ds.total(),
                row = ds.getByUid(uid),
                index = ds.indexOf(row);

            if (index == total - 1) {
                this.addRow();
            }
        },
        // Remove Row
        removeRow(e) {
            e.preventDefault();

            let grid = this.$refs.noteGrid.kendoWidget(),
                ds = grid.dataSource,
                dataItem = grid.dataItem($(e.currentTarget).closest("tr"));

            if (ds.data().length > 2) {
                ds.remove(dataItem);
                this.autoCalculate();
            }
        },
        // Load Ending Balance
        loadEndingBalance() {
            let currentFiscalDate = Helper.getFiscalDateByDate(new Date());
            let sdate = currentFiscalDate.start_date,
                edate = this.reconcile.endingBalanceDate;

            if (this.reconcile.account.uuid) {
                if (sdate && edate) {
                    sdate = kendo.toString(new Date(sdate), 'yyyy-MM-dd') + 'T00:00:00.000Z';

                    edate = new Date(edate);
                    edate = kendo.toString(edate, 'yyyy-MM-dd') + 'T23:59:59.999Z';
                } else {
                    sdate = 0;
                    edate = 0;
                }

                // Clear
                this.reconcile.endingBalance = 0;
                this.reconcile.varianceAmount = 0;
                this.reconcile.reconcileEntries = [];

                // this.showLoading = true;
                // journalHandler.getEntryDetailByAccount(this.reconcile.account.uuid, {
                //     params: {
                //         start_date: sdate,
                //         end_date: edate,
                //     }
                // })
                //     .then(res => {
                //         if (!JQuery.isEmptyObject(res)) {
                //             // Bind ending balance
                //             this.reconcile.ending_balance = kendo.parseFloat(res.ending_balance);
                //
                //             // Collect entries
                //             res.entries_detail.forEach(value => {
                //                 this.reconcile.reconcile_entries.push(value.entry_uuid);
                //             })
                //
                //             this.autoCalculate();
                //         }
                //     })
                //     .finally(() => {
                //         this.showLoading = false;
                //     })
            }
        },
        // Shrink Data
        shrinkData() {
            // Date
            this.reconcile.issuedDate = Date.parse(new Date(this.reconcile.issuedDate))
            this.reconcile.endingBalanceDate = Date.parse(new Date(this.reconcile.endingBalanceDate))

            // Note
            let notes = [],
                ds = this.$refs.noteDS.kendoWidget();

            ds.data().forEach(value => {
                if (value.currency.code !== "" && value.amount > 0) {
                    notes.push(new ReconcileDetailModel(value));
                }
            });
            this.reconcile.notes = notes;

            // User
            if (this.isEdit) {
                this.reconcile.modified_by = this.user;
            } else {
                this.reconcile.created_by = this.user;
            }
        },
        // Add Journal
        addJournal() {
            let entries = [],
                debitAccount = this.reconcile.account,
                creditAccount = this.reconcile.adjustmentAccount,
                amount = Math.abs(this.reconcile.varianceAmount);

            // Variance > 0
            if (this.reconcile.varianceAmount > 0) {
                debitAccount = this.reconcile.adjustmentAccount;
                creditAccount = this.reconcile.account;
            }

            // Debit Side
            entries.push(new JournalEntryModel({
                uuid: this.debitEntryUuid,
                account: new AccountModel(debitAccount),
                account_uuid: debitAccount.uuid,
                description: this.reconcile.description,
                currency: new CurrencyModel(this.baseCurrency),
                amount: amount,
                exchange_rate: 1,// Base Currency always = 1
            }));

            // Credit Side
            entries.push(new JournalEntryModel({
                uuid: this.creditEntryUuid,
                account: new AccountModel(creditAccount),
                account_uuid: creditAccount.uuid,
                description: this.reconcile.description,
                currency: new CurrencyModel(this.baseCurrency),
                amount: amount * -1,
                exchange_rate: 1,// Base Currency always = 1
            }));

            // Adjustment Journal
            this.adjustmentJournal.uuid = this.journalId;
            this.adjustmentJournal.base_currency = this.baseCurrency;
            this.adjustmentJournal.number = this.journal.number;
            this.adjustmentJournal.journal_type = EntityType.ADJUSTMENT;
            this.adjustmentJournal.transaction_type = EntityType.CASH_RECONCILIATION;
            this.adjustmentJournal.journal_date = Helper.toISODate(this.reconcile.issuedDate);
            this.adjustmentJournal.description = this.reconcile.description;
            this.adjustmentJournal.prefix_format = this.journal.prefix_format;
            this.adjustmentJournal.is_draft = this.reconcile.is_draft;
            this.adjustmentJournal.created_by = this.reconcile.created_by;
            this.adjustmentJournal.modified_by = this.reconcile.modified_by;
            this.adjustmentJournal.segment_uuid = this.setting.segment;
            this.adjustmentJournal.is_new = true;
            // Adjustment Entries
            this.adjustmentEntries = entries;
        },
        // Validating
        validateForm() {
            let result = true,
                ds = this.$refs.noteDS.kendoWidget(),
                msg = '', countEmpty = 0;

            // Select Account and Amount
            ds.data().forEach((value, index) => {
                // No currency
                if (value.currency.code === '' && value.amount > 0) {
                    result = false;
                    msg += `<p>${i18n.t("please_select_currency_at_row_number")} ${index + 1}</p>`;
                }

                // No amount
                if (value.currency.code !== '' && value.amount === 0) {
                    result = false;
                    msg += `<p>${i18n.t("there_is_no_amount_at_row_number")} ${index + 1}</p>`;
                }

                // Count Accounts
                if (value.currency.code !== '' && value.amount > 0) {
                    countEmpty++;
                }
            });

            // Empty Row
            if (countEmpty === 0) {
                msg += `<p>${i18n.t("please_select_some_currencies")}</p>`;
                result = false;
            }

            // Show Alert
            this.errorMessage = msg;
            this.alert = false;
            if (result === false) {
                this.alert = true;
            }

            return result;
        },
        // All Saves
        async onSaveOptionClick(mode) {
            if (this.$refs.form.validate() && this.validateForm()) {
                let isValidClosingDate = await Helper.validateClosingDate(this.reconcile.issuedDate);
                if (isValidClosingDate) {
                    this.saveMode = mode;
                    this.save();
                }
            }
        },
        cancel() {
            this.$swal({
                title: i18n.t('msg_title_warning'),
                text: i18n.t('msg_discard'),
                icon: "warning",
                showCancelButton: true,
                cancelButtonText: i18n.t('cancel'),
                confirmButtonColor: "#4d4848",
                cancelButtonColor: "#ED1A3A",
                confirmButtonText: i18n.t('discard'),
            }).then((result) => {
                if (result.value) {
                    this.clear();
                    this.setDefaultData();
                    this.$router.go(-1);
                }
            });
        },
        clear() {
            this.isEdit = false;
            this.saveMode = '';

            // Entry Uuid
            this.debitEntryUuid = '';
            this.creditEntryUuid = '';

            let ds = this.$refs.noteDS.kendoWidget();
            ds.data([]);
        },
        save() {
            let self = this;

            // Shrink Data
            this.shrinkData();

            // Draft Mode
            if (this.saveMode === SaveOption.SAVEDRAFT) {
                this.reconcile.is_draft = 1;
            } else {
                this.reconcile.is_draft = 0;

                // Adjustment Journal
                if (this.reconcile.varianceAmount !== 0) {
                    this.addJournal();
                } else {
                    this.adjustmentJournal = null;
                    this.adjustmentEntries = null;
                }
            }
            // Adjustment Account
            if (this.reconcile.varianceAmount !== 0 && this.reconcile.is_draft == 0) {
                if (this.reconcile.adjustmentAccount.uuid === '') {
                    this.$snotify.error(`<p>${i18n.t("please_select_adjustment_account")}</p>`);
                    return
                }
            }
            // update count notes
            let ds = this.$refs.noteDS.kendoWidget()
            let notes = []
            if(ds.data().length > 0){
                ds.data().forEach(e => {
                    if (e.unit > 0) {
                        notes.push({
                            order: e.order,
                            currency: e.currency,
                            note: e.note,
                            unit: e.unit,
                            amount: e.amount,
                            remark: e.remark,
                            exchange_rate: e.exchange_rate,
                            exchanged_amount: e.exchanged_amount
                        })
                    }
                })
            }

            this.reconcile.countNotes = notes
            this.reconcile.session = this.activeSession
            this.reconcile.user = this.loggedUser
            this.reconcile.reconcileEntries = this.adjustmentEntries
            // remove empty
            this.removeEmptyLine()

            // Sync Data
            this.showLoading = true
            if(this.reconcile.is_draft == 0) {
                this.adjustmentJournal.journal_entries = this.adjustmentEntries
                window.console.log(this.setting, 'setting')
                window.console.log(this.adjustmentJournal, 'journal')
                journalHandler.save(new JournalModel(this.adjustmentJournal))
                this.reconcile.journalId = this.journalId
                sessionHandler.reconcileCreate(new ReconcileModel(self.reconcile)).then(function (res) {
                    self.responseStatus(res.status);
                })
            }else{
                this.activeSession.countNotes = notes
                this.activeSession.adjustmentAccount = this.reconcile.adjustmentAccount
                window.console.log(this.activeSession, 'b')
                sessionHandler.create(new SessionModel(this.activeSession)).then(function () {
                    self.showLoading = false
                    self.$swal({
                        position: 'products',
                        icon: 'success',
                        title: 'Your work has been saved',
                        showConfirmButton: true,
                    }).then((result) => {
                        if (result.value) {
                            self.$router.push(`${i18n.locale}`)
                        }
                    })
                })
            }
        },
        // Response Status
        responseStatus(status) {
            window.console.log(status)
            switch (status) {
                case 201: // Ok
                    this.showAlert();
                    break;
                case 202: // Duplicate
                    Helper.alertErrorMsg("Duplicate entry!");
                    break;
                default:
                    break;
            }
            this.showLoading = false
        },
        // Sweetalert2
        changeAlertStatus() {
            this.loadingAlert = true
            setTimeout(() => {
                this.loadingAlert = false
            }, 6200);
        },
        showAlert() {
            this.showLoading = false;
            this.changeAlertStatus();
            this.loadingTextAlert = "Added Successful";
            this.loadingColorAlert = "#3DA72E";
            switch (this.saveMode) {
                case 'saveClose':// Save Close
                    this.$swal({position: 'products', icon: 'success', title: 'Your work has been saved', showConfirmButton: true, }).then((result) => { if (result.value) { this.$router.push(`${i18n.locale}`) }
                    })
                    // if (this.isEdit) {
                    //     this.goBackToViewPage();
                    // } else {
                        // this.$router.go(-1);
                        this.$router.push(`${i18n.locale}`);
                    // }

                    this.clear();
                    this.setDefaultData();
                    break
                default:// Save New
                    // this.$swal({
                    // 	position: 'products',
                    // 	icon: 'success',
                    // 	title: 'Your work has been saved',
                    // 	showConfirmButton: false,
                    // 	timer: 1500
                    // })
                    this.clear();
                    this.setDefaultData();
                    break
            }
        },
        // Go back to view page after edit mode
        getReconcile() {
            return new ReconcileModel(this.reconcile);
        },
        goBackToViewPage() {
            this.$router.replace({
                name: 'Cash Reconciliation View',
                params: {initCashReconciliation: this.getReconcile()}
            });
        },
        async loadSetting() {
            sessionHandler.cashierSetting().then(res => {
                if (res.data.statusCode === 200) {
                    const data = res.data.data.filter((obj) => {return obj.user.email == cookie.email})
                    window.console.log(data, 'setting')
                    if (data.length > 0) {
                        this.setDefaultData()
                        this.reconcile.account = data[0].paymentOption.account
                        this.notes = data[0].countNotes
                        this.setting = data[0]
                    }else{
                        this.$snotify.error('Please setup setting!')
                        this.$router.push(`${i18n.locale}` + '/setting');
                    }
                }
            })
            this.checkSession()
        },
        checkSession(){
            this.showLoading = true
            let data = {
                user_name : cookie.email
            }
            sessionHandler.checkSession(data).then(res => {
                this.showLoading = false
                if(res.data.data.length > 0){
                    this.hasSession = true
                    this.activeSession = res.data.data[0]
                    window.console.log(this.activeSession, 'active session')
                    this.reconcile.session = this.activeSession
                    this.loadTxn()
                }else{
                    this.$snotify.error('Please start session!')
                    this.$router.push(`${i18n.locale}`);
                }
            }).catch(e => {
                this.showLoading = false
                this.$snotify.error('Something went wrong')
                this.errors.push(e)
                window.console.log(e)
            })
        },
        loadTxn(){
            this.showLoading = true
            sessionHandler.getTxnBySession(this.activeSession.pk).then(res => {
                this.showLoading = false
                this.reconcile.endingBalance = 0
                this.reconcile.varianceAmount = 0
                if(res.data.data.length > 0){
                    let data = res.data.data
                    let totalR = 0
                    data.forEach(e => {
                        totalR += parseFloat(e.paidAmount)
                    })
                    this.reconcile.endingBalance = totalR
                    this.reconcile.varianceAmount = totalR
                    if(Object.keys(this.activeSession.countNotes).length > 0){
                        this.notes = []
                        this.notes = this.activeSession.countNotes
                        setTimeout(() => {
                            this.reconcile.adjustmentAccount = this.activeSession.adjustmentAccount
                            this.autoCalculate()
                        }, 500)
                    }
                }else{
                    this.$snotify.error('មិនមានទទួលប្រាក់!')
                    this.$router.push(`${i18n.locale}`);
                }
            }).catch(e => {
                this.showLoading = false
                this.$snotify.error('Something went wrong')
                this.errors.push(e)
                window.console.log(e)
            })
        },
        async loadAccount() {
            this.showLoading = true
            accountHandler.getAll().then(res => {
                this.showLoading = false
                this.loadSetting()
                //Receivable Account
                this.listAccounts = res.filter((m) => {return m.account_type.number == 40 })
                //.filter(m => m.account_type.number === 40).map(itm => {
                //     return {
                //         id: itm.uuid,
                //         name: itm.name,
                //         local_name: itm.local_name,
                //         number: itm.number,
                //         is_taxable: itm.is_taxable,
                //         banhjiAccCode: itm.banhjiAccCode,
                //         group_code: itm.group_code,
                //         parent_account: itm.parent_account,
                //         type_code: itm.type_code,
                //         uuid: itm.uuid,
                //     }
                // })
            })
        },
        async loadSingleData() {
            window.console.log(this.$route.name, 'rout name')
            if (this.$route.name === 'Reconcile') {
                this.notes = []
                this.initialData();
            }
        },
        async loadSaleFormContent() {
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved');
                    saleFormContentHandler.list().then(res => {
                        if (res.data.statusCode === 200) {
                            const data = res.data.data
                            if (data.length > 0) {
                                this.saleFormContent = data[0]
                            }
                        }
                    })
                }, 10)
            })
        },
        numFormat(value) {
            value = parseFloat(value)
            value = parseFloat(value.toFixed(this.saleFormContent.decimal))
            return kendo.toString(value, 'n' + this.saleFormContent.decimal)
        },
        removeEmptyLine() {
            let ds = this.$refs.noteDS.kendoWidget()
            let notes = []
            this.notes = []
            if(ds.data().length > 0){
                ds.data().forEach(e => {
                    if (e.unit > 0) {
                        notes.push({
                            order: e.order,
                            currency: e.currency,
                            note: e.note,
                            unit: e.unit,
                            amount: e.amount,
                            remark: e.remark,
                            exchange_rate: e.exchange_rate,
                            exchanged_amount: e.exchanged_amount
                        })
                    }
                })
            }
            this.notes = notes
            // const grid = $("#noteGrid").data("kendoGrid"),
            //     dataSource = grid.dataSource
            // dataSource.data().forEach(m => {
            //     window.console.log(m, 'empty')
            //     if (m.unit == 0) {
            //         dataSource.remove(m)
            //     }
            // })
        },
        async loadBaseCurrency() {
            new Promise(resolve => {
                setTimeout(() => {
                    instituteHandler.getOneCompany(cookie.instituteId).then(res => {
                        this.baseCurrency = res.baseCurrency
                    })
                    resolve('resolved');
                }, 200);
            });
        },
        // Number
		async generateJNumber() {
            let num = await Helper.generateAccountingNumber(
                'cash_reconciliation',
                this.journal.journal_date
            );

            this.journal.number = num.number;
            this.journal.prefix_format = num.prefix_format;
            window.console.log(this.journal, 'journal num get')
		},
    },
    watch: {
        '$route': 'loadSingleData',
    },
    created() {
        this.loadExchangeRate();
    },
    mounted() {
        // Initial Data
        this.loadSingleData();
        this.loadSaleFormContent()
        this.loadBaseCurrency()
        this.generateJNumber()
    },
};
</script>

<style scoped>
.block-green {
    text-transform: uppercase;
}

@media (min-width: 1264px) {
    .container {
        max-width: 1080px !important;
    }
}
</style>