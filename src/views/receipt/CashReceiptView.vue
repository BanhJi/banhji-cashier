<template>
    <v-app>
        <v-container>
            <v-row>
                <v-col sm="12" cols="12" >
                    <v-card outlined dense class="pa-4 no_border rounded-sm" color="white">
                        <v-row>
                            <v-col class="bigSide py-0" sm="8" cols="12" style="transition: .3s ease-in;"
                                   :class="{'hide_big_bar_class':isHideBar}">
                                <v-form ref="form" v-model="valid" lazy-validation>
                                    <v-card outlined dense class="no_border">
                                        <h2 class="mb-0">{{$t('cash_receipt')}}</h2>
                                        <v-icon v-if="isHideBar"
                                                onclick="window.history.go(-1); return false;"
                                                style="cursor: pointer; color: #333; font-size: 40px;"
                                                class="float-right"
                                        >close
                                        </v-icon>
                                        <span style="transition: .3s ease-in; z-index:10;"
                                              :class="{'iconArrow': !isHideBar,'iconArrowHide': isHideBar }">
                                            <v-icon size="22"
                                                class="arr_icon"
                                                @click="hide_smallsitebar"
                                                v-if="isHideBar"> mdi-chevron-left-circle
                                            </v-icon>
                                            <v-icon size="22"
                                                class="arr_icon"
                                                @click="hide_smallsitebar"
                                                v-if="!isHideBar"> mdi-chevron-right-circle
                                            </v-icon>
										</span>
                                    </v-card>
                                    <v-card outlined dense class="px-3 no_border" style="background-color: #ffffff;">
                                        <v-row class="px-6">
                                            <v-col sm="6" cols="12" class="pb-0">
                                                <v-row style="background:#F8F8F9" class="pa-4">
                                                    <v-col sm="7" cols="12" class="pb-0">
                                                         <label class="label mb-0  font_14">{{$t('customer')}}</label>
                                                        <h3 class="text-bold py-1">Customer</h3>
                                                        <label class="label mb-0 grey--text font_14">{{$t('payment_reference_no')}}</label>
                                                        <h3 class="text-bold py-1">PMT260671010101</h3>
                                                        <label class="label mb-0 grey--text font_14">{{$t('customer_reference_no')}}</label>
                                                        <h3 class="text-bold py-1">PMT260671010101</h3>
                                                    </v-col>
                                                    <v-col sm="5" cols="12" class="pb-0">
                                                        <label class="label mb-0 grey--text font_14">{{$t('invoice_no')}}</label>
                                                        <h3 class="text-bold py-1">PD260101</h3>
                                                        <label class="label grey--text font_14 text-capitalize">QR Code (EMV)</label><br>
                                                        <v-img class="img_center"  width="60%" src="@/assets/images/qcode.png"/>
                                                    </v-col>
                                                    <v-col sm="12" cols="12" class="py-0">
                                                        <label class="label grey--text font_14 text-capitalize">{{$t('invoice_link')}}</label><br>
                                                        <a class="font_12" href="#">Invoice.banhji.com/view/6d978c98-5cfa-4bb8-b746-171c08d1e254</a>
                                                    </v-col>
                                                </v-row>
                                                <v-row class="mt-3">
                                                    <v-col sm="6" cols="12">
                                                        <label>{{$t('message_on_receipt')}}</label>
                                                        <h4 class="text-bold py-2">This will appear on the deposit form</h4>
                                                    </v-col>
                                                    <v-col sm="6" cols="12">
                                                        <label>{{$t('message_for_journal')}}</label>
                                                            <h4 class="text-bold py-2">This will appear in journal for deposit</h4>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                            <v-col sm="6" cosl="12">
                                                <v-card color="primary" class="pa-2 mb-6 text-bold rounded-1">
                                                    <p class="text white--text text-uppercase">{{$t('amount_receipt')}}</p>
                                                    <p class="number white--text mb-0 text-bold text-right text-h4">1,000.00 </p>
                                                </v-card>
                                                <v-row>
                                                    <v-col sm="6" cols="12" class="pr-0">
                                                        <label class="label lb_bold mb-2 text-bold text-capitalize">{{$t('payment_code')}}</label>
                                                        <h4 class="secondary pa-3 white--text">PMT260671010101</h4>
                                                        <label class="label lb_bold mb-2 text-bold text-capitalize">{{$t('payment_date')}}</label>
                                                        <h4 class="third pa-3 white--text">07-04-2020</h4>
                                                        <label class="label lb_bold mb-1 text-bold text-capitalize">{{$t('account')}}</label>
                                                        <h4 class="third pa-3 white--text">Payment in Transit</h4>
                                                    </v-col>
                                                    <v-col sm="6" cols="12">
                                                        <label class="label mb-2 lb_bold text-bold text-uppercase">{{$t('receipt_source')}}</label>
                                                        <v-img width="80%" src="@/assets/images/aba2.png"/>
                                                        <label class="label mb-0 mt-2">{{$t('currency')}}</label>
                                                        <h4 class="text-bold py-0">USA</h4>
                                                    </v-col>
                                                </v-row>
                                             
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                    <v-divider/>
                                    <div class="function_footer mt-0 py-2">
                                        <v-alert type="warning"
                                                 v-model="alert"
                                                 dismissible>
                                            <span v-html="errorMessage"/>
                                        </v-alert>
                                        <p class="float-left  grey--text py-3 pl-10 mb-0">{{$t('standard_cash_receipt')}}</p>
                                        
                                        <v-btn class="float-right save_option mx-1">
                                            {{$t('print')}}
                                        </v-btn>
                                        <v-btn class="float-right btn_delete mx-1">
                                            {{$t('delete')}}
                                        </v-btn>
                                        <v-btn class="float-right btn_save_draft mx-1">
                                            {{$t('edit')}}
                                        </v-btn>
                                    </div>
                                    <v-divider/>
                                </v-form>
                            </v-col>
                            <v-col class="smallSide" sm="4" style="transition: .3s ease-in;"
                                   :class="{'hide_small_bar_class':isHideBar}">
                                <h3 style="color: #b3b5bc; font-size:20px;" v-if="!isHideBar" class="text-uppercase float-right mt-n3">Help
                                    <v-icon
                                        onclick="window.history.go(-1); return false;"
                                        style="cursor: pointer; color: #333; font-size: 40px;"
                                        class="float-right mt-n1"
                                    >close
                                    </v-icon>
                                </h3>
                            
                                <div v-if="!isHideBar" class="small_sidebar mt-9 px-4 grayBg">
                                    <p class="grey--text mt-6 mb-2">{{$t('transaction_history')}}</p>
                                    <p class="mb-1">{{$t('last_edited_by')}} : <span class="text-bold">Sim Chankiriroth</span></p>
                                    <p class="mb-1">{{$t('last_edited_on')}} :  <span class="text-bold">20 May 2020 – 6:00 PM</span></p>
                                </div>
                            </v-col>
                        </v-row>

                    </v-card>
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
    // import kendo from '@progress/kendo-ui'
    import LoadingMe from '@/components/Loading'

    export default {
        name: "CreditPurchase",
        components: {
            'LoadingMe': LoadingMe,
        },
        data: () => ({
            isEdit: false,
            // LoadingMe
            showLoading: false,
            loadingAlert: false,
            loadingColorAlert: '',
            loadingTextAlert: '',
            bill_date: '',
            alert: false,
            deposite: 1000,
            files: [],
            // Form validation
            valid: true,

            journal_types: [],
            suppliers_item: [],
            expense:[
                'Equal',
                'weighted'
            ],
            journal_date: "",
            templates: [
                {title: 'Draft'},
                {title: 'Open'},
                {title: 'Partially Closed'},
                {title: 'Closed'},
            ],
            col_expand: 9,
            col_hide: 3,
            isHideBar: false,
            suppliers: ["Suppliers", "Customer", "Employee"],
            transaction: [
                {
                    id: "12",
                    name: "Purchase Order",
                    no: "No.0024",
                    price: "2,50000",
                },
                {
                    id: "14",
                    name: "Godd Recipt Note",
                    no: "No.0024",
                    price: "2,50000",
                }
            ],
            item_suppliers  :[
				{
                    name: "Subtotal",
                    value: "10000.00"
				},
				{
					name: "Subtotal",
                    value: "10000.00"
				},
				{
					name: "Subtotal",
                    value: "10000.00"
				},
				{
					name: "Subtotal",
                    value: "10000.00"
				},
				{
					name: "Subtotal",
                    value: "10000.00"
                },
            ]

        }),
        methods: {
            savePrint() {

            },
            saveNew() {

            },
            saveClose() {

            },
            removeRow() {
            },
            generateNumber() {

            },
            errorMessage() {

            },
            addRow() {
            },
            accountDropDownEditor() {
            },
            cancel() {

            },
            hide_smallsitebar() {
                if (!this.isHideBar) {
                    // this.col_expand = 12
                    // this.col_hide = 0
                    this.isHideBar = true
                } else {
                    // this.col_expand = 9
                    // this.col_hide = 3
                    this.isHideBar = false
                }
            }
        },
        watch: {
            // call again the method if the route changes

        },
        created() {
            // fetch the data when the view is created and the data is
            // already being observed
            // this.loadObj()
        },
        mounted() {


        },
    };
