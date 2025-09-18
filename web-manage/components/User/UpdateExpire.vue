<template>
  <q-dialog v-model="modal" backdrop-filter="blur(4px)" persistent>
    <q-card flat bordered>
      <q-card-section class="row items-center q-py-sm">
        <div class="text-h6">Edit expire and deadline date</div>
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
              v-model="formattedExpiredDate"
              outlined
              dense
              hide-bottom-space
              readonly
              label="Expired Date *"
              mask="##/##/####"
              :rules="[(val: any) => !!val || requiredMsg]"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="expiredDate"
                      @update:model-value="formatDate"
                      mask="YYYY-MM-DD"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input
              v-model="formattedDeadlineDate"
              outlined
              dense
              hide-bottom-space
              readonly
              label="Deadline Date *"
              mask="##/##/####"
              :rules="[(val: any) => !!val || requiredMsg]"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="deadlineDate"
                      @update:model-value="formatDeadlineDateV"
                      mask="YYYY-MM-DD"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
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
import { format, toZonedTime } from "date-fns-tz";

const requiredMsg = useParam();
const modal = defineModel<boolean>("modal", { required: true });
const props = defineProps<{
  fetchLists: Function;
  id?: string;
  expireDate?: Date | null;
  deadlinedDate?: Date | null;
}>();
const $q = useQuasar();
const expiredDate = ref<string>();
const deadlineDate = ref<string>();

const formattedExpiredDate = computed(() => {
  return expiredDate.value
    ? format(new Date(expiredDate.value), "dd/MM/yyyy")
    : "";
});

const formatDate = (newDate: string) => {
  expiredDate.value = newDate;
};

const formattedDeadlineDate = computed(() => {
  return deadlineDate.value
    ? format(new Date(deadlineDate.value), "dd/MM/yyyy")
    : "";
});

const formatDeadlineDateV = (newDate: string) => {
  deadlineDate.value = newDate;
};

async function onSubmit() {
  $q.loading.show();
  const response: any = await useApi(
    "PUT",
    `/customer-user/expdate/${props.id}`,
    {
      id: props.id,
      expiredAt: expiredDate.value
        ? convertDateToAPI(new Date(expiredDate.value))
        : null,
      deadlineDate: deadlineDate.value
        ? convertDateToAPI(new Date(deadlineDate.value))
        : null,
    }
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
  expiredDate.value = "";
  deadlineDate.value = "";
  modal.value = false;
}

// กรณีมีเฉพาะ date
function convertDateToAPI(date: Date | null) {
  return date ? format(toZonedTime(date, "Asia/Bangkok"), "yyyy-MM-dd") : null;
}

watch(
  () => modal.value,
  (val) => {
    if (val) {
      expiredDate.value = props.expireDate
        ? format(new Date(props.expireDate), "yyyy-MM-dd")
        : "";
      deadlineDate.value = props.deadlinedDate
        ? format(new Date(props.deadlinedDate), "yyyy-MM-dd")
        : "";
    }
  }
);
</script>
