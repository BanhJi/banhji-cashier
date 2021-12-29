<template>
    <v-select
        :loading="loading"
        class="mt-1"
        placeholder="Select Cash Advance Account"
        v-model="account"
        :items="accounts"
        item-text="name"
        item-value="uuid"
        @change="emitAccount"
        return-object
        outlined>
        <template slot="selection" slot-scope="{ item }">
            {{ item.number }} - {{ item.name }}
        </template>
        <template slot="item" slot-scope="{ item }">
            {{ item.number }} - {{ item.name }}
        </template>
    </v-select>
</template>

<script>
import {AccountModel} from "@/scripts/model/AppModels";

const {accountHandler} = require("@/scripts/AppHandlers");
const {AccountTypeCode} = require("@/scripts/default_setup/Collections");

export default {
    name: 'CashAccountDropDownList',
    props: {
        initAccount: {
            type: AccountModel,
        },
    },
    data() {
        return {
            account: new AccountModel(),
            accounts: [],
            loading: false
        }
    },
    methods: {
        emitAccount() {
            this.$emit('emitAccount', new AccountModel(this.account));
        },
    },
    watch: {
        initAccount() {
            this.account = this.initAccount;
        }
    },
    created() {
        this.loading = false
        // Call Obj List
        accountHandler.getAll()
            .then(res => {
                if (res) {
                    let objList = [];
                    res.forEach(value => {
                        if (value.account_type.code === AccountTypeCode.CASH_ADVANCE) { // Filter only Cash Advance Account
                            let obj = new AccountModel(value);
                            objList.push(obj);
                        }
                    });
                    this.accounts = objList;
                }
                this.loading = false
            })
    },
    mounted() {
        /* Initial Obj */
        this.account = this.initAccount;
    }
}
</script>