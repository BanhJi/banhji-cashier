<template>
  <v-select
      :loading="loading"
      class="mt-1"
      placeholder="Select Currency"
      :rules="[(v) =>!!v ||'Currency is required']"
      @change="emitCurrency();onChanged()"
      v-model="currency"
      :items="currencies"
      item-text="name"
      item-value="code"
      return-object
      required
      outlined>
    <template slot="selection" slot-scope="{ item }">
      {{ item.name }}
    </template>
    <template slot="item" slot-scope="{ item }">
      {{ item.code }} - {{ item.name }}
    </template>
  </v-select>
</template>

<script>
import {CurrencyModel} from "@/scripts/model/AppModels";

const {currencyHandler} = require("@/scripts/AppHandlers");

export default {
  name: 'CurrencyDropDownList',
  props: {
    initCurrency: {
      type: Object,
    },
  },
  data() {
    return {
      currency: new CurrencyModel(),
      currencies: [],
      loading: false,
    }
  },
  methods: {
    emitCurrency() {
      this.$emit('emitCurrency', new CurrencyModel(this.currency));
    },
    onChanged() {
      this.$emit('onChanged');
    },
  },
  watch: {
    initCurrency() {
      this.currency = this.initCurrency;
    }
  },
  created() {
    this.loading = true
    // Call Currency List
    currencyHandler.getAll()
        .then(res => {
          let currencyList = [];
          res.forEach(value => {
            if (value.used === 1) {
              let curr = new CurrencyModel(value);
              currencyList.push(curr);
            }
          });
          this.currencies = currencyList;
          this.loading = false
        })
  },
  mounted() {
    /* Initial Currency */
    this.currency = this.initCurrency;
  }
}
</script>