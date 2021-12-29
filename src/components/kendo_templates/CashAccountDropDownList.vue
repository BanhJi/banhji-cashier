<template>
    <v-select
        :loading="loading"
        class="mt-1"
        placeholder="Select Cash Account"
        v-model="account"
        :items="accounts"
        item-text="name"
        item-value="uuid"
        @change="emitAccount(), onChanged()"
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
            type: Object,
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
        onChanged() {
            this.$emit('onChanged')
        },
    },
    watch: {
        initAccount() {
            this.account = this.initAccount;
        }
    },
    created() {
        this.loading = true
        // Call Obj List
        accountHandler.getAll()
            .then(res => {
                if (res) {
                    let accountList = [];
                    res.forEach(value => {
                        if (~AccountTypeCode.CASH_ACCOUNTS.indexOf(value.account_type.code)) { // Filter only Cash Account
                            let acct = new AccountModel(value);
                            accountList.push(acct);
                        }
                    });
                    this.accounts = accountList;
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