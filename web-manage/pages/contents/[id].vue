<template>
  <div class="q-pa-md q-gutter-sm">
    <q-breadcrumbs>
      <q-breadcrumbs-el label="หลักสูตร" to="/contents" />
      <q-breadcrumbs-el label="แก้ไขเนื้อหา" />
    </q-breadcrumbs>
  </div>

  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <h6>{{ data.title }}</h6>
        <!-- <p class="text-grey-8">{{ data.description }}</p> -->
        <div class="q-mt-md">
          <span flat v-if="data.type === 'DOCUMENT'" class="text-grey-8">
            <q-tooltip>Edit context</q-tooltip>
            <q-icon name="description" size="xs" /> Context
          </span>
          <span flat v-else-if="data.type === 'VIDEO'" class="text-grey-8">
            <q-tooltip>Edit video</q-tooltip>
            <q-icon name="videocam" size="xs" /> Video
          </span>
          <span flat v-else-if="data.type === 'QUIZ'" class="text-grey-8">
            <q-tooltip>Edit quiz</q-tooltip>
            <q-icon name="quiz" size="xs" /> Quiz
          </span>

          <span v-if="data.isLocked" flat class="text-grey-8 q-pl-md">
            <q-icon name="lock" size="xs" /> isLocked
          </span>

          <span v-if="data.minute" flat class="text-grey-8 q-pl-md">
            <q-icon name="timer" size="xs" /> {{ data.minute }} Minute
          </span>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-sm">
          <q-input
            v-if="data.type === 'VIDEO'"
            v-model="dataForm.videoUrl"
            label="วิดีโอ URL"
            outlined
            dense
            hide-bottom-space
            :rules="[(val) => !!val || 'กรุณากรอกวิดีโอ URL']"
          />

          <q-input
            v-model="dataForm.title"
            label="หัวข้อ"
            outlined
            dense
            hide-bottom-space
            :rules="[(val) => !!val || 'กรุณากรอกหัวข้อ']"
          />

          <q-editor
            v-model="dataForm.content"
            label="Content"
            :toolbar="[
              ['bold', 'italic', 'underline'],
              // ['unordered', 'ordered'],
            ]"
            :rules="[(val: string) => !!val || 'Content is required']"
          />

          <q-btn type="submit" color="primary" label="Save" class="q-mt-md" />
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useApi } from "~/api/useApi";
import type { FormContent } from "~/types/request/question";
import type { ContentDetail } from "~/types/response/course";

const $q = useQuasar();
const route = useRoute();
const data = ref<ContentDetail>({
  title: "",
  description: "",
  type: "",
  minute: 0,
  isLocked: false,
  content: null,
});
const dataForm = ref<FormContent>({
  title: "",
  content: "",
  videoUrl: "",
});

async function getData() {
  const response: any = await useApi("GET", `/content/${route.params.id}`);
  if (response.data) {
    data.value = await response.data.result;
    if (data.value.content) {
      dataForm.value = {
        title: data.value.content.title,
        content: data.value.content.content,
        videoUrl: data.value.content.videoUrl,
      };
    }
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

async function onSubmit() {
  $q.loading.show();
  console.log("dataForm===>", dataForm);

  const response: any = await useApi(
    !data.value.content ? "POST" : "PUT",
    `/content/${route.params.id}`,
    dataForm.value
  );
  if (response.data) {
    getData();
    $q.loading.hide();
    $q.notify({
      message: "Save successfully",
      color: "positive",
      position: "top",
      closeBtn: true,
    });
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

onMounted(async () => {
  await getData();
});
</script>
