<template>
  <q-card flat bordered>
    <q-card-section class="row items-center q-py-sm">
      <div class="text-h6">Config text</div>
    </q-card-section>

    <q-separator />

    <q-form
      greedy
      @submit.prevent
      @validation-success="onSubmit"
      @reset="onReset"
    >
      <q-card-section style="max-height: 50vh; min-width: 400px" class="scroll">
        <div class="row q-gutter-sm">
          <div class="col-12">
            <q-input
              type="textarea"
              rows="2"
              v-model="textResult"
              outlined
              dense
              hide-bottom-space
              label="Test result description*"
            />
          </div>

          <div class="col-xs-12 col-md-2">
            <q-input
              type="number"
              v-model="testTimeMinute"
              outlined
              dense
              hide-bottom-space
              label="Test time minute*"
              min="1"
              step="1"
            />
          </div>
          <!-- <q-toggle
            v-model="dataForm.isActive"
            label="Active"
            color="primary"
            dense
          /> -->
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn label="Save" color="primary" type="submit" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { useApi } from "~/api/useApi";

const $q = useQuasar();

const textResult = ref<string>("");
const testTimeMinute = ref<number>(60);

async function onSubmit() {
  $q.loading.show();
  const response: any = await useApi("POST", `/config`, {
    textResult: textResult.value,
    testTimeMinute: Number(testTimeMinute.value),
  });
  if (response.data) {
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

function onReset() {
  console.log("reset");
}

async function fetchData() {
  const response: any = await useApi("GET", "/config");
  if (response.data) {
    textResult.value = response.data.result.textResult;
    testTimeMinute.value = Number(response.data.result.testTimeMinute);
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

onMounted(() => {
  fetchData();
});
</script>
