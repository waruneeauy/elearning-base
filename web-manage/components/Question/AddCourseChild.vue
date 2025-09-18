<template>
  <q-dialog v-model="modal" backdrop-filter="blur(4px)" persistent>
    <q-card flat bordered>
      <q-card-section class="row items-center q-py-sm">
        <div class="text-h6">
          {{ dataForm.id ? "แก้ไข" : "เพิ่ม" }}บทเรียนย่อย
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="onReset()" />
      </q-card-section>

      <q-separator />

      <q-form
        greedy
        @submit.prevent
        @validation-success="onSubmit"
        @reset="onReset"
      >
        <q-card-section
          style="max-height: 50vh; min-width: 400px"
          class="scroll"
        >
          <div class="q-gutter-sm">
            <q-input
              v-model="dataForm.label"
              outlined
              dense
              hide-bottom-space
              label="หัวข้อ *"
              :rules="[(val) => !!val || requiredMsg]"
            />

            <!-- <q-input
              type="textarea"
              rows="3"
              v-model="dataForm.description"
              outlined
              dense
              hide-bottom-space
              label="Description"
            /> -->

            <q-select
              v-model="dataForm.type"
              outlined
              dense
              map-options
              emit-value
              hide-bottom-space
              label="ประเภท *"
              :options="
                isMain
                  ? [
                      { label: 'Content', value: 'DOCUMENT' },
                      { label: 'Video', value: 'VIDEO' },
                      { label: 'Quiz', value: 'QUIZ' },
                    ]
                  : [
                      { label: 'QUIZ FILE', value: 'DOCUMENT' },
                      { label: 'Video', value: 'VIDEO' },
                    ]
              "
              :rules="[(val) => !!val || requiredMsg]"
            />
            <q-input
              v-model="dataForm.minute"
              type="number"
              outlined
              dense
              hide-bottom-space
              label="นาที *"
              :rules="[(val) => !!val || requiredMsg]"
            />

            <q-input
              v-model="dataForm.ordering"
              type="number"
              outlined
              dense
              hide-bottom-space
              label="ลำดับการแสดงผล"
            />

            <q-toggle
              v-model="dataForm.isLocked"
              label="isLocked"
              color="primary"
              dense
            />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="accent" v-close-popup />
          <q-btn label="Save" color="primary" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useApi } from "~/api/useApi";
import type {
  CourseChildResponse,
  RequestCourseChild,
} from "~/types/response/course";

const requiredMsg = useParam();
const modal = defineModel<boolean>("modal", { required: true });
const props = defineProps<{
  data: CourseChildResponse | null;
  fetchLists: Function;
  courseId: string;
  courseRootId: string;
  isMain: boolean;
  onReset: Function;
}>();
const $q = useQuasar();
const dataForm = reactive<RequestCourseChild>({
  id: "",
  label: "",
  description: "",
  type: "",
  minute: 1,
  isLocked: true,
  courseRootId: "",
  ordering: 0,
});

async function onSubmit() {
  dataForm.courseRootId = props.courseRootId;
  dataForm.minute = Number(dataForm.minute);

  const response: any = await useApi(
    !dataForm.id ? "POST" : "PUT",
    `/course/child${dataForm.id ? "/" + dataForm.id : ""}`,
    { ...dataForm, isMain: props.isMain }
  );
  if (response.data) {
    props.fetchLists();
    onReset();
    $q.loading.hide();
    $q.notify({
      message: "Save successfully",
      color: "positive",
      position: "top",
      closeBtn: true,
    });
    modal.value = false;
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
}

async function onReset() {
  dataForm.id = "";
  dataForm.label = "";
  dataForm.description = "";
  dataForm.type = "";
  dataForm.minute = 0;
  dataForm.isLocked = true;
  dataForm.ordering = 0;
  props.onReset();
}

watch(
  () => props.data,
  (val) => {
    if (val) {
      dataForm.id = val.id;
      dataForm.label = val.label;
      dataForm.description = val.description || "";
      dataForm.type = val.type;
      dataForm.minute = val.duration;
      dataForm.isLocked = val.isLocked;
      dataForm.ordering = val.ordering;
    } else {
      onReset(); // reset form values
    }
  }
);
</script>
