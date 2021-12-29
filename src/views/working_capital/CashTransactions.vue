<template>
    <v-app>
        <v-container>
            <v-row>
                <v-col cols="12" sm="12">
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <v-card outlined dense class="pa-4 no_border rounded-sm" color="white">
                            <v-card outlined dense class="no_border">
                                <h2 class="mb-0">{{$t('cash_transaction')}}</h2>
                                <v-icon
                                        onclick="window.history.go(-1); return false;"
                                        style="cursor: pointer; color: #333; font-size: 40px;"
                                        class="float-right"
                                >close
                                </v-icon>
                            </v-card>
                            <v-card outlined dense class="px-3 no_border" color="grayBg">
                                <v-row class="">
                                    <v-col sm="4" cols="12" class="pb-0">
                                        <label class="label">{{$t('date')}}</label>
                                        <app-datepicker 
											:initialDate="journal.journal_date" 
											@emitDate="journal.journal_date = $event" 
											@onChanged="getExchangeRate" />

                                        <label class="label">{{$t('transaction_type')}}</label>
                                        <v-select class="mt-1"
                                            @change="generateNumber"
                                            :items="cashTransactionTypes"
                                            v-model="journal.transaction_type"
                                            item-value="value"
                                            item-text="text"
                                            no-data-text="No data found."
                                            required
                                            outlined />

                                    </v-col>
                                    <v-col sm="4" cols="12" class="pb-0">
                                        <label class="label">{{$t('number')}}</label>
                                        <v-row>
                                            <v-col sm="10" cols="10" class="pb-0 pr-0 pt-1">
                                                <v-text-field
                                                    v-model="journal.number"
                                                    outlined
                                                    :rules="[v => !!v || 'Number is required']"
													readonly
                                                    required />
                                            </v-col>
                                            <v-col sm="2" cols="2" class="pb-0 pl-0 pt-1">
                                                <v-icon color="black" size="30" class="border_qrcode" @click="generateNumber">mdi-qrcode</v-icon>
                                            </v-col>
                                        </v-row>

                                        <label class="label">{{$t('txn_currency')}}</label>
                                        <app-currency-dropdownlist
                                            :initCurrency="currency"
                                            @emitCurrency="currency = $event"
                                            @onChanged="getExchangeRate"
                                        />
                                    </v-col>
                                    <v-col sm="4" cols="12" class="pb-0">
                                        <label class="label">{{$t('description')}}</label>
                                        <v-textarea class=" mt-1" height="120px" no-resize
                                            v-model="journal.description"
                                            outlined
                                            rows="4"
                                            :placeholder="$t('transaction_purpose')"
                                        />

                                    </v-col>
                                </v-row>
                            </v-card>

                            <v-card outlined dense class="no_border" color="white">
                                <v-row style="background-color: rgb(255, 255, 255); width: 100%; margin: 0 auto 0px;">
                                    <v-col sm="12" cols="12" class="pb-3 pa-0">
                                        <v-row>
                                            <v-col sm="1" cols="12" class="pt-0">
                                                <h2 class="mb-0">{{$t('from_to')}}</h2>
                                            </v-col>
                                            <v-col sm="3" cols="12" class="pt-0 pr-0">
                                                <v-checkbox class="ma-0 pt-3  float-left"
                                                    v-model="useFromBank"
                                                    @change="setAccountByFromBank"
                                                />
                                                <p class="mb-0 mt-3">{{$t('select_bank')}}</p>
                                            </v-col>
                                            <v-col sm="3" cols="12" class=" pl-0">
                                                <v-select class="mt-1"
                                                    v-if="useFromBank"
                                                    placeholder="Select Bank"
                                                    v-model="fromBankId"
                                                    :items="bankAccounts"
                                                    item-text="bank.name"
                                                    item-value="bank.uuid"
                                                    @change="setAccountByFromBank"
                                                    outlined>
                                                    <template slot="selection" slot-scope="{ item }">
                                                        {{ item.bank.abbr }} - {{ item.bank.name }}
                                                    </template>
                                                    <template slot="item" slot-scope="{ item }">
                                                        {{ item.bank.abbr }} - {{ item.bank.name }}
                                                    </template>
                                                </v-select>
                                            </v-col>
                                        </v-row>
                                        <kendo-datasource ref="fromDS"
                                            :data="fromAccountEntries"
                                            :change="onFromDSChanges" />

                                        <kendo-grid id="fromGrid"
                                            ref="fromGrid" 
                                            class="grid-function"
                                            :data-source-ref="'fromDS'" 
                                            :sortable="false" 
                                            :filterable="false" 
                                            :column-menu="true" 
                                            :editable="true"
                                            :scrollable-virtual="true"
                                        >
                                            <kendo-grid-column
                                                :title="$t('no.')"
                                                :template="rowNumberTmplFrom"
                                                :width="45"
                                                :column-menu="false"
                                                :headerAttributes="{
                                                    style: 'background-color: #EDF1F5;',
                                                    class: 'text-products'
                                                }"
                                                :attributes="{
                                                    style: 'text-align: products'
                                                }"/>
                                            <kendo-grid-column 
                                                :field="'account'" 
                                                :title="$t('account')"
                                                :width="200"
                                                :template="'<span>#=account.name#</span>'"
                                                :editor="fromAccountEditor" 
                                                :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>
                                            <kendo-grid-column
                                                :field="'description'"
                                                :title="$t('description')"
                                                :width="200"
                                                :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>
                                            <kendo-grid-column
                                                :field="'ref_number'"
                                                :title="$t('reference_no')"
                                                :width="160"
                                                :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>
                                            <kendo-grid-column
                                                :field="'amount'"
                                                :title="$t('amount')"
                                                :format="'{0:n}'"
                                                :width="150"
                                                :headerAttributes="{style: 'text-align: right; background-color: #EDF1F5'}"
                                                :attributes="{style: 'text-align: right; '}"/>
                                            <kendo-grid-column
                                                :command="{ iconClass: 'k-icon k-i-trash', text: 'Delete', click: removeRowFrom, class: 'btn-plus' }"
                                                :title="'&nbsp;'"
                                                :width="100"
                                                :headerAttributes="{
                                                    style: 'text-align: right; background-color: #EDF1F5'
                                                }"
                                            />
                                        </kendo-grid>
                                        <v-row style="background-color: #fff;">
                                            <v-col sm="1" cols="12" class="pb-0">
                                                <v-btn class="float-left rounded-0 btn_plus" @click="addRowFrom">
                                                    <v-icon size="" class="ma-1">mdi-plus</v-icon>
                                                </v-btn>
                                            </v-col>
                                            <v-col sm="4" cols="12" class="pb-0">
                                                <template>
                                                    <v-file-input class="mt-0 pt-0 " sm="3" cols="6"
                                                                :placeholder="$t('attachment')"
                                                                multiple
                                                                prepend-icon="mdi-paperclip"
                                                    >
                                                        <template v-slot:selection="{ text }">
                                                            <v-chip
                                                                    small
                                                                    label
                                                                    color="primary"
                                                            >
                                                                {{ text }}
                                                            </v-chip>
                                                        </template>
                                                    </v-file-input>
                                                </template>
                                            </v-col>

                                        </v-row>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col sm="12" cols="12" class="py-0">
                                        <v-row>
                                            <v-col sm="1" cols="12" class="pt-0">
                                                <h2 class="mb-0">{{$t('to_from')}}</h2>
                                            </v-col>
                                            <v-col sm="3" cols="12" class="pt-0 pr-0">
                                                <v-checkbox class="ma-0 pt-2  float-left"
                                                    v-model="useToBank"
                                                    @change="setAccountByToBank"
                                                />
                                                <p class="mb-0 mt-2 ">{{$t('select_bank')}}</p>
                                            </v-col>
                                            <v-col sm="3" cols="12" class="pt-0 pl-0">
                                                <v-select class="mt-1"
                                                    v-if="useToBank"
                                                    placeholder="Select Bank"
                                                    v-model="toBankId"
                                                    :items="bankAccounts"
                                                    item-text="bank.name"
                                                    item-value="bank.uuid"
                                                    @change="setAccountByToBank"
                                                    outlined>
                                                    <template slot="selection" slot-scope="{ item }">
                                                        {{ item.bank.abbr }} - {{ item.bank.name }}
                                                    </template>
                                                    <template slot="item" slot-scope="{ item }">
                                                        {{ item.bank.abbr }} - {{ item.bank.name }}
                                                    </template>
                                                </v-select>
                                            </v-col>
                                        </v-row>
                                        <kendo-datasource ref="toDS"
                                            :data="toAccountEntries"
                                            :change="onToDSChanges" />

                                        <kendo-grid id="toGrid"
                                            ref="toGrid" 
                                            class="grid-function"
                                            :data-source-ref="'toDS'" 
                                            :sortable="false" 
                                            :filterable="false" 
                                            :column-menu="true" 
                                            :editable="true"
                                            :scrollable-virtual="true"
                                        >
                                            <kendo-grid-column
                                                :title="$t('no.')"
                                                :template="rowNumberTmplTo"
                                                :width="45"
                                                :column-menu="false"
                                                :headerAttributes="{
                                                    style: 'background-color: #EDF1F5;',
                                                    class: 'text-products'
                                                }"
                                                :attributes="{
                                                    style: 'text-align: products'
                                                }"/>
                                            <kendo-grid-column 
                                                :field="'account'" 
                                                :title="$t('account')"
                                                :width="200"
                                                :template="'<span>#=account.name#</span>'"
                                                :editor="toAccountEditor" 
                                                :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>
                                            <kendo-grid-column
                                                :field="'description'"
                                                :title="$t('description')"
                                                :width="200"
                                                :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>
                                            <kendo-grid-column
                                                :field="'ref_number'"
                                                :title="$t('reference_no')"
                                                :width="160"
                                                :headerAttributes="{
                                                    style: 'background-color: #EDF1F5'
                                                }"/>
                                            <kendo-grid-column
                                                :field="'amount'"
                                                :title="$t('amount')"
                                                :format="'{0:n}'"
                                                :width="150"
                                                :headerAttributes="{style: 'text-align: right; background-color: #EDF1F5'}"
                                                :attributes="{style: 'text-align: right; '}"/>
                                            <kendo-grid-column
                                                :command="{ iconClass: 'k-icon k-i-trash', text: 'Delete', click: removeRowTo, class: 'btn-plus' }"
                                                :title="'&nbsp;'"
                                                :width="100"
                                                :headerAttributes="{
                                                    style: 'text-align: right; background-color: #EDF1F5'
                                                }"
                                            />
                                        </kendo-grid>
                                        <v-row style="background-color: #fff;">
                                            <v-col sm="1" cols="12" class="pb-0">
                                                <v-btn class="float-left rounded-0 btn_plus" @click="addRowTo">
                                                    <v-icon size="" class="ma-1">mdi-plus</v-icon>
                                                </v-btn>
                                            </v-col>
                                            <v-col sm="5" cols="12" class="pb-0">
                                                <template>
                                                    <v-file-input class="mt-0 pt-0 " sm="3" cols="6"
                                                                :placeholder="$t('attachment')"
                                                                multiple
                                                                prepend-icon="mdi-paperclip"
                                                    >
                                                        <template v-slot:selection="{ text }">
                                                            <v-chip
                                                                    small
                                                                    label
                                                                    color="primary"
                                                            >
                                                                {{ text }}
                                                            </v-chip>
                                                        </template>
                                                    </v-file-input>
                                                </template>
                                            </v-col>
                                            <v-col sm="3" cols="12" class=" pb-0 pt-5">
                                                <p>
                                                    <span class="float-left">{{$t('total_from')}}</span>
                                                    <span class="float-right text-bold" v-text="totalFrom" />
                                                </p>
                                            </v-col>
                                            <v-col sm="3" cols="12" class="pb-0  pt-5">
                                                <p>
                                                    <span class="float-left">{{$t('total_to')}}</span>
                                                    <span class="float-right text-bold" v-text="totalTo" />
                                                </p>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>

                                <v-divider/>
                                <v-card outlined dense class="no_border function_footer">
                                    <!-- Warning Message -->
                                    <v-alert type="warning"
                                        v-model="alert"
                                        dismissible>
                                        <span v-html="errorMessage"/>
                                    </v-alert>
                                    
                                    <v-menu>
                                        <template v-slot:activator="{ on }">
                                            <v-btn color="black" outlined class="mr-2 text-capitalize rounded-pill black--text float-left" v-on="on" >
                                                {{$t('select_template')}}
                                                <v-icon size="" class="ma-1">expand_more</v-icon>
                                            </v-btn>
                                        </template>
                                        <v-list>
                                            <v-list-item v-for="(item, index) in templates" :key="index" >
                                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                    <v-btn color="black" class="text-capitalize rounded-pill white--text float-left" @click="cancel">{{$t('cancel')}}</v-btn>
                                    <v-menu>
                                        <template v-slot:activator="{ on }">
                                            <v-btn color="primary" class="ml-2 float-right text-capitalize rounded-pill white--text" v-on="on" >
                                                {{$t('save_option')}}
                                                <v-icon size="" class="ma-1">expand_more</v-icon>
                                            </v-btn>
                                        </template>
                                        <v-list rounded>
                                            <v-list-item-group >
                                                <v-list-item v-if="!isEdit">
                                                    <v-list-item-content>
                                                        <v-list-item-title @click="onSaveOptionClick(SaveOption.SAVENEW)">{{$t('save_new')}}</v-list-item-title>
                                                    </v-list-item-content>
                                                </v-list-item>
                                                <v-list-item>
                                                    <v-list-item-content>
                                                        <v-list-item-title @click="onSaveOptionClick(SaveOption.SAVEPRINT)">{{$t('save_print')}}</v-list-item-title>
                                                    </v-list-item-content>
                                                </v-list-item>
                                                <v-list-item>
                                                    <v-list-item-content>
                                                        <v-list-item-title @click="onSaveOptionClick(SaveOption.SAVEDRAFT)">{{$t('save_draft')}}</v-list-item-title>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </v-list-item-group>
                                        </v-list>
                                    </v-menu>
                                    <v-btn color="secondary" class="float-right  white--text text-capitalize rounded-pill" @click="onSaveOptionClick(SaveOption.SAVECLOSE)">{{$t('save_close')}}</v-btn>

                                </v-card>
                            </v-card>
                        </v-card>
                    </v-form>
                </v-col>
            </v-row>
            <LoadingMe
                    :isLoading="showLoading"
                    :fullPage="true"
                    :myLoading="true"
                    :alertMessage="loadingAlert"
                    :color="loadingColorAlert"
                    :alertText="loadingTextAlert"/>
        </v-container>
    </v-app>
