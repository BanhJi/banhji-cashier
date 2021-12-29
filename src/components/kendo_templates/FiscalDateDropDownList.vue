<template>
    <v-select
        :loading="fiscalDates.length <= 0"
        class="mt-1"
        placeholder="Select Fiscal Date"
        v-model="fiscalDate"
        :items="fiscalDates"
        item-text="start_date"
        item-value="uuid"
        @change="emitFiscalDate();onChanged();"
        return-object
        clearable
        outlined>
        <template slot="selection" slot-scope="{ item }">
            {{ Helper.formatFiscalDate(item.start_date) }} - {{ Helper.formatFiscalDate(item.end_date) }}
        </template>
        <template slot="item" slot-scope="{ item }">
            {{ Helper.formatFiscalDate(item.start_date) }} - {{ Helper.formatFiscalDate(item.end_date) }}
        </template>
    </v-select>
</template>

<script>
    import Helper from "@/helper.js";

    const store = require("@/institute.js");
	const { institute } = store.default.state;

    export default {
        name: 'FiscalDateDropDownList',
        props: {
            initFiscalDate: {
                type: Object,
            },
        },
        data () {
            return {
                Helper 			: Helper,
                fiscalDate 		: institute.fiscalDate[0],
                fiscalDates 	: institute.fiscalDate,
            }
        },
        methods: {
            emitFiscalDate () {
                this.$emit('emitFiscalDate', this.fiscalDate);
            },
            onChanged() {
                this.$emit('onChanged');
            },
        },
        watch: {
            initFiscalDate () {
                this.fiscalDate = this.initFiscalDate;
            }
        },
        mounted () {
            /* Initial Fiscal Date */
            this.fiscalDate = this.initFiscalDate;
        }
    }
</script>