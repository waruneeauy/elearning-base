<template>
  <div class="q-pa-md q-gutter-sm">
    <q-breadcrumbs>
      <q-breadcrumbs-el label="กลุ่มผู้อบรม" to="/organization" />
      <q-breadcrumbs-el label="รายการผู้อบรม" />
    </q-breadcrumbs>
  </div>

  <div class="row col-12 q-px-md justify-end">
    <q-select
      outlined
      dense
      label="คอร์ส"
      v-model="store.courseId"
      :options="setNoOptions"
      map-options
      emit-value
      style="min-width: 100px"
      bg-color="blue-1"
    />
    <q-space />

    <q-btn
      color="secondary"
      icon="add"
      label="Generate Code for Users"
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
      selection="multiple"
      v-model:selected="selected"
      @request="onRequest"
    >
      <template v-slot:top>
        <q-select
          outlined
          dense
          v-model="store.statusUsed"
          :options="options"
          label="สถานะการใช้รหัส"
          map-options
          emit-value
          style="min-width: 120px"
          @update:model-value="filterType"
        ></q-select>

        <q-btn
          v-if="store.statusUsed"
          color="positive"
          icon="check"
          label="Completed"
          class="ml-2"
          :disabled="!selected.length || exportType != 'Completed'"
          no-caps
          @click="onCompleted()"
        />
        <q-btn
          v-if="store.statusUsed"
          color="primary"
          icon="file_download"
          label="Export Result"
          class="ml-2"
          :disabled="!selected.length || exportType != 'Export Result'"
          no-caps
          @click="
            () => {
              modalResult = true;
            }
          "
        />

        <q-space />

        <q-btn
          v-if="store.statusUsed === false"
          color="primary"
          icon="archive"
          label="Export Code"
          class="mr-2"
          no-caps
          @click="onExportCode()"
        />
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
          <q-th auto-width class="text-left">
            <q-select
              v-if="store.statusUsed"
              outlined
              dense
              options-dense
              v-model="exportType"
              :options="['Completed', 'Export Result']"
              map-options
              emit-value
              class="q-mb-xs"
              style="font-size: 12px"
            />
            <q-checkbox
              v-if="store.statusUsed"
              keep-color
              color="primary"
              dense
              v-model="props.selected"
              label="Select All"
            />
          </q-th>
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-checkbox
              v-if="
                store.statusUsed &&
                ((props.row.status !== 'DONE' && exportType == 'Completed') ||
                  exportType == 'Export Result')
              "
              keep-color
              color="primary"
              dense
              v-model="props.selected"
            />
          </q-td>
          <q-td auto-width class="q-gutter-x-sm">
            <!-- <q-btn
              v-if="props.row.status === 'DONE'"
              dense
              color="info"
              size="sm"
              icon="photo"
              @click="
                () =>
                  router.push(
                    `/organization/${route.params.customerId}/users/${props.row.id}`
                  )
              "
            >
              <q-tooltip>Click remove</q-tooltip>
            </q-btn> -->
            <q-btn
              v-if="props.row.isUsed"
              dense
              color="primary"
              size="sm"
              icon="video_library"
              @click="
                async () => {
                  dataRowId = await props.row.id;
                  modalViewVideo = true;
                }
              "
            >
              <q-tooltip>Click view detail</q-tooltip>
            </q-btn>

            <q-btn
              dense
              color="primary"
              size="sm"
              icon="edit"
              @click="
                async () =>
                  openEditExpire(
                    props.row.id,
                    props.row.expiredDate,
                    props.row.deadlineDate
                  )
              "
            >
              <q-tooltip>Edit expired and deadline</q-tooltip>
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
            <div v-if="col.name === 'isUsed'" class="text-center">
              <q-icon
                :color="!col.value ? 'green-4' : 'red'"
                :name="!col.value ? 'check' : 'close'"
                size="sm"
              />
            </div>
            <div v-else>{{ col.value }}</div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>

  <GenerateCodeForUser
    v-model:modal="modal"
    :course-Id="store.courseId"
    :fetch-lists="fetchLists"
  />
  <UpdateExpire
    v-model:modal="modalEditExpire"
    :id="editId"
    :expire-date="expiredDate"
    :deadlined-date="deadlineDate"
    :fetch-lists="fetchLists"
  />

  <DialogViewVideo v-model:modalViewVideo="modalViewVideo" :id="dataRowId" />
  <DialogResult v-model:modalResult="modalResult" :ids="selected" />
</template>

<script setup lang="ts">
import type { QTableProps } from "quasar";
import { ref, onMounted } from "vue";
import { useApi } from "~/api/useApi";
import type { CodeResponse, Option } from "~/types/response/user";
import GenerateCodeForUser from "~/components/User/GenerateCodeForUser.vue";
import DialogViewVideo from "@/components/DialogViewVideo.vue";
import DialogResult from "@/components/DialogResult.vue";
import { useCustomerStore } from "~/stores/customer";
import * as XLSX from "xlsx";
import UpdateExpire from "~/components/User/UpdateExpire.vue";

const modalViewVideo = ref<boolean>(false);
const dataRowId = ref<string>("");
const modalResult = ref<boolean>(false);
const modalEditExpire = ref<boolean>(false);

const editId = ref<string>("");
const expiredDate = ref<Date | null>(new Date());
const deadlineDate = ref<Date | null>(new Date());

const route = useRoute();
const store = useCustomerStore();
const modal = ref<boolean>(false);
const dataRow = ref<CodeResponse | null>(null);
const setNoOptions = ref<Option[]>([]);
const selected = ref<string[]>([]);
const exportType = ref<string>("Completed");

