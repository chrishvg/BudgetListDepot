<template>
  <v-row style="height: 6vh" class="d-flex">
    <v-col cols="12">
      <FileInputComponent @listMaterials="getListMaterials"/>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <ListOfMaterials :materials="listData" @delete="deleteItem"/>
    </v-col>
  </v-row>
</template>

<script>
import FileInputComponent from './FileInput.vue';
import ListOfMaterials from './ListOfMaterials.vue';

export default {
  components:{
    FileInputComponent,
    ListOfMaterials
  },
  data() {
    return {
      scrapedData: null,
      listData:[],
    }
  },

  methods: {
    getListMaterials(listMaterials) {
      this.listData = listMaterials
    },
    deleteItem(id) {
      this.listData = this.listData.filter(item => item.id !== id);
    },
  }
};
</script>