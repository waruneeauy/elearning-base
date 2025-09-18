<template>
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
      @update:model-value="fetchCourses()"
    />
    <q-btn color="green" icon="list" flat rounded @click="goToAddCourse()">
      <q-tooltip>คลิกเพื่อจัดการคอร์ส</q-tooltip>
    </q-btn>
    <q-space />
    <q-btn
      color="primary"
      icon="list"
      label="เรียงลำดับ"
      class="q-mr-sm"
      @click="() => updateOrdering()"
    />
    <q-btn
      color="secondary"
      icon="add"
      label="เพิ่มหลักสูตรในระดับหลัก"
      @click="
        () => {
          dataRow = null;
          openFormDialog();
        }
      "
    />
  </div>

  <div class="q-pa-md q-gutter-sm">
    <div class="row col-12 text-weight-bold text-primary">Main</div>
    <q-tree
      :nodes="data.filter((item: any) => item.isMain)"
      node-key="id"
      v-model:expanded="expanded"
      default-expand-all
    >
      <template v-slot:default-header="prop">
        <div class="row items-center">
          <div :class="prop.node.level === 0 ? 'text-weight-bold' : ''">
            {{ prop.node.label }}
          </div>
        </div>
        <div class="row justify-end">
          <q-btn
            v-if="prop.node.level === 0"
            color="green"
            icon="add"
            flat
            class="q-pa-sm"
            @click="() => openFormDialogAdd(prop.node.id, prop.node.isMain)"
          />
          <q-btn
            color="primary"
            icon="edit"
            flat
            class="q-pa-sm"
            @click="
              () =>
                prop.node.level === 0
                  ? openFormDialog(prop.node)
                  : openFormDialogEdit(prop.node)
            "
          >
            <q-tooltip>Click for edit</q-tooltip>
          </q-btn>
          <q-btn
            v-if="prop.node.level > 0 && prop.node.type !== 'QUIZ'"
            color="negative"
            icon="delete"
            flat
            class="q-pa-sm"
            @click="() => onRemoveChild(prop.node.id)"
          >
            <q-tooltip>Click for remove</q-tooltip>
          </q-btn>
        </div>
      </template>

      <template v-slot:default-body="prop">
        <!-- <div v-if="prop.node.description" class="row col-12 q-mb-md">
          {{ prop.node.description }}
        </div> -->
        <div v-if="prop.node.level === 1" class="row justify-start">
          <q-btn
            flat
            v-if="
              prop.node.type === 'DOCUMENT' || prop.node.type === 'SIMULATION'
            "
            class="text-blue"
            @click="() => router.push(`/contents/${prop.node.id}`)"
          >
            <q-tooltip>Edit context</q-tooltip>
            <q-icon name="description" size="sm" /> Context
          </q-btn>
          <q-btn
            flat
            v-else-if="prop.node.type === 'VIDEO'"
            class="text-blue"
            @click="() => router.push(`/contents/${prop.node.id}`)"
          >
            <q-tooltip>Edit video</q-tooltip>
            <q-icon name="videocam" size="sm" /> Video
          </q-btn>
          <q-btn
            flat
            v-else-if="prop.node.type === 'QUIZ'"
            class="text-blue"
            @click="() => router.push(`/contents/quiz/${prop.node.id}`)"
          >
            <q-tooltip>Edit quiz</q-tooltip>
            <q-icon name="quiz" size="sm" /> Quiz
          </q-btn>

          <q-btn v-if="prop.node.isLocked" flat class="text-caption q-pl-md">
            <q-icon name="lock" size="sm" /> isLocked
          </q-btn>

          <q-btn v-if="prop.node.duration" flat class="text-caption q-pl-md">
            <q-icon name="timer" size="sm" /> {{ prop.node.duration }} Minute
          </q-btn>
        </div>
      </template>
    </q-tree>

    <div class="row col-12 text-weight-bold text-primary">Optional</div>
    <q-tree
      :nodes="data.filter((item: any) => !item.isMain)"
      node-key="id"
      v-model:expanded="expanded"
      default-expand-all
    >
      <template v-slot:default-header="prop">
        <div class="row items-center">
          <div :class="prop.node.level === 0 ? 'text-weight-bold' : ''">
            {{ prop.node.label }}
          </div>
        </div>
        <div class="row justify-end">
          <q-btn
            v-if="prop.node.level === 0"
            color="green"
            icon="add"
            flat
            class="q-pa-sm"
            @click="() => openFormDialogAdd(prop.node.id, prop.node.isMain)"
          />
          <q-btn
            color="primary"
            icon="edit"
            flat
            class="q-pa-sm"
            @click="
              () =>
                prop.node.level === 0
                  ? openFormDialog(prop.node)
                  : openFormDialogEdit(prop.node)
            "
          >
            <q-tooltip>Click for edit</q-tooltip>
          </q-btn>
          <q-btn
            v-if="prop.node.level > 0 && prop.node.type !== 'QUIZ'"
            color="negative"
            icon="delete"
            flat
            class="q-pa-sm"
            @click="() => onRemoveChild(prop.node.id)"
          >
            <q-tooltip>Click for remove</q-tooltip>
          </q-btn>
        </div>
      </template>

      <template v-slot:default-body="prop">
        <!-- <div v-if="prop.node.description" class="row col-12 q-mb-md">
          {{ prop.node.description }}
        </div> -->
        <div v-if="prop.node.level === 1" class="row justify-start">
          <q-btn
            flat
            v-if="prop.node.type === 'DOCUMENT'"
            class="text-blue"
            @click="() => router.push(`/contents/${prop.node.id}`)"
          >
            <q-tooltip>Edit quiz context</q-tooltip>
            <q-icon name="quiz" size="sm" /> Quiz File
          </q-btn>
          <q-btn
            flat
            v-else-if="prop.node.type === 'VIDEO'"
            class="text-blue"
            @click="() => router.push(`/contents/${prop.node.id}`)"
          >
            <q-tooltip>Edit video</q-tooltip>
            <q-icon name="videocam" size="sm" /> Video
          </q-btn>

          <q-btn v-if="prop.node.isLocked" flat class="text-caption q-pl-md">
            <q-icon name="lock" size="sm" /> isLocked
          </q-btn>

          <q-btn v-if="prop.node.duration" flat class="text-caption q-pl-md">
            <q-icon name="timer" size="sm" /> {{ prop.node.duration }} Minute
          </q-btn>
        </div>
      </template>
    </q-tree>
  </div>

  <AddCourseRoot
    v-model:modal="modal"
    :data="dataRow"
    :fetch-lists="fetchCourses"
    :course-id="store.courseId"
    :on-reset="onResetRoot"
  />

  <AddCourseChild
    v-model:modal="modalChild"
    :fetch-lists="fetchCourses"
    :course-id="store.courseId"
    :course-root-id="courseRootId"
    :data="childData"
    :on-reset="onResetChild"
    :is-main="isMain"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useApi } from "~/api/useApi";
