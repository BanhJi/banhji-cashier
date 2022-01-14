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
                            <td class="text-bold">{{ $t('default_search_option') }}</td>
                            <td style=""  class="primary--text align-center justify-center d-flex text-bold">
                                <v-select class="w_100"
                                    :label="$t('select')"
                                    color="primary"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="text-bold">{{ $t('default_message_on_receipt_journal') }}</td>
                            <td style=""  class="primary--text align-center justify-center d-flex text-bold">
                                <v-text-field
                                    label="message"
                                    :rules="rules"
                                    hide-details="auto"
                                    ></v-text-field>
                            </td>
                        </tr>
                        <tr>
                            <td class="text-bold">{{ $t('default_receipt_form') }}</td>
                            <td style=""  class="primary--text align-center justify-center d-flex text-bold">
                                <v-select class="w_100"
                                    :label="$t('select')"
                                    color="primary"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td class="text-bold">{{ $t('default_reconciliation_report_rorm') }}</td>
                            <td style=""  class="primary--text align-center justify-center d-flex text-bold">
                                <v-select class="w_100"
                                    :label="$t('select')"
                                    color="primary"
                                />
                            </td>
                        </tr>
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
import SaleFormContentModel from "@/scripts/model/SaleFormContent";

const saleFormContentModel = new SaleFormContentModel({})
const saleFormContentHandler = require("@/scripts/saleFormContentHandler")

export default {

    components: {},
    data: () => ({
            saleFormContent: saleFormContentModel,
            quotes: ['Quote', 'Proposal', 'Estimate'],
            saleOrders: ['Sale Order', 'Engagement', 'Contract'],
            decimalStyle: [2, 3, 4, 5]
        }
    ),
    props: {}
    ,
    computed: {}
    ,
    watch: {}
    ,
    created() {
    }
    ,
    methods: {
        async onSaveClose() {
            // if (!this.$refs.form.validate()) {
            //   this.$refs.form.validate()
            //   return
            // }
            new Promise(resolve => {
                setTimeout(() => {
                    resolve('resolved');
                    let data = {
                        id: this.saleFormContent.id ? this.saleFormContent.id : '',
                        serviceDate: this.saleFormContent.serviceDate,
                        serviceDateTo: this.saleFormContent.serviceDateTo,
                        discountItem: this.saleFormContent.discountItem,
                        otherCharge: this.saleFormContent.otherCharge,
                        specificTax: this.saleFormContent.specificTax,
                        otherTax: this.saleFormContent.otherTax,
                        publicLightingTax: this.saleFormContent.publicLightingTax,
                        saleUnit: this.saleFormContent.saleUnit,
                        modifier: this.saleFormContent.modifier,
                        employee: this.saleFormContent.employee,
                        decimal: this.saleFormContent.decimal,
                        saleQuote: this.saleFormContent.saleQuote,
                        saleOrder: this.saleFormContent.saleOrder,

                        negativeInventory: this.saleFormContent.negativeInventory,
                        lateFee: this.saleFormContent.lateFee,
                        email: this.saleFormContent.email,
                        pdfAttachment: this.saleFormContent.pdfAttachment,
                        invoiceReminder: this.saleFormContent.invoiceReminder,
                        reminder1: this.saleFormContent.reminder1,
                        reminder2: this.saleFormContent.reminder2,
                        reminder3: this.saleFormContent.reminder3,
                        statement: this.saleFormContent.statement
                    }
                    saleFormContentHandler.create(data).then(response => {
                        if (response.data.statusCode === 201) {
                            const res = response.data.data
                            this.saleFormContent = res
                            this.$snotify.success('Update Successfully')
                            // this.$refs.form.reset()
                        }
                    }).catch(e => {
                        this.$snotify.error('Something went wrong')
                        this.errors.push(e)
                    })

                }, 300);
            })
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
    }
    ,
    mounted: async function () {
        await this.loadSaleFormContent()
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