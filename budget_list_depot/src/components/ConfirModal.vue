<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="headline">Confirmation</v-card-title>
      <v-card-text>Are you sure you want to remove this item?</v-card-text>
      <v-card-actions>
        <v-btn
          class="text-none text-subtitle-1"
          color="red"
          size="small"
          variant="elevated"
          @click="deleteConfirm"
        >
          Delete
        </v-btn>
        <v-btn
          class="text-none text-subtitle-1"
          color="grey"
          size="small"
          variant="elevated"
          @click="closeDialog"
        >
        Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
  export default {
    props: {
      showDialog: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        dialog: this.showDialog,
      }
    },
    methods: {
      deleteConfirm() {
        this.$emit('confirmDelete')
      },
      closeDialog() {
        this.$emit('closeDialog')
      },
    },
  }
</script>