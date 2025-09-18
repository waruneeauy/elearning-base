<template>
  <q-dialog v-model="modalViewVideo" class="q-ma-md" maximized>
    <q-card>
      <q-card-section class="row items-center q-pa-sm">
        <div class="text-bold">Course Detail</div>
        <q-space />
        <q-btn
          rounded
          icon="close"
          color="red"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>

      <q-separator />
      <q-card-section class="q-pa-lg">
        <q-table
          v-model:pagination="pagination"
          :loading="loading"
          :columns="columns"
          :rows="rows"
          row-key="id"
          wrap-cells
          no-data-label="No data available"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { QTableProps } from "quasar";
import type { ViewVideoResponse } from "~/types/response/course";
import { ref, onMounted, watch } from "vue";
import { useApi } from "~/api/useApi";
const $q = useQuasar();

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
});

const modalViewVideo = defineModel<boolean>("modalViewVideo", {
  required: true,
});

const loading = ref<boolean>(false);
const pagination = ref({
  page: 1,
  rowsPerPage: 100,
  rowsNumber: 100,
});
const rows = ref<ViewVideoResponse[]>([]);
const columns = ref<QTableProps["columns"]>([
  {
    name: "title",
    align: "left",
    label: "Title",
    field: "title",
    sortable: false,
  },
  {
    name: "type",
    align: "left",
    label: "Type",
    field: "type",
    sortable: false,
  },
  {
    name: "startTime",
    align: "left",
    label: "View Video Start",
    field: "startTime",
    format: (value: string, row: any) => {
      return row.type == "VIDEO" && value
        ? new Date(value).toLocaleString()
        : "";
    },
    sortable: false,
  },
  {
    name: "endTime",
    align: "left",
    label: "View Video Start End",
    field: "endTime",
    format: (value: string, row: any) => {
      return row.type == "VIDEO" && value
        ? new Date(value).toLocaleString()
        : "";
    },
    sortable: false,
  },
  {
    name: "score",
    align: "left",
    label: "Score/Minutes",
    field: "score",
    format: (value: number, row: any) => {
      return row.type === "VIDEO"
        ? row.minute
        : row.type === "QUIZ"
          ? `${value}/${row.fullScore}`
          : "-";
    },
    sortable: false,
  },
]);

async function fetchLists() {
  loading.value = true;
  const response: any = await useApi("GET", `/customer-user/${props.id}`);
  if (response.data) {
    rows.value = response.data.result;
    loading.value = false;
  } else {
    loading.value = false;
    $q.notify({
      message: response.error,
      color: "negative",
      position: "top",
      actions: [
        {
          label: "Close",
          color: "white",
          handler: () => undefined,
        },
      ],
    });
  }
}

watch(
  modalViewVideo, // Directly watch the ref
  (value) => {
    console.log(value);
    if (value) {
      fetchLists();
    }
  }
);
</script>
