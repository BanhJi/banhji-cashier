<template>
    <v-select
        :loading="loading"
        class="mt-1"
        placeholder="Select Parent Account"
        v-model="parentAccount"
        :items="parentAccounts"
        item-text="name"
        item-value="uuid"
        @change="emitParentAccount();onChanged()"
        return-object
        clearable
        outlined>
        <!-- <template slot='selection' slot-scope='{ item }'>
            {{ item.number }} - {{ item.name }}
        </template> -->
        <template slot='item' slot-scope='{ item }'>
            {{ item.number }} - {{ item.name }}
        </template>
    </v-select>
</template>

<script>
import {AccountModel} from "@/scripts/model/AppModels";

const {accountHandler} = require("@/scripts/AppHandlers");

export default {
    name: 'ParentAccountDropDownList',
    props: {
        initParentAccount: {
            type: Object,
        },
        initAccountTypeCode: {
            type: Number,
        }
    },
    data() {
        return {
            parentAccount: new AccountModel(),
            parentAccounts: [],
            parentAccountList: [],
            loading: false
        }
    },
    methods: {
        emitParentAccount() {
            this.$emit('emitParentAccount', new AccountModel(this.parentAccount));
        },
        onChanged() {
            this.$emit('onChanged');
        },
    },
    watch: {
        initParentAccount() {
            this.parentAccount = this.initParentAccount;
        },
        initAccountTypeCode() {
            this.parentAccounts = this.parentAccountList.filter(value => value.account_type.code === this.initAccountTypeCode);
        },
    },
    created() {
        this.loading = true
        // Call Obj List
        accountHandler.getAll()
            .then(res => {
                if (res) {
                    let parentAccountList = [];
                    res.forEach(value => {
                        let parent = new AccountModel(value);
                        parentAccountList.push(parent);
                    });
                    this.parentAccounts = parentAccountList;
                    this.parentAccountList = parentAccountList;
                }
                this.loading = false
            })
    },
    mounted() {
        /* Initial Obj */
        this.parentAccount = this.initParentAccount;
    }
}
</script>