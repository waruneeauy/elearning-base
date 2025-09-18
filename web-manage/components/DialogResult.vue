<template>
  <q-dialog v-model="modalResult" class="q-ma-md" maximized>
    <q-card>
      <q-card-section class="row items-center q-pa-sm">
        <div class="text-bold">Export Report</div>
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
        <q-btn
          color="primary"
          icon="archive"
          label="Export Result"
          class="q-mb-md"
          no-caps
          @click="exportResult()"
        />

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
import type { ResponseResult } from "~/types/response/course";
import { ref, onMounted, watch } from "vue";
import { useApi } from "~/api/useApi";

import * as XLSX from "xlsx";

const $q = useQuasar();

const props = defineProps({
  ids: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const modalResult = defineModel<boolean>("modalResult", {
  required: true,
});

const loading = ref<boolean>(false);
const pagination = ref({
  rowsPerPage: 0,
});
const rows = ref<ResponseResult[]>([]);
const columns = ref<QTableProps["columns"]>([
  {
    name: "no",
    align: "left",
    label: "No",
    field: "no",
    sortable: false,
  },
  {
    name: "name",
    align: "left",
    label: "Name",
    field: "name",
    sortable: false,
  },
  {
    name: "email",
    align: "left",
    label: "Email",
    field: "email",
    sortable: false,
  },
  {
    name: "companyName",
    align: "left",
    label: "Company Name",
    field: "companyName",
    sortable: false,
  },
  {
    name: "position",
    align: "left",
    label: "Position",
    field: "position",
    sortable: false,
  },
  {
    name: "phoneNumber",
    align: "left",
    label: "Phone Number",
    field: "phoneNumber",
    sortable: false,
  },
  {
    name: "courseTitle",
    align: "left",
    label: "Course Title",
    field: "courseTitle",
    sortable: false,
  },
  {
    name: "dateStarted",
    align: "left",
    label: "Date Started",
    field: "dateStarted",
    format: (val: string) => {
      return val ? new Date(val).toLocaleDateString() : "-";
    },
    sortable: false,
  },
  {
    name: "dateCompleted",
    align: "left",
    label: "Date Completed",
    field: "dateCompleted",
    format: (val: string) => {
      return val ? new Date(val).toLocaleDateString() : "-";
    },
    sortable: false,
  },
  {
    name: "learningProgress",
    align: "left",
    label: "Learning Progress",
    field: "learningProgress",
    format: (val: string) => {
      return `${val}%`;
    },
    sortable: false,
  },
  {
    name: "latestAccess",
    align: "left",
    label: "Latest Access",
    field: "latestAccess",
    format: (val: string) => {
      return val ? new Date(val).toLocaleDateString() : "-";
    },
    sortable: false,
  },
  {
    name: "score",
    align: "left",
    label: "Score",
    field: "score",
    format: (val: string, row: any) => {
      return `${val} / ${row.scoreTotal}`;
      // return val;
    },
    sortable: false,
  },
]);

async function fetchLists() {
  loading.value = true;
  const ids = props.ids.map((x: any) => x.id);
  const response: any = await useApi("POST", `/customer-user/report`, {
    ids,
  });
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
  modalResult, // Directly watch the ref
  (value) => {
    console.log(value);
    if (value) {
      fetchLists();
    }
  }
);

async function exportResult() {
  try {
    const header = columns.value?.map((col: any) => col.label); // หัวตารางจาก label
    const data = rows.value.map((row: any) => {
      return columns.value?.reduce((acc: Record<string, any>, col: any) => {
        const value = col.field && row[col.field];
        if (col.format) {
          acc[col.label] = col.format(value, row); // ใช้ฟอร์แมตถ้ามี
        } else {
          acc[col.label] = value !== undefined ? value : "-"; // ค่าเริ่มต้น
        }
        return acc;
      }, {});
    });

    const worksheet = XLSX.utils.json_to_sheet(data, { header });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Exported Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ExportResult.xlsx";
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    $q.notify({ type: "negative", message: "Failed to download Excel file." });
  }
}
</script>
