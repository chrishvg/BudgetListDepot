<template>
  <v-dialog
    v-model="dialogVisible"
    persistent
    class="d-flex justify-center"
  >
    <v-skeleton-loader type="card" v-if="loading" />
    <v-card v-else class="rounded-lg">
      <v-toolbar color="cyan" dark>
        <v-toolbar-title>Select one of the following items: {{ description }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="productsData"
      >
        <template v-slot:[`item.image`]="{ value }">
          <v-img :src="value" alt="Product image"></v-img>
        </template>
        <template v-slot:[`item.title`]="{ value }">
          <span class="text-h6">{{ value }}</span>
        </template>
        <template v-slot:[`item.fullPrice`]="{ item }">
          <v-chip>
            <v-icon class="me-1" >
              mdi-currency-usd
            </v-icon>
            {{ item.priceDolars }}.{{ item.priceCents }} {{ item.unit }}
          </v-chip>
        </template>
        <template v-slot:[`item.starts`]="{ value }">
          <v-rating
            :model-value="value"
            color="orange-darken-2"
            density="compact"
            size="small"
            readonly
          ></v-rating>
        </template>
        <template v-slot:[`item.select`]="{ item }">
          <v-btn
            color="cyan"
            @click="confirm(item)"
          >
            Select
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    showDialog: {
      type: Boolean,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      dialogVisible: false,
      loading: true,
      productsData: [],
      headers: [
        { title: 'Image', key: 'image' },
        { title: 'Title', key: 'title' },
        { title: 'Price', key: 'fullPrice' },
        { title: 'Reviews', key: 'reviewsCounts' },
        { title: 'Rating', key: 'starts' },
        { title: 'Select', key: 'select' },
      ],
    };
  },
  watch: {
    showDialog: {
      immediate: true,
      handler(newVal) {
        this.dialogVisible = newVal;
        if (newVal) {
          this.fetchProductData();
        }
      },
    },
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    },
    
    async fetchProductData() {
      try {
        this.loading = true;
        await axios.get(`http://localhost:3000/find/${this.description}`)
          .then((response) => {
            this.productsData = response.data;
          })
          .catch((error) => {
            console.error('Error fetching product data:', error);
          });
      } catch (error) {
        console.error('Error loading product data:', error);
      } finally {
        this.loading = false;
      }
    },

    confirm(item) {
      this.closeDialog();
      this.$emit('selectedItem', item);
    },
  },
};
</script>
