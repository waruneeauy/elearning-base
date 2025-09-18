<template>
  <q-dialog v-model="modal" backdrop-filter="blur(4px)" persistent>
    <q-card flat bordered>
      <q-card-section class="row items-center q-py-sm">
        <div class="text-h6">{{ dataForm.id ? "แก้ไข" : "เพิ่ม" }}คอร์ส</div>
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
              v-model="dataForm.name"
              outlined
              dense
              hide-bottom-space
              label="ชื่อคอร์ส *"
              :rules="[(val) => !!val || requiredMsg]"
            />

            <q-input
              type="textarea"
              rows="3"
              v-model="dataForm.description"
              outlined
              dense
              hide-bottom-space
              label="รายละเอียด"
            />
            <q-toggle
              v-model="dataForm.isActive"
              label="เปิดใช้งาน"
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
import type { RequestCourse, CourseResponse } from "~/types/response/course";

const requiredMsg = useParam();
const modal = defineModel<boolean>("modal", { required: true });
const props = defineProps<{
  data: CourseResponse | null;
  fetchLists: Function;
}>();
const $q = useQuasar();
const dataForm = reactive<RequestCourse>({
  id: "",
  name: "",
  description: "",
  isActive: false,
});
import { useQuestionStore } from "~/stores/question.js";
const store = useQuestionStore();

async function onSubmit() {
  const response: any = await useApi(
    !dataForm.id ? "POST" : "PUT",
    `/course${dataForm.id ? "/" + dataForm.id : ""}`,
    dataForm
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
  dataForm.name = "";
  dataForm.description = "";
  dataForm.isActive = false;
}

watch(
  () => props.data,
  (val) => {
    if (val) {
      dataForm.id = val.id;
      dataForm.name = val.name;
      dataForm.description = val.description || "";
      dataForm.isActive = val.isActive;
    } else {
      onReset(); // reset form values
    }
  }
);
</script>
