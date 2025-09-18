<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      ref="tableRef"
      :rows="rows"
      :columns="columns"
      row-key="email"
      v-model:pagination="pagination"
      :loading="loading"
      :filter="filter"
      binary-state-sort
      separator="cell"
      :rows-per-page-options="[10, 25, 50, 100]"
      @request="onRequest"
    >
      <template v-slot:top>
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
          <q-td class="q-gutter-x-sm">
            <q-btn
              dense
              color="info"
              size="sm"
              icon="refresh"
              label="Reset password"
              style="min-width: 130px"
              class="q-pa-sm"
              @click="() => resetPass(props.row.learnerId)"
            >
              <q-tooltip>Reset password</q-tooltip>
            </q-btn>
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <div v-if="col.name === 'isActive'" class="text-center">
              <q-icon
                :color="col.value ? 'green-4' : 'red'"
                :name="col.value ? 'check' : 'close'"
                size="sm"
              />
            </div>
            <div v-else>{{ col.value }}</div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import type { QTableProps } from "quasar";
import { ref, onMounted } from "vue";
import { useApi } from "~/api/useApi";
import type { UserResponse } from "~/types/response/user";

const $q = useQuasar();

const columns = ref<QTableProps["columns"]>([
  {
    name: "email",
    align: "left",
    label: "Email",
    field: "email",
    sortable: true,
  },
  {
    name: "name",
    align: "left",
    label: "Name",
    field: "name",
    sortable: true,
  },
  {
    name: "pwd",
    align: "left",
    label: "Password",
    field: "pwd",
    sortable: false,
  },
  {
    name: "companyName",
    align: "left",
    label: "Company Name",
    field: "companyName",
    sortable: true,
  },
  {
    name: "position",
    align: "left",
    label: "Position",
    field: "position",
    sortable: true,
  },
  {
    name: "phoneNumber",
    align: "left",
    label: "Phone Number",
    field: "phoneNumber",
    sortable: true,
  },
  {
    name: "updatedAt",
    align: "left",
    label: "Updated At",
    field: "updatedAt",
    format(val, row) {
      return new Date(val).toLocaleString();
    },
    sortable: true,
  },
]);

const originalRows = ref<UserResponse[]>([]);

const tableRef = ref<any>();
const rows = ref<UserResponse[]>([]);
const filter = ref<string>("");
const loading = ref<boolean>(false);
let pagination = ref({
  sortBy: "updatedAt",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
});

function onRequest(props: any) {
  const { pagination: newPagination } = props; // Get the new pagination values
  loading.value = true;
  pagination.value = { ...pagination.value, ...newPagination }; // Update pagination state

  fetchLists();
}

async function fetchLists() {
  loading.value = true;
  const response: any = await useApi(
    "GET",
    `/user?page=${pagination.value.page}&pageSize=${pagination.value.rowsPerPage}&keyword=${filter.value}&sortBy=${pagination.value.sortBy}&descending=${pagination.value.descending}`
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

async function resetPass(id: string) {
  $q.dialog({
    title: "Confirm reset password",
    message: "Would you like to reset password this user?",
    cancel: true,
    persistent: true,
    ok: {
      color: "negative",
    },
  }).onOk(async () => {
    const response: any = await useApi("PUT", `/user/${id}`);
    if (response.data) {
      fetchLists();
    } else {
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