import type { Option } from "~/types/response/question";
import { useQuestionStore } from "~/stores/question.js";
import AddCourseRoot from "~/components/Question/AddCourseRoot.vue";
import type {
  CourseChildResponse,
  CourseRootResponse,
} from "~/types/response/course";
import AddCourseChild from "~/components/Question/AddCourseChild.vue";

const router = useRouter();
const setNoOptions = ref<Option[]>([]);

const modal = ref<boolean>(false);
const modalChild = ref<boolean>(false);
const dataRow = ref<CourseRootResponse | null>(null);

const $q = useQuasar();
const store = useQuestionStore();

const data = ref<any>([]);
const expanded = ref([]);
async function fetchCourses() {
  const response: any = await useApi(
    "GET",
    "/course/curriculum/" + store.courseId
  );
  if (response.data) {
    data.value = await response.data.result;
    expanded.value = await response.data.result.map((item: any) => item.id);
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

async function fetchSetLists() {
  const response: any = await useApi("GET", "/course/list");
  if (response.data) {
    setNoOptions.value = await response.data.result.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
    store.courseId = setNoOptions.value[0].value;
    fetchCourses();
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

/**
 * function open form
 * @param row edit send row data
 */
function openFormDialog(row?: CourseRootResponse) {
  if (row) {
    dataRow.value = row;
  }
  modal.value = true;
}

function onResetRoot() {
  dataRow.value = null;
}

const courseRootId = ref<string>("");
/**
 * function open form add child
 * @param row data of child
 */
function openFormDialogAdd(id: string, isMainV: boolean) {
  childData.value = null;
  courseRootId.value = id;
  modalChild.value = true;
  isMain.value = isMainV;
}

const childData = ref<CourseChildResponse | null>(null);
const isMain = ref<boolean>(false);
/**
 * function open form edit child
 * @param row data of child
 */
async function openFormDialogEdit(rows: CourseChildResponse) {
  courseRootId.value = rows.courseRootId;
  childData.value = rows;
  modalChild.value = true;

  const main = await findParent(rows.id);

  isMain.value = main ? main.isMain : false;
}

const findParent = (nodeId: string) => {
  let parent: any = null;
  const searchTree = (nodes: any, parentNode = null) => {
    for (const node of nodes) {
      if (node.id === nodeId) {
        parent = parentNode;
        return;
      }
      if (node.children) {
        searchTree(node.children, node);
      }
    }
  };
  searchTree(data.value);
  return parent;
};

function onResetChild() {
  courseRootId.value = "";
  childData.value = null;
}

// function onRemoveRoot(id: string) {
//   $q.dialog({
// title: "ยืนยันการลบ",
// message: "คุณต้องการลบข้อมูลนี้ใช่หรือไม่?",
//     cancel: true,
//     persistent: true,
//     ok: {
//       color: "negative",
//     },
//   }).onOk(async () => {
//     const response: any = await useApi("DELETE", `/course/root/${id}`);
//     if (response.data) {
//       $q.notify({
//         message: "Remove successfully",
//         color: "positive",
//         position: "top",
//         closeBtn: true,
//       });
//       fetchCourses();
//     } else {
//       $q.notify({
//         message: response.error,
//         color: "negative",
//         position: "top",
//         actions: [
//           {
//             label: "Close",
//             color: "white",
//             handler: () => undefined,
//           },
//         ],
//       });
//     }
//   });
// }

function onRemoveChild(id: string) {
  $q.dialog({
    title: "ยืนยันการลบ",
    message: "คุณต้องการลบข้อมูลนี้ใช่หรือไม่?",
    cancel: true,
    persistent: true,
    ok: {
      color: "negative",
    },
  }).onOk(async () => {
    const response: any = await useApi("DELETE", `/course/child/${id}`);
    if (response.data) {
      $q.notify({
        message: "Remove successfully",
        color: "positive",
        position: "top",
        closeBtn: true,
      });
      fetchCourses();
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

async function updateOrdering() {
  $q.dialog({
    title: "ยืนยันการดำเนินการ",
    message: "คุณต้องการให้ระบบเรียงลำดับคอร์สใหม่ใช่หรือไม่?",
    cancel: true,
    persistent: true,
    ok: {
      color: "negative",
    },
  }).onOk(async () => {
    const response: any = await useApi(
      "PUT",
      `/course/ordering/${store.courseId}`
    );
    if (response.data) {
      $q.notify({
        message: "Updated order successfully",
        color: "positive",
        position: "top",
        closeBtn: true,
      });
      fetchCourses();
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

function goToAddCourse() {
  router.push("/contents/manage-course");
}

onMounted(async () => {
  fetchSetLists();
});
</script>
