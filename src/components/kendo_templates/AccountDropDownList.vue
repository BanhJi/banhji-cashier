<template>
    <v-select
        class="mt-1"
        :loading="showLoading"
        placeholder="Select Account"
        v-model="account"
        :items="accounts"
        item-text="name"
        item-value="uuid"
        @change="emitAccount"
        return-object
        clearable
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
const store = require("@/institute.js");
const {accountHandler} = require("@/scripts/AppHandlers");

export default {
    name: 'AccountDropDownList',
    props: {
        initAccount: {
            type: Object,
        },
    },
    data() {
        return {
            account : null,
            showLoading : false,
        }
    },
    methods: {
        emitAccount() {
            this.$emit('emitAccount', this.account);
        },
    },
    watch: {
        initAccount() {
            this.account = this.initAccount;
        }
    },
    computed: {
        /* Sync data from store state. */
        accounts () {
            return store.default.state.accounts;
        }
    },
    created() {
        this.showLoading = true;
        /* Fetch data and store in vuex */
        accountHandler.getAll()
        .finally(()=>{
            this.showLoading = false;
        });
    },
    mounted() {
        /* Initial Obj */
        this.account = this.initAccount;
    }
}
</script>