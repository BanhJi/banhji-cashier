<template>
    <v-select class="mt-1"
              :loading="loading"
              placeholder="Select Term"
              v-model="paymentTerm"
              :items="paymentTerms"
              item-text="name"
              item-value="id"
              @change="emitPaymentTerm();emitType();onChanged()"
              return-object
              outlined/>
</template>

<script>
import {PaymentTermModel} from "@/scripts/model/AppModels";

const {paymentTermHandler} = require("@/scripts/AppHandlers");

export default {
    name: 'PaymentTermDropDownList',
    props: {
        initPaymentTerm: {
            type: PaymentTermModel,
        },
        initType: {
            type: String,
        },
    },
    data() {
        return {
            paymentTerm: new PaymentTermModel(),
            paymentTerms: [],
            type: '',
            loading: false
        }
    },
    methods: {
        emitPaymentTerm() {
            this.$emit('emitPaymentTerm', new PaymentTermModel(this.paymentTerm));
        },
        emitType() {
            this.$emit('emitType', this.type);
        },
        onChanged() {
            this.$emit('onChanged')
        },
    },
    watch: {
        initPaymentTerm() {
            this.paymentTerm = this.initPaymentTerm;
        },
        initType() {
            this.type = this.initType;
        }
    },
    created() {
        this.loading = true
        // Call Payment Term List
        paymentTermHandler.getAll()
            .then(res => {
                if (res) {
                    let pmtList = [];
                    res.forEach(value => {
                        let pmt = new PaymentTermModel(value);
                        pmtList.push(pmt);
                    });
                    this.paymentTerms = pmtList.filter(o => o.type === this.type);
                }
                this.loading = false
            })
    },
    mounted() {
        /* Initial Payment Term */
        this.paymentTerm = this.initPaymentTerm;
        this.type = this.initType;
    }
}
</script>