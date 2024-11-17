<template>
  <v-card flat>
    <v-card-title class="d-flex">
      <v-toolbar color="cyan" dark class="text-center">
        <v-toolbar-title>Materials</v-toolbar-title>
      </v-toolbar>

      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        label="Search"
        single-line
        flat
        hide-details
        variant="solo-filled"
      ></v-text-field>
    </v-card-title>

    <v-card-text>
    <v-data-table
      :search="search"
      :headers="headers"
      :items="materials"
      :items-per-page="itemsPerPage"
      :group-by="groupBy"
      item-value="id"
    >
      <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
        <tr>
          <td :colspan="columns.length">
            <VBtn
              size="small"
              variant="text"
              :icon="isGroupOpen(item) ? '$expand' : '$next'"
              @click="toggleGroup(item)"
            ></VBtn>
            {{ item.value }}
          </td>
        </tr>
      </template>
      <template v-slot:[`item.selectedPrice`]="{ item }">
        <v-chip color="primary">
          <v-icon class="me-1" color="black">
            mdi-currency-usd
          </v-icon>
          <span class="text-black">{{ item.selectedPrice }}</span>
        </v-chip>
      </template>
      <template v-slot:[`item.unit`]="{ item }">
        <v-chip color="orange-accent-2">
          <span class="text-black">{{ item.unit }}</span>
        </v-chip>
      </template>
      <template v-slot:[`item.totalPrice`]="{ item }">
        <v-chip color="green">
          <v-icon class="me-1" color="black">
            mdi-currency-usd
          </v-icon>
          <span class="text-black">{{ item.totalPrice }}</span>
        </v-chip>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          class="me-2"
          @click="selectItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          class="me-2"
          @click="deleteItem(item.id)"
        >
          mdi-close	
        </v-icon>
      </template>
      <template v-slot:[`body.append`]>
        <tr>
          <td colspan="8">
            <v-chip>
              <span class="text-h6">Total</span>
            </v-chip>
          </td>
          <td class="text-right">
            <v-chip color="green">
              <v-icon class="me-1" >
                mdi-currency-usd
              </v-icon>
              <span class="text-black text-h6">{{ totalGlobal }}</span>
            </v-chip>
          </td>
        </tr>
      </template>
    </v-data-table>
  <ConfirModal v-model="showModalDelete" 
    @confirmDelete="confirmDelete" 
    @closeDialog="closeConfirmModal" 
  />
  <MaterialsModal v-model="showModalMaterials"
    :showDialog="showModalMaterials"
    :description="description"
    @closeDialog="closeMaterialsModal"
    @selectedItem="fillSelectedItem"
  />
  </v-card-text>
  </v-card>
</template>
  
<script>
  import { ref } from 'vue';
  import ConfirModal from './ConfirModal';
  import MaterialsModal from "./MaterialsModal";
  
  export default {
    components: {
      ConfirModal,
      MaterialsModal,
    },
    props: {
      materials: {
        type: Array,
        required: false
      }
    },
    data() {
      return {
        search: ref(''),
        itemsPerPage: 12,
        showModalDelete: false,
        showModalMaterials: false,
        idSelected: null,
        description: '',
        totalGlobal: 0,
        groupBy: [
          { key: 'group', order: 'asc' },
        ],
        headers: [
          { title: 'Description', key: 'description' },
          { title: 'Size', key: 'size' },
          { title: 'Count', key: 'count' },
          { title: 'Selected Name', key: 'selectedName' },
          { title: 'Selected Price', key: 'selectedPrice' },
          { title: 'Units', key: 'unit' },
          { title: 'Total Price', key: 'totalPrice' },
          { title: 'Actions', key: 'actions', sortable: false },
        ],
      }
    },
    methods: {
      selectItem(item) {
        this.showModalMaterials = true
        this.idSelected = item.id
        this.description = item.description
      },
      deleteItem(id) {
        this.idSelected = id
        this.showModalDelete = true
      },
      confirmDelete() {
        this.$emit('delete', this.idSelected)
        this.closeConfirmModal()
      },
      closeConfirmModal() {
        this.showModalDelete = false
        this.idSelected = null
      },
      closeMaterialsModal() {
        this.showModalMaterials = false
      },
      calculateTotalGlobal() {
        let materialsWithTotalPrice = this.materials.filter(material => material.totalPrice != null)
        this.totalGlobal = materialsWithTotalPrice.reduce((acc, curr) => acc + parseFloat(curr.totalPrice), 0)
      },
      async fillSelectedItem(item) {
        await this.materials.map(material => {
          if (material.id === this.idSelected) {
            material.selectedName = item.title
            material.selectedPrice = item.priceDolars + '.' + item.priceCents
            material.unit = item.unit[0] == '/' ? item.unit.substring(1) : item.unit
            material.totalPrice = parseFloat(material.selectedPrice) * parseFloat(material.count)
          }
        })
        this.calculateTotalGlobal()
      },
    },
  };
  </script>