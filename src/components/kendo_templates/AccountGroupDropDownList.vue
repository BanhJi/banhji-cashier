<template>
    <v-select
        :loading="loading"
        class="mt-1"
        placeholder="Select Account Group"
        v-model="accountGroup"
        :items="accountGroups"
        item-text="name"
        item-value="uuid"
        @change="emitAccountGroup();onChanged()"
        return-object
        clearable
        outlined/>
</template>

<script>
import AccountGroupModel from "@/scripts/model/AccountGroup.js";

const {accountGroupHandler} = require("@/scripts/AppHandlers");

export default {
    name: 'AccountGroupDropDownList',
    props: {
        initAccountGroup: {
            type: AccountGroupModel,
        },
        initAccountTypeCode: {
            type: Number,
        }
    },
    data() {
        return {
            accountGroup: new AccountGroupModel(),
            accountGroups: [],
            accountGroupList: [],
            loading: false
        }
    },
    methods: {
        emitAccountGroup() {
            this.$emit('emitAccountGroup', new AccountGroupModel(this.accountGroup));
        },
        onChanged() {
            this.$emit('onChanged');
        },
    },
    watch: {
        initAccountGroup() {
            this.accountGroup = this.initAccountGroup;
        },
        initAccountTypeCode() {
            this.accountGroups = this.accountGroupList.filter(value => value.account_type.code === this.initAccountTypeCode);
        },
    },
    created() {
        this.loading = true
        // Call Obj List
        accountGroupHandler.getAll()
            .then(res => {
                if (res) {
                    let accountGroupList = [];
                    res.forEach(value => {
                        let group = new AccountGroupModel(value);
                        accountGroupList.push(group);
                    });
                    this.accountGroups = accountGroupList;
                    this.accountGroupList = accountGroupList;
                    this.loading = false
                } else {
                    this.loading = false
                }
            })
    },
    mounted() {
        /* Initial Obj */
        this.accountGroup = this.initAccountGroup;
    }
}
</script>