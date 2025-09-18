<template>
  <q-dialog v-model="modal" backdrop-filter="blur(4px)" persistent>
    <q-card flat bordered>
      <q-card-section class="row items-center q-py-sm">
        <div class="text-h6">Generate Code</div>
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
              v-model="amount"
              outlined
              dense
              hide-bottom-space
              label="Code amount *"
              type="number"
              min="1"
              :rules="[(val) => !!val || requiredMsg]"
            />

            <q-input
              v-model="point"
              outlined
              dense
              hide-bottom-space
              label="Point *"
              type="number"
              min="1"
              :rules="[(val) => !!val || requiredMsg]"
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

import type { CodeResponse } from "~/types/response/user";

const requiredMsg = useParam();
const modal = defineModel<boolean>("modal", { required: true });
const props = defineProps<{
  data: CodeResponse | null;
  fetchLists: Function;
}>();
const $q = useQuasar();
const amount = ref<number | null>();
const point = ref<number | null>();

async function onSubmit() {
  $q.loading.show();
  const response: any = await useApi("POST", `/code`, {
    amount: Number(amount.value),
    point: Number(point.value),
  });
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
  amount.value = null;
  point.value = null;
}
</script>
