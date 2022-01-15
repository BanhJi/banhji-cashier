<template>
	<v-app>
		<v-container>
			<v-row>
				<v-col cols="12" sm="12">
					<v-form ref="form" v-model="valid" lazy-validation>
                        <v-card outlined dense class="pa-4 no_border rounded-sm" color="white">
                            <v-card outlined dense class="no_border">
								<h2 class="mb-0">{{$t('cash_reconciliation')}}</h2>
								<v-icon
										onclick="window.history.go(-1); return false;"
										style="cursor: pointer; color: #333; font-size: 40px;"
										class="float-right"
								>close</v-icon>
                            </v-card>

                            <v-card outlined dense class="px-3 no_border" color="grayBg">
								<v-row class="">
									<v-col sm="3" cols="12" class="pb-0">
										<label class="label">{{$t('journal_date')}}</label>
										<app-datepicker 
											:initialDate="reconcile.date" 
											@emitDate="reconcile.date = $event"
											@onChanged="loadExchangeRate" />
									</v-col>
									<v-col sm="3" cols="12" class="pb-0 pl-0">
										<label class="label">{{$t('number')}}</label>
										<v-row>
											<v-col sm="10" cols="10" class="pr-0 pb-0 pt-1">
												<v-text-field
													v-model="reconcile.number"
													outlined
													:rules="[v => !!v || 'Number is required']"
													readonly
													required />
											</v-col>
											<v-col sm="2" cols="2" class="pl-0 pb-0 pt-1">
												<v-icon color="black" size="30" class="border_qrcode" @click="generateNumber">mdi-qrcode</v-icon>
											</v-col>
										</v-row>
									</v-col>
									<v-col sm="3" cols="12" class="pb-0">
										<label class="label">{{$t('ending_balance_date')}}</label>
										<app-datepicker 
											:initialDate="reconcile.ending_balance_date" 
											@emitDate="reconcile.ending_balance_date = $event"
											@onChanged="loadEndingBalance" />
									</v-col>
									<v-col sm="3" cols="12" class="pb-0 pl-0">
										<label class="label">{{$t('reconcile_account')}}</label>
										<app-cash-account-dropdownlist
											:initAccount="reconcile.account"
											@emitAccount="reconcile.account = $event"
											@onChanged="loadEndingBalance"
										/>
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
													{{ Number(reconcile.ending_balance).toLocaleString() }}
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
												{{ Number(reconcile.actual_amount).toLocaleString() }}
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
												{{ Number(reconcile.variance_amount).toLocaleString() }}
											</h3> 
										</v-card>
									</v-col>
									<v-col sm="6" cols="12">
										<v-card height="60px" color="white" elevation="0" style="padding-top: 6.3px !important;" class="pa-3 rounded-4 ">
											<app-account-dropdownlist
												:disabled="reconcile.variance_amount === 0"
												:initAccount="reconcile.adjustment_account"
												@emitAccount="reconcile.adjustment_account = $event"
											/>
										</v-card>
									</v-col>
								</v-row>

                            </v-card>
                            <v-card outlined dense class="no_border" color="white">
								<v-row style="">
									<v-col sm="12" cols="12" class="pb-1">
										<kendo-datasource ref="noteDS"
											:data="notes"
											:change="onDataSourceChanges" />

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
										<v-btn color="primary" class="float-left btn_plus rounded-0 white--text" @click="addRow">
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

								<v-menu>
									<template v-slot:activator="{ on }">
										<v-btn   class="mr-2 text-capitalize  black--text float-left" v-on="on" >
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
								<v-btn color="primary"  outlined class="text-capitalize  black--text float-left" @click="cancel">{{$t('cancel')}}</v-btn>
								<v-btn color="primary" class="ml-2 float-right text-capitalize  white--text" @click="onSaveOptionClick(SaveOption.SAVECLOSE)">{{$t('reconcile')}}</v-btn>
								<v-btn color="primary" class="ml-2 float-right text-capitalize  white--text" @click="onSaveOptionClick(SaveOption.SAVEDRAFT)" v-show="!isEdit">{{$t('save_for_later')}}</v-btn>
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
	import JQuery from 'jquery';
	import {
		ReconcileModel,
		ReconcileDetailModel,
		JournalModel,
		JournalEntryModel,
		AccountModel,
		CurrencyModel,
	} from "@/scripts/model/AppModels";

	const $ = require("jquery");
	
	/* Store */
	import store from "@/store"
	const institute = store.state.institute.institute

	const {
		journalHandler,
		reconcileHandler,
		currencyHandler,
	} = require("@/scripts/AppHandlers");
	const { CurrencyEditor } = require("@/scripts/kendo_editor/Collections");
	const {
		SaveOption,
		EntityType,
	} = require("@/scripts/default_setup/Collections");
	
	export default {
        name: "CashReconciliation",
        components:{
			"LoadingMe": () => import('@/components/Loading'),
			"app-datepicker": () => import('@/components/custom_templates/DatePickerComponent'),
			"app-account-dropdownlist": () => import('@/components/dropdownlist/Account'),
			"app-cash-account-dropdownlist": () => import('@/components/dropdownlist/CashAccount'),
		},
		props: {
			initCashReconciliation: {
				type: ReconcileModel,
			},
		},
        data: () => ({
			// Obj
			reconcile			: new ReconcileModel(),
			adjustmentJournal 	: new JournalModel(),
			adjustmentEntries 	: new JournalEntryModel(),
			notes				: [],
			currencies 			: [],
			exchangeRates		: [],
			// Entry Uuid
			debitEntryUuid 		: '',
			creditEntryUuid 	: '',
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
        }),
        methods:  {
			// Initial Data
			initialData() {
				if (this.initCashReconciliation) {// Edit Mode
					this.reconcile = this.initCashReconciliation;
					this.bindData();
				} else {// Brand New Mode
					this.setDefaultData();
				}
			},
			// Set default data
			setDefaultData () {
				// Brand New Mode
				this.isEdit = false;

				this.reconcile = new ReconcileModel({
					date: new Date().toISOString().substr(0, 10),
					type: EntityType.CASH_RECONCILIATION,
					ending_balance_date: new Date().toISOString().substr(0, 10),
				});

				// Entry Uuid
				this.debitEntryUuid = '';
				this.creditEntryUuid = '';

				// Generate number
				this.generateNumber();

				// Reset lines and Add 2 default lines
				this.addRow();
				this.addRow();
			},
			// Bind data from prop for edit mode
			bindData() {
				// Edit Mode
				this.isEdit = true;

				this.notes = this.reconcile.notes;

				// Journal
				if(this.reconcile.adjustment_journal_id !== ''){
					journalHandler.getOne(this.reconcile.adjustment_journal_id)
					.then((res) => {
						this.adjustmentJournal = new JournalModel(res.data);

						this.adjustmentJournal.journal_entries.forEach(value => {
							if(value.amount > 0){
								this.debitEntryUuid = value.uuid;
							}else{
								this.creditEntryUuid = value.uuid;
							}
						});
					});
				}
			},
			// Number
			async generateNumber() {
				if(!this.isEdit){
					let num = await Helper.generateAccountingNumber(this.reconcile.type, this.reconcile.date);
					
					this.reconcile.number = num.number;
					this.reconcile.prefix_format = num.prefix_format;
				}
			},
			// Get Exchange Rate			
			loadExchangeRate(){
				currencyHandler.getLastExchangeRateByDate(this.reconcile.date)
                .then(res => {
                    this.exchangeRates = res.data.data;
                });
			},
			/* Kendo */
			// DataSource Changes
			onDataSourceChanges (e) {
				if(e.field){
					let dataRow = e.items[0];
					
					if (e.field === "currency") {
						this.addExtraRow(dataRow.uid);
					}

					this.autoCalculate();
				}
			},
			// Auto Calculate In DataSource
			autoCalculate () {
				let ds = this.$refs.noteDS.kendoWidget(),
					totalExchangeAmount = 0;
				
				ds.data().forEach(value => {
					let amount = kendo.parseFloat(value.note) * kendo.parseFloat(value.unit),
						xrate = this.exchangeRates.find(xr => xr.code === value.currency.code);
					
					value.set("amount", amount);

					if(xrate){
						let xamount = amount * kendo.parseFloat(xrate.rate);

						value.set("exchange_rate_uuid", xrate.id);
						value.set("exchange_rate", xrate.rate);
						value.set("exchanged_amount", xamount);
						totalExchangeAmount += xamount;
					}
				})

				this.reconcile.actual_amount = totalExchangeAmount;
				this.reconcile.variance_amount = this.reconcile.ending_balance - totalExchangeAmount;
			},
			// Row Number Template
			rowNumberTmpl (dataItem) {
				let ds = this.$refs.noteDS.kendoWidget(),
					index = ds.indexOf(dataItem);

				return index + 1;
			},
			// Add New Row
			addRow () {
				let ds = this.$refs.noteDS.kendoWidget(),
					last = ds.total(),
					note = new ReconcileDetailModel();

				ds.insert(last, note);
			},
			// Add Extra Row
			addExtraRow (uid) {
				let ds = this.$refs.noteDS.kendoWidget(),
					total = ds.total(),
					row = ds.getByUid(uid),
					index = ds.indexOf(row);

				if(index == total - 1){
					this.addRow();
				}
			},
			// Remove Row
			removeRow (e) {
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
			loadEndingBalance () {
				let currentFiscalDate = Helper.getFiscalDateByDate(new Date());
				let sdate = currentFiscalDate.start_date,
					edate = this.reconcile.ending_balance_date;
				
				if(this.reconcile.account.uuid){
					if (sdate && edate) {
						sdate = kendo.toString(new Date(sdate), 'yyyy-MM-dd') + 'T00:00:00.000Z';

						edate = new Date(edate);
						edate = kendo.toString(edate, 'yyyy-MM-dd') + 'T23:59:59.999Z';
					} else {
						sdate = 0;
						edate = 0;
					}

					// Clear
					this.reconcile.ending_balance = 0;
					this.reconcile.variance_amount = 0;
					this.reconcile.reconcile_entries = [];

					this.showLoading = true;
					journalHandler.getEntryDetailByAccount(this.reconcile.account.uuid, {
						params: {
							start_date 		: sdate,
							end_date 		: edate,
						}
					})
					.then(res => {
						if(!JQuery.isEmptyObject(res)){
							// Bind ending balance
							this.reconcile.ending_balance = kendo.parseFloat(res.ending_balance);

							// Collect entries
							res.entries_detail.forEach(value => {
								this.reconcile.reconcile_entries.push(value.entry_uuid);
							})

							this.autoCalculate();
						}
					})
					.finally(() => {
						this.showLoading = false;
					})
				}
			},
			// Shrink Data
			shrinkData () {
				// Date
				this.reconcile.date = Helper.toISODate(this.reconcile.date);
				this.reconcile.ending_balance_date = Helper.toISODate(this.reconcile.ending_balance_date);
				
				// Note
				let notes = [],
					ds = this.$refs.noteDS.kendoWidget();

				ds.data().forEach(value => {
					if(value.currency.code !== "" && value.amount > 0){
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
			addJournal () {
				let entries = [],
					debitAccount = this.reconcile.account,
					creditAccount = this.reconcile.adjustment_account,
					amount = Math.abs(this.reconcile.variance_amount);

				// Variance > 0
				if(this.reconcile.variance_amount > 0){
					debitAccount = this.reconcile.adjustment_account;
					creditAccount = this.reconcile.account;
				}

				// Debit Side
				entries.push(new JournalEntryModel({
					uuid				: this.debitEntryUuid,
					account 			: new AccountModel(debitAccount),
					account_uuid 		: debitAccount.uuid,
					description 		: this.reconcile.description,
					currency 			: new CurrencyModel(institute.baseCurrency),
					amount 				: amount,
					exchange_rate		: 1,// Base Currency always = 1
				}));

				// Credit Side
				entries.push(new JournalEntryModel({
					uuid				: this.creditEntryUuid,
					account 			: new AccountModel(creditAccount),
					account_uuid 		: creditAccount.uuid,
					description 		: this.reconcile.description,
					currency 			: new CurrencyModel(institute.baseCurrency),
					amount 				: amount * -1,
					exchange_rate		: 1,// Base Currency always = 1
				}));

				// Adjustment Journal
				this.adjustmentJournal.number 				= this.reconcile.number;
				this.adjustmentJournal.journal_type 		= EntityType.ADJUSTMENT;
				this.adjustmentJournal.transaction_type 	= EntityType.CASH_RECONCILIATION;
				this.adjustmentJournal.journal_date 		= Helper.toISODate(this.reconcile.date);
				this.adjustmentJournal.description 			= this.reconcile.description;
				this.adjustmentJournal.prefix_format 		= this.reconcile.prefix_format;
				this.adjustmentJournal.is_draft				= this.reconcile.is_draft;
				this.adjustmentJournal.created_by 			= this.reconcile.created_by;
				this.adjustmentJournal.modified_by 			= this.reconcile.modified_by;

				// Adjustment Entries
				this.adjustmentEntries = entries;
			},
			// Validating
			validateForm () {
				let result = true,
					ds = this.$refs.noteDS.kendoWidget(),
					msg = '', countEmpty = 0;

				// Select Account and Amount
				ds.data().forEach((value, index) => {
					// No currency
                    if(value.currency.code === '' && value.amount > 0){
                        result = false;
                        msg += `<p>${i18n.t("please_select_currency_at_row_number")} ${index + 1}</p>`;
                    }

                    // No amount
                    if(value.currency.code !== '' && value.amount === 0){
                        result = false;
                        msg += `<p>${i18n.t("there_is_no_amount_at_row_number")} ${index + 1}</p>`;
                    }

                    // Count Accounts
                    if(value.currency.code !== '' && value.amount > 0){
                        countEmpty++;
                    }
				});
				
				// Empty Row
				if(countEmpty === 0){
					msg += `<p>${i18n.t("please_select_some_currencies")}</p>`;
					result = false;
				}

				// Adjustment Account
				if(this.reconcile.variance_amount !== 0){
					if(this.reconcile.adjustment_account.uuid === ''){
						result = false;
						msg += `<p>${i18n.t("please_select_adjustment_account")}</p>`;
					}
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
					let isValidClosingDate = await Helper.validateClosingDate(this.reconcile.date);
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

				// Entry Uuid
				this.debitEntryUuid = '';
				this.creditEntryUuid = '';

				let ds = this.$refs.noteDS.kendoWidget();
				ds.data([]);
			},
			save () {
				let self = this;

				// Shrink Data
				this.shrinkData();
				
				// Draft Mode
				if (this.saveMode === SaveOption.SAVEDRAFT) {
					this.reconcile.is_draft = 1;
				} else {
					this.reconcile.is_draft = 0;

					// Adjustment Journal
					if(this.reconcile.variance_amount !== 0){
						this.addJournal();
					}else{
						this.adjustmentJournal = null;
						this.adjustmentEntries = null;
					}
				}
				
				// Sync Data
				this.showLoading = true
				reconcileHandler.save({
					reconcile 			: this.reconcile,
					adjustment_journal 	: this.adjustmentJournal,
					adjustment_entries	: this.adjustmentEntries,
				})
				.then((response) => {
					if (response) {
						self.responseStatus(response.status);
					}
				})
				.catch((error) => {
					Helper.alertErrorMsg(error);
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
				this.showLoading = false;
				this.changeAlertStatus();
				this.loadingTextAlert ="Added Successful";
				this.loadingColorAlert ="#3DA72E";
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
			getReconcile(){
				return new ReconcileModel(this.reconcile);
			},
			goBackToViewPage(){
				this.$router.replace({ name: 'Cash Reconciliation View', params: { initCashReconciliation: this.getReconcile() } });
			},
		},
		watch: {
			initCashReconciliation () {
				this.initialData();
			},
		},
		created () {
			this.loadExchangeRate();
		},
		mounted () {
			// Initial Data
			this.initialData();
		},
    };
</script>

<style scoped>
	.block-green{
		text-transform: uppercase;
	}
	@media (min-width: 1264px){
		.container {
			max-width: 1080px !important;
		}
	}
</style>