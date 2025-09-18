<template>
  <q-dialog v-model="modal" backdrop-filter="blur(4px)" persistent>
    <q-card flat bordered>
      <q-card-section class="row items-center q-py-sm">
        <div class="text-h6">
          {{ !dataForm.id ? "เพิ่ม" : "แก้ไข" }}กลุ่มผู้อบรม
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
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
              label="Name *"
              :rules="[(val) => !!val || requiredMsg]"
            />

            <div class="col-12 q-py-sm">
              <input
                type="file"
                ref="fileInput"
                @change="handleFileChange"
                accept="image/*"
                class="hidden"
              />
              <q-btn
                outline
                class="full-width"
                color="primary"
                @click="triggerFileInput"
              >
                Select Image
              </q-btn>

              <q-img v-if="dataForm.logo" :src="dataForm.logo" alt="image" />
              <q-img v-else="dataForm.logo" :src="dataForm.logo" alt="image" />
            </div>
            <q-toggle
              v-model="dataForm.isActive"
              label="Active"
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
import type { RequestOrg } from "~/types/request/org";
import type { OrgResponse } from "~/types/response/org";

const requiredMsg = useParam();
const modal = defineModel<boolean>("modal", { required: true });
const props = defineProps<{
  data: OrgResponse | null;
  fetchLists: Function;
}>();
const $q = useQuasar();
const dataForm = reactive<RequestOrg>({
  id: "",
  logo: "",
  name: "",
  isActive: true,
});

const fileInput = ref<HTMLInputElement | null>(null);
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file: File = target.files[0]; // Get selected file
  const reader = new FileReader();

  reader.onload = () => {
    dataForm.logo = reader.result as string; // Convert to Base64
  };

  reader.readAsDataURL(file); // Read file as Data URL
};

async function onSubmit() {
  $q.loading.show();

  const response: any = await useApi(
    !dataForm.id ? "POST" : "PUT",
    `/customer${dataForm.id ? `/${dataForm.id}` : ""}`,
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
  dataForm.logo = "";
  dataForm.id = "";
  dataForm.name = "";
  dataForm.isActive = true;
}

watch(
  () => props.data,
  (val) => {
    if (val) {
      dataForm.id = val.id;
      dataForm.logo = val.logo;
      dataForm.name = val.name;
      dataForm.isActive = val.isActive;
    } else {
      onReset(); // reset form values
    }
  }
);
</script>
