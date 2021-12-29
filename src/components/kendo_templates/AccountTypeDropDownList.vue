<template>
    <v-select
        :loading="loading"
        class="mt-1"
        placeholder="Select Account Type"
        v-model="accountType"
        :items="accountTypes"
        item-text="name"
        item-value="uuid"
        @change="emitAccountType();onChanged()"
        return-object
        clearable
        outlined/>
</template>

<script>
import {AccountTypeModel} from "@/scripts/model/AppModels";

const {accountTypeHandler} = require("@/scripts/AppHandlers");

export default {
    name: 'AccountTypeDropDownList',
    props: {
        initAccountType: {
            type: AccountTypeModel,
        },
    },
    data() {
        return {
            accountType: new AccountTypeModel(),
            accountTypes: [],
            loading: false
        }
    },
    methods: {
        emitAccountType() {
            this.$emit('emitAccountType', new AccountTypeModel(this.accountType));
        },
        onChanged() {
            this.$emit('onChanged');
        },
    },
    watch: {
        initAccountType() {
            this.accountType = this.initAccountType;
        }
    },
    created() {
        this.loading = true
        // Call Obj List
        accountTypeHandler.getAll()
            .then(res => {
                if (res) {
                    let accountTypeList = [];
                    res.forEach(value => {
                        let type = new AccountTypeModel(value);
                        accountTypeList.push(type);
                    });
                    this.accountTypes = accountTypeList;
                    this.loading = false
                } else {
                    this.loading = false
                }
            })
    },
    mounted() {
        /* Initial Obj */
        this.accountType = this.initAccountType;
    }
}
</script>