</script>

<style scoped>
    .function_wrapper{
        box-shadow: none !important;
    }

    .v-application--is-ltr .v-text-field .v-input__append-inner {
        margin-top: 0 !important;
    }

    .v-input__slot {
        background-color: #fff !important;
    }

    .function_content .label {
        margin-bottom: 10px;
        display: inline-block;
    }

    .border_radius10 {
        border-radius: 10px !important;
        background-color: #F2F2F2;
    }

    .pa-3.v-card h4 {
        font-size: 18px;
        color: #333;
    }

    .pa-3.v-card p {
        font-size: 12px;
        color: #B5B5B5;
    }

    .custom_grid table th:last-child {
        text-align: right !important;
    }

    .color_green {
        color: #03b154;
    }

    @media (min-width: 1264px) {
        .container {
            max-width: 1250px;
        }
    }

    @media (max-width: 576px) {
        .pt-6.col-sm-5.col-12 {
            padding-top: 0 !important;
        }

        .code_text {
            width: 100%;
        }

        .phone_no_pt {
            padding-top: 0 !important;
        }

        .select_template,
        .save_option {
            margin-bottom: 10px;
        }
    }

    .hide_small_bar_class {
        max-width: 0;
        transition: .5s ease-in;
        flex: 0 0 0;
    }

    .hide_big_bar_class {
        max-width: 100%;
        transition: .5s ease-in;
        flex: 0 0 100%;
    }

    .info_add {
        background-color: #ffffff;
    }

    .small_sidebar {
        height: 98%;
        position: relative;
        padding: 12px;
        background-color: #EDF1F5;
    }

    .iconArrow {
        right: -35px;
        position: absolute;
        bottom: -10px;
    }
    .iconArrowHide {
        position: absolute;
        right: -7px;
        bottom: -10px;
    }
    .grey--text{
        color: #808080;
    }
 
    .lb_bold{
        font-size: 12px;
    }
    .detial_smallside_p{
        position: absolute;
        bottom: 10px;
    }
    .card_background{
        background-color: #EDF1F5;
        min-height: 120px;
    }
    .deposite_input{
        width: 100px;
    }

  
    .btn_add_small{
        height: 27px !important;
        min-width: 25px !important;
        font-size: 10px;
        padding: 0 22px !important;
        background-color: #00b050 !important;
        color: #ffffff;
        border-radius: 0 !important;
    }
    .list_site_inv{
        background-color: #92d050;
        color: #ffffff;
        font-size: 12px;
    }
    .list_site_exp{
        background-color: #c5e0b4;
        color: #000000;
        font-size: 12px;
        line-height: 16px;
        min-height: 40px;
    }
    .checkbox_inv{
        padding: 2px;
        margin-top: 3px;
        margin-right: 2px;
    }
    .exp_select{
        font-size:12px !important;
    }
    .theme--light.v-data-table td{
        border-bottom: 1px solid #808080;
          border-top: 1px solid #808080;
    }
  


</style>