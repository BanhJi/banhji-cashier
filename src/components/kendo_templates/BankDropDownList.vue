<template>
    <v-select
        :loading="loading"
        class="mt-1"
        placeholder="Select Bank"
        v-model="bank"
        :items="banks"
        item-text="name"
        item-value="uuid"
        @change="emitBank"
        return-object
        outlined/>
</template>

<script>
import {BankModel} from "@/scripts/model/AppModels";

const {bankHandler} = require("@/scripts/AppHandlers");

export default {
    name: 'BankDropDownList',
    props: {
        initBank: {
            type: Object,
        },
    },
    data() {
        return {
            bank: new BankModel(),
            banks: [],
            loading: false
        }
    },
    methods: {
        emitBank() {
            this.$emit('emitBank', new BankModel(this.bank));
        },
    },
    watch: {
        initBank() {
            this.bank = this.initBank;
        }
    },
    created() {
        this.loading = true
        // Call Bank List
        bankHandler.getAll()
            .then(res => {
                if (res) {
                    let bankList = [];
                    res.forEach(value => {
                        let bank = new BankModel(value);
                        bankList.push(bank);
                    });
                    this.banks = bankList.sort(function (a, b) {
                        if (a.name === b.name) {
                            return 0;
                        } else if (a.name > b.name) {
                            return 1;
                        } else {
                            return -1;
                        }
                    });
                }
                this.loading = false
            })
    },
    mounted() {
        /* Initial Bank Id */
        this.bank = this.initBank;
    }
}
</script>