const $q = useQuasar();

function convertStatus(status: string) {
  switch (status) {
    case "START":
      return "Starting";
    case "INPROGRESS":
      return "In Progress";
    case "DONE":
      return "Finished";
    default:
      return status;
  }
}

const columns = ref<QTableProps["columns"]>([
  {
    name: "code",
    align: "left",
    label: "Code",
    field: "code",
    sortable: true,
  },
  {
    name: "isUsed",
    align: "left",
    label: "Available",
    field: "isUsed",
    sortable: true,
  },
  {
    name: "status",
    align: "left",
    label: "Tested",
    field: "status",
    format: (val: string, row) => (row.isUsed ? convertStatus(val) : "-"),
    sortable: true,
  },
  {
    name: "learnerUser",
    align: "left",
    label: "Learner Name",
    field: "learner",
    format: (val) => (!val ? "-" : val.name),
    sortable: true,
  },
  {
    name: "usedAt",
    align: "left",
    label: "Date Started",
    field: "usedAt",
    format: (val: string) => (val ? new Date(val).toLocaleString() : "-"),
    sortable: true,
  },
  {
    name: "completedDate",
    align: "left",
    label: "Date Completed",
    field: "completedDate",
    format: (val: string) => (val ? new Date(val).toLocaleString() : "-"),
    sortable: true,
  },
  {
    name: "expiredDate",
    align: "left",
    label: "Expired",
    field: "expiredDate",
    format: (val: string) => (val ? new Date(val).toLocaleDateString() : "-"),
    sortable: true,
  },
  {
    name: "deadlineDate",
    align: "left",
    label: "Deadline",
    field: "deadlineDate",
    format: (val: string) => (val ? new Date(val).toLocaleDateString() : "-"),
    sortable: true,
  },
  {
    name: "createdAt",
    align: "left",
    label: "Created At",
    field: "createdAt",
    format: (val: string) => new Date(val).toLocaleString(),
    sortable: true,
  },
]);

const tableRef = ref<any>();
const rows = ref<CodeResponse[]>([]);
const filter = ref<string>("");
const options = ref<Option[]>([
  { label: "ALL", value: null },
  { label: "Available", value: false },
  { label: "Is used", value: true },
]);
const loading = ref<boolean>(false);
const pagination = ref({
  sortBy: "createdAt",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
});

function onRequest(props: any) {
  const { pagination: newPagination } = props; // Get the new pagination values
  loading.value = true;
  pagination.value = { ...pagination.value, ...newPagination }; // Update pagination state
  setTimeout(async () => {
    fetchLists();
  }, 1000);
}

async function fetchLists() {
  loading.value = true;
  const response: any = await useApi(
    "GET",
    `/customer-user/${route.params.customerId}/${store.courseId}?page=${pagination.value.page}&pageSize=${pagination.value.rowsPerPage}${store.statusUsed != null ? "&status=" + store.statusUsed : ""}&keyword=${filter.value}&sortBy=${pagination.value.sortBy}&descending=${pagination.value.descending}`
  );
  if (response.data) {
    rows.value = await (response.data.result.total > 0
      ? response.data.result.items
      : []);
    pagination.value.rowsNumber = response.data.result.total;
    loading.value = false;
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
}

function filterType() {
  pagination.value.page = 1;
  fetchLists();
}

/**
 * function open form
 * @param row edit send row data
 */
function openFormDialog(row?: CodeResponse) {
  if (row) {
    dataRow.value = row;
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
    const response: any = await useApi("DELETE", `/customer-user/${id}`);
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

async function fetchCourseLists() {
  const response: any = await useApi("GET", "/course/list");
  if (response.data) {
    setNoOptions.value = await response.data.result.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
    store.courseId = response.data.result[0].id;
    await fetchLists();
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
}

const onExportCode = () => {
  try {
    const customColumns = ref<QTableProps["columns"]>([
      {
        label: "Code",
        field: "code",
        name: "code",
      },
      {
        label: "Created At",
        field: "createdAt",
        name: "createdAt",
        format: (val: string) => new Date(val).toLocaleString(),
      },
    ]);

    const header = customColumns.value?.map((col: any) => col.label); // หัวตารางจาก label
    const data = rows.value.map((row: any) => {
      return customColumns.value?.reduce(
        (acc: Record<string, any>, col: any) => {
          const value = col.field && row[col.field];
          if (col.format) {
            acc[col.label] = col.format(value, row); // ใช้ฟอร์แมตถ้ามี
          } else {
            acc[col.label] = value !== undefined ? value : "-"; // ค่าเริ่มต้น
          }
          return acc;
        },
        {}
      );
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
    link.download = "ExportCode.xlsx";
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    $q.notify({ type: "negative", message: "Failed to download Excel file." });
  }
};

function onCompleted() {
  $q.dialog({
    title: "Confirm completed",
    message: "Would you like to completed this data?",
    cancel: true,
    persistent: true,
    ok: {
      color: "positive",
    },
  }).onOk(async () => {
    $q.loading.show();
    const ids = selected.value.map((x: any) => x.id);
    const response: any = await useApi("POST", "/customer-user/completed", {
      ids,
    });
    if (response.data) {
      $q.loading.hide();
      $q.notify({
        message: "Completed successfully",
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

function openEditExpire(id: string, expired: Date, deadline: Date) {
  editId.value = id;
  expiredDate.value = expired ? new Date(expired) : null;
  deadlineDate.value = deadline ? new Date(deadline) : null;
  modalEditExpire.value = true;
}

onMounted(async () => {
  await fetchCourseLists();
});
</script>
