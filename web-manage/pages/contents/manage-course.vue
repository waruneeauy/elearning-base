<template>
  <div class="q-pa-md q-gutter-sm">
    <q-breadcrumbs>
      <q-breadcrumbs-el label="จัดการหลักสูตร" to="/contents" />
      <q-breadcrumbs-el label="จัดการคอร์ส" />
    </q-breadcrumbs>
  </div>

  <div class="row col-12 q-px-md justify-end">
    <q-btn
      color="secondary"
      icon="add"
      label="สร้างคอร์ส"
      @click="() => openFormDialog()"
    />
  </div>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      ref="tableRef"
      :rows="rows"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      :loading="loading"
      :filter="filter"
      binary-state-sort
      separator="cell"
      :rows-per-page-options="[10, 25, 50, 100]"
      @request="onRequest"
    >
      <template v-slot:top>
        <q-select
          outlined
          dense
          v-model="type"
          :options="options"
          label="สถานะ"
          map-options
          emit-value
          style="min-width: 120px"
          @update:model-value="filterType"
        ></q-select>

        <q-space />

        <q-input
          outlined
          dense
          debounce="300"
          v-model="filter"
          placeholder="ค้นหา"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width class="q-gutter-sm">
            <q-btn
              dense
              color="info"
              size="sm"
              icon="edit"
              @click="() => openFormDialog(props.row)"
            >
              <q-tooltip>Click edit</q-tooltip>
            </q-btn>

            <q-btn
              dense
              color="negative"
              size="sm"
              icon="delete"
              @click="() => onRemove(props.row.id)"
            >
              <q-tooltip>Click remove</q-tooltip>
            </q-btn>
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <div v-if="col.name === 'isActive'" class="text-center">
              <q-icon
                :color="!col.value ? 'red' : 'green-4'"
                :name="!col.value ? 'close' : 'check'"
                size="sm"
              />
            </div>
            <div v-else>{{ col.value }}</div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>

  <AddCourse v-model:modal="modal" :data="dataRow" :fetch-lists="fetchLists" />
</template>

<script setup lang="ts">
import { useQuasar, type QTableProps } from "quasar";
import { ref, onMounted } from "vue";
import { useApi } from "~/api/useApi";
import type { OrgResponse, Option } from "~/types/response/org";
import AddCourse from "~/components/Question/AddCourse.vue";

const config = useRuntimeConfig();
const $q = useQuasar();

const modal = ref<boolean>(false);
const dataRow = ref<OrgResponse | null>(null);
const columns = ref<QTableProps["columns"]>([
  {
    name: "name",
    align: "left",
    label: "ชื่อคอร์ส",
    field: "name",
    sortable: true,
  },
  {
    name: "description",
    align: "left",
    label: "รายละเอียด",
    field: "description",
    sortable: true,
  },
  {
    name: "isActive",
    align: "left",
    label: "สถานะ",
    field: "isActive",
    sortable: false,
  },
  {
    name: "updatedAt",
    align: "left",
    label: "updated At",
    field: "updatedAt",
    format: (val: string) => new Date(val).toLocaleString(),
    sortable: true,
  },
]);

const originalRows = ref<OrgResponse[]>([]);

const tableRef = ref<any>();
const rows = ref<OrgResponse[]>([]);
const filter = ref<string>("");
const type = ref<boolean>(true);
const options = ref<Option[]>([
  { label: "Active", value: true },
  { label: "Not Active", value: false },
]);
const loading = ref<boolean>(false);

let pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 1,
  sortBy: "updatedAt",
  descending: false,
});

async function fetchLists() {
  loading.value = true;
  const response: any = await useApi(
    "GET",
    `/course?page=${pagination.value.page}&pageSize=${pagination.value.rowsPerPage}&status=${type.value}&keyword=${filter.value}&sortBy=${pagination.value.sortBy}&descending=${pagination.value.descending}`
  );
  if (response.data) {
    rows.value = await response.data.result.items;
    pagination.value = {
      ...pagination.value,
      rowsNumber: response.data.result.total,
    };
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

function onRequest(props: any) {
  const { pagination: newPagination } = props; // Get the new pagination values

  loading.value = true;
  pagination.value = { ...pagination.value, ...newPagination }; // Update pagination state

  fetchLists();
}

function filterType() {
  rows.value.splice(
    0,
    rows.value.length,
    ...originalRows.value.filter(
      (row: OrgResponse) => row.isActive === type.value
    )
  );

  fetchLists();
}

/**
 * function open form
 * @param row edit send row data
 */
function openFormDialog(row?: OrgResponse) {
  if (row) {
    dataRow.value = row;
  } else {
    dataRow.value = null;
  }
  modal.value = true;
}

function onRemove(id: string) {
  $q.dialog({
    title: "ยืนยันการลบ",
    message: "คุณต้องการลบข้อมูลนี้ใช่หรือไม่?",
    cancel: true,
    persistent: true,
    ok: {
      color: "negative",
    },
  }).onOk(async () => {
    $q.loading.show();
    const response: any = await useApi("DELETE", `/course/${id}`);
    if (response.data) {
      $q.loading.hide();
      $q.notify({
        message: "Remove successfully",
        color: "positive",
        position: "top",
        closeBtn: true,
      });
      fetchLists();
    } else {
      $q.loading.hide();
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
  });
}

onMounted(async () => {
  await fetchLists();
});
</script>

<style scoped></style>