</template>

<script>
    import {i18n} from '@/i18n';
	import kendo from "@progress/kendo-ui";
	import Helper from "@/helper.js";
	import {
		JournalModel,
		JournalEntryModel,
		CurrencyModel,
		ExchangeRateModel,
		AccountModel,
		UserModel,
	} from "@/scripts/model/AppModels";

	const $ = require("jquery");
	const store = require("@/institute.js");
	const { templates, institute, cookies } = store.default.state;
	const {
		accountHandler,
		journalHandler,
		bankAccountHandler,
	} = require("@/scripts/AppHandlers");
	const { EntityType, SaveOption } = require("@/scripts/default_setup/Collections");

    export default {
        name: "CashTransaction",
        components:{
			"LoadingMe": () => import('@/components/Loading'),
			"app-datepicker": () => import('@/components/custom_templates/DatePickerComponent'),
			"app-currency-dropdownlist": () => import('@/components/kendo_templates/CurrencyDropDownList'),
		},
		props: {
			initJournal: {
				type: JournalModel
			},
		},
		data: () => ({
			/* Obj */
			journal: new JournalModel(),
			currency		: new CurrencyModel(institute.baseCurrency),
			exchangeRate	: new ExchangeRateModel(institute.baseCurrency),
			journalEntries: [],
			fromAccountEntries : [],
			toAccountEntries   : [],
			// Accounts
			accounts: [],
			fromAccounts: [],
			toAccounts: [],
			// Banks
			useFromBank 	: false,
			useToBank 		: false,
			bankAccounts 	: [],
			fromBankId 		: '',
			toBankId 		: '',
			cashTransactionTypes: EntityType.CASH_TRANSACTION_TYPES,
			// Other
			totalFrom       : 0,
			totalTo         : 0,
			templates: templates,
			user: new UserModel(cookies.user),
			// Form validation
			valid: true,
			isEdit: false,
			alert: false,
			errorMessage: "",
			saveMode: "",
			SaveOption: SaveOption,
			// LoadingMe
			showLoading: false,
			loadingAlert: false,
			loadingColorAlert: "",
			loadingTextAlert: "",
        }),
        methods:  {
			// Initial Data
			initialData(){
				if(this.initJournal){// Edit Mode
					this.journal = this.initJournal;
					this.bindData();
				}else{// Brand New Mode
					this.setDefaultData();
				}
			},
			// Set default data
			setDefaultData () {
				// Brand New Mode
				this.isEdit = false;

				this.journal = new JournalModel({
					journal_type: EntityType.AUTO_JOURNAL,
					transaction_type: EntityType.CASH_TRANSACTION_TYPES[0].value,
					journal_date: new Date().toISOString().substr(0, 10),
				});

				// Generate Number
				this.generateNumber();

				// Add two default rows
				for (let index = 0; index < 2; index++) {
					this.addRowFrom();
					this.addRowTo();
				}
			},
			// Bind data from prop for edit mode
			bindData() {
				// Edit Mode
				this.isEdit = true;

				// Currency
				this.currency = new CurrencyModel(this.journal.journal_entries[0].currency);
				this.exchangeRate = new ExchangeRateModel(this.journal.journal_entries[0].currency);
				this.exchangeRate.id = this.journal.journal_entries[0].exchange_rate_uuid;
				this.exchangeRate.rate = this.journal.journal_entries[0].exchange_rate;

				let totalFrom = 0,
					totalTo = 0,
					fromEntries = [],
					toEntries = [];

				this.journal.journal_entries.forEach(value => {
					let je = new JournalEntryModel(value);

					if(value.amount > 0){// Dr side
						fromEntries.push(je);
						totalFrom += value.amount;
					}else{// Cr side
						je.amount = Math.abs(value.amount);
						toEntries.push(je);
						totalTo += je.amount;
					}
				});
				this.totalFrom = totalFrom;
				this.totalTo = totalTo;
				this.fromAccountEntries = fromEntries;
				this.toAccountEntries = toEntries;
			},
			// Number
			async generateNumber() {
				if(!this.isEdit){
					let num = await Helper.generateAccountingNumber(this.journal.transaction_type, this.journal.journal_date);
					
					this.journal.number = num.number;
					this.journal.prefix_format = num.prefix_format;
				}
            },
			// Get Exchange Rate
			async getExchangeRate() {
				if(this.journal.journal_date && this.currency.code !== ''){
					this.exchangeRate = await Helper.getLastExchangeRateByDate(this.journal.journal_date, this.currency.code);
				}else{
					this.exchangeRate = new ExchangeRateModel(institute.baseCurrency);
				}
			},
			/* Kendo */
			// DataSource Changes
			onFromDSChanges (e) {
				if(e.field){
					let dataRow = e.items[0];

					if (e.field === "account") {
						this.addExtraRowFrom(dataRow.uid);
					}

					this.dataSourceAutoCalculate();
				}
			},
			onToDSChanges (e) {
				if(e.field){
					let dataRow = e.items[0];
					
					if (e.field === "account") {
						this.addExtraRowTo(dataRow.uid);
					}

					this.dataSourceAutoCalculate();
				}
			},
			// Grid Custom Editor
			fromAccountEditor(container, options) {
				return Helper.accountEditor(container, options, this.fromAccounts);
			},
			toAccountEditor(container, options) {
				return Helper.accountEditor(container, options, this.toAccounts);
			},
			// Auto Calculate In DataSource
			dataSourceAutoCalculate () {
				let fromDS = this.$refs.fromDS.kendoWidget(),
					toDS = this.$refs.toDS.kendoWidget(),
					totalFrom = 0, totalTo = 0;
				
				// Sum
				fromDS.data().forEach(value => {
					totalFrom += kendo.parseFloat(value.amount)
				})
				toDS.data().forEach(value => {
					totalTo += kendo.parseFloat(value.amount)
				})

				this.totalFrom = totalFrom;
				this.totalTo = totalTo;
			},
			// Row Number Template
			rowNumberTmplFrom (dataItem) {
				let ds = this.$refs.fromDS.kendoWidget(),
					index = ds.indexOf(dataItem);

				return index + 1;
            },
            rowNumberTmplTo (dataItem) {
				let ds = this.$refs.toDS.kendoWidget(),
					index = ds.indexOf(dataItem);

				return index + 1;
			},
			// Add New Row
			addRowFrom () {
				let ds = this.$refs.fromDS.kendoWidget(),
					last = ds.total(),
					je = new JournalEntryModel();

				ds.insert(last, je);
            },
            addRowTo () {
				let ds = this.$refs.toDS.kendoWidget(),
					last = ds.total(),
					je = new JournalEntryModel();

				ds.insert(last, je);
			},
			// Add Extra Row
			addExtraRowFrom (uid) {
				let ds = this.$refs.fromDS.kendoWidget(),
					total = ds.total(),
					row = ds.getByUid(uid),
					index = ds.indexOf(row);

				if(index == total - 1){
					this.addRowFrom();
				}
            },
            addExtraRowTo (uid) {
				let ds = this.$refs.toDS.kendoWidget(),
					total = ds.total(),
					row = ds.getByUid(uid),
					index = ds.indexOf(row);

				if(index == total - 1){
					this.addRowTo();
				}
			},
			// Remove Row
			removeRowFrom (e) {
				e.preventDefault();

				let grid = this.$refs.fromGrid.kendoWidget(),
					ds = grid.dataSource,
					dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
				
				if(ds.data().length > 2){
					ds.remove(dataItem);
				}
            },
            removeRowTo (e) {
				e.preventDefault();

				let grid = $("#toGrid").data("kendoGrid"),
					ds = grid.dataSource,
					dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
				
				if(ds.total() > 2){
					ds.remove(dataItem);
				}
			},
			// Set Account By Bank
			setAccountByFromBank(){
				let ds = this.$refs.fromDS.kendoWidget();
				ds.data([]);

				// On use bank checkbox changes
				if(!this.useFromBank){
					this.fromBankId = '';
				}

				// On bank dropdownlist changes
				if(this.fromBankId !== ''){
					this.fromAccounts = this.getAccountByBankId(this.fromBankId);
				} else {
					this.fromAccounts = this.accounts;
				}

				this.addRowFrom();
				this.addRowFrom();
			},
			setAccountByToBank(){
				let ds = this.$refs.toDS.kendoWidget();
				ds.data([]);

				// On use bank checkbox changes
				if(!this.useToBank){
					this.toBankId = '';
				}

				// On bank dropdownlist changes
				if(this.toBankId !== ''){
					this.toAccounts = this.getAccountByBankId(this.toBankId);
				} else {
					this.toAccounts = this.accounts;
				}

				this.addRowTo();
				this.addRowTo();
			},
			// Get account by bank Id
			getAccountByBankId(bankId){
				let accounts = [];

				this.bankAccounts.forEach(value => {
					if(value.bank.uuid === bankId){
						accounts.push(new AccountModel(value.account));
					}
				});

				return accounts;
			},
			// Shrink Data
			shrinkData () {
				// Journal Date
				this.journal.journal_date = Helper.toISODate(this.journal.journal_date);
				
				// User
				if (this.isEdit) {
					this.journal.modified_by = this.user;
				} else {
					this.journal.created_by = this.user;
				}
				
				let entries = [],
					fromDS = this.$refs.fromDS.kendoWidget(),
					toDS = this.$refs.toDS.kendoWidget();

				// Filter From Account on Dr
				toDS.data().forEach(value => {
					if(value.account.number !== "" && value.amount > 0){// Filter selected account
						value.set("account_uuid", value.account.uuid);
						// Currency
						value.set("currency", new CurrencyModel(this.currency));
						value.set("exchange_rate_uuid", this.exchangeRate.id);
						value.set("exchange_rate", this.exchangeRate.rate);
						entries.push(new JournalEntryModel(value));
					}
				})
				// Filter To Account on Cr
				fromDS.data().forEach(value => {
					if(value.account.number !== "" && value.amount > 0){// Filter selected account
						value.set("account_uuid", value.account.uuid);
						// Currency
						value.set("currency", new CurrencyModel(this.currency));
						value.set("amount", value.amount * -1); // Credit Side is negative
						value.set("exchange_rate_uuid", this.exchangeRate.id);
						value.set("exchange_rate", this.exchangeRate.rate);

						entries.push(new JournalEntryModel(value));
					}
				})

				// Journal Entries
				this.journal.journal_entries = entries;
			},
			// Validating
			validateForm () {
				let result = true,
					fromDS = this.$refs.fromDS.kendoWidget(),
					toDS = this.$refs.toDS.kendoWidget(),
					msg = '', countEmptyFrom = 0, countEmptyTo = 0;

				//FROM
				fromDS.data().forEach((value, index) => {
					// No account
                    if(value.account.name === '' && value.amount > 0){
                        result = false;
                        msg += `<p>${i18n.t("please_select_from_account_at_row_number")} ${index + 1}</p>`;
                    }

                    // No amount
                    if(value.account.name !== '' && value.amount === 0){
                        result = false;
                        msg += `<p>${value.account.name} ${i18n.t("has_no_amount")}</p>`;
                    }

                    // Count From Accounts
                    if(value.account.name !== '' && value.amount > 0){
                        countEmptyFrom++;
                    }
				})
				
				// Empty Row From Accounts
				if(countEmptyFrom === 0){
					msg += `<p>${i18n.t("please_select_from_account")}</p>`;
					result = false;
				}

				//TO
				toDS.data().forEach((value, index) => {
					// No account
                    if(value.account.name === '' && value.amount > 0){
                        result = false;
                        msg += `<p>${i18n.t("please_select_to_account_at_row_number")} ${index + 1}</p>`;
                    }

                    // No amount
                    if(value.account.name !== '' && value.amount === 0){
                        result = false;
                        msg += `<p>${value.account.name} ${i18n.t("has_no_amount")}</p>`;
                    }

                    // Count To Accounts
                    if(value.account.name !== '' && value.amount > 0){
                        countEmptyTo++;
                    }
				})
				
				// Empty Row To
				if(countEmptyTo === 0){
					msg += `<p>${i18n.t("please_select_to_account")}</p>`;
					result = false;
				}

				// Balance From and To
				if(kendo.parseFloat(this.totalFrom) !== kendo.parseFloat(this.totalTo)){
					msg += `<p>${i18n.t("total_from_and_total_to_is_not_balance")}</p>`;
					result = false;
				}

				// Show Alert
				this.errorMessage = msg;
				this.alert = false;
				if(result===false){
					this.alert = true;
				}
				
				return result;
			},
			// All Saves
			async onSaveOptionClick(mode) {
				if (this.$refs.form.validate() && this.validateForm()) {
					let isValidClosingDate = await Helper.validateClosingDate(this.journal.journal_date);
					if (isValidClosingDate) {
						this.saveMode = mode;
						this.save();
					}
				}
			},
			cancel () {
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
			clear () {
				this.isEdit = false;
				this.saveMode = '';
				
				this.useFromBank = false;
				this.useToBank = false;

				this.currency = new CurrencyModel(institute.baseCurrency);
				this.exchangeRate = new ExchangeRateModel(institute.baseCurrency);

				let fromDS = this.$refs.fromDS.kendoWidget();
                fromDS.data([]);
                let toDS = this.$refs.toDS.kendoWidget();
                toDS.data([]);
			},
			save () {
                let self = this;
				
				// Draft Mode
				if (this.saveMode === SaveOption.SAVEDRAFT) {
					this.journal.is_draft = 1;
				} else {
					this.journal.is_draft = 0;
				}

				// Shrink Data
				this.shrinkData();

				// Sync Data
				this.showLoading = true
				journalHandler
					.save(new JournalModel(this.journal))
					.then((response) => {
						if (response) {
							self.responseStatus(response.status);
						}
					})
					.catch((error) => {
						Helper.alertErrorMsg(error);
					})
					.finally(() => {
                        self.showLoading = false;
                    });
			},
			// Response Status
			responseStatus(status) {
				switch (status) {
					case 200: // Ok
						this.showAlert();
						break;
					case 201: // Duplicate
						Helper.alertErrorMsg("Duplicate entry!");
						break;
					default:
						break;
				}
			},
			// Sweetalert2
			changeAlertStatus(){
				this.loadingAlert = true
				setTimeout(() => {
					this.loadingAlert = false
				}, 6200);
			},
			showAlert () {
				this.changeAlertStatus()
				this.loadingTextAlert ="Added Successful"
				this.loadingColorAlert ="#3DA72E"
				switch(this.saveMode) {
					case 'saveClose':// Save Close
						// this.$swal({
						// 	position: 'products',
						// 	icon: 'success',
						// 	title: 'Your work has been saved',
						// 	showConfirmButton: true,
						// }).then((result) => {
						// 	if (result.value) {
						// 		window.history.go(-1)
						
						// 		return false
						// 	}
						// })
						if(this.isEdit){
							this.goBackToViewPage();
						}else{
							this.$router.go(-1);
						}

						this.clear();
						this.setDefaultData();
						break;
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
						break;
				}
			},
			// Go back to view page after edit mode
			getJournal(){
				return new JournalModel(this.journal);
			},
			goBackToViewPage(){
				this.$router.replace({ name: 'Cash Transaction View', params: { initJournal: this.getJournal() } });
			},
		},
		watch: {
			initJournal () {
				this.initialData();
			},
		},
		created () {
			// Account
			accountHandler.getAll()
			.then(res => {
				this.accounts = res;
				this.fromAccounts = res;
				this.toAccounts = res;
			})

			// Bank Account
			bankAccountHandler.getAll()
			.then(res => {
				this.bankAccounts = res;
			})
		},
		mounted () {
			// Initial Data
			this.initialData();
		}
    };
</script>

<style scoped>
    .function_content {
        padding: 0 25px 25px;
        border-bottom: 0;
    }
    .attachment_table.theme--light.v-data-table{
        background-color: transparent !important;
    }
    .from_to{
        font-size: 26px !important;
    }

    @media (min-width: 1264px) {
        .container {
            /* max-width: 1185px; */
            max-width: 1080px !important;
        }
    }

    @media (max-width: 576px) {
        .mb-6 {
            margin-bottom: 0 !important;
        }
    }
</style>