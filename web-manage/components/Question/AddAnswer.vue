<template>
  <q-dialog v-model="modal" backdrop-filter="blur(4px)" persistent>
    <q-card flat bordered>
      <q-card-section class="row items-center q-py-sm">
        <div class="text-h6">{{ answer ? "Edit" : "Add" }} Question</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form
          greedy
          @submit.prevent
          @validation-success="onSubmit"
          @reset="onReset"
        >
          <q-card-section
            style="max-height: 80vh; min-width: 550px"
            class="q-gutter-y-sm scroll"
          >
            <div class="row q-gutter-x-sm">
              <div class="col-2">
                <q-input
                  v-model="no"
                  type="number"
                  outlined
                  dense
                  hide-bottom-space
                  label="No *"
                  min="0"
                />
              </div>
            </div>

            <div
              v-for="(c, index) in dataForm.choices"
              class="row q-gutter-x-xs"
            >
              <div class="col-1">
                <q-btn
                  :disabled="index < 2"
                  flat
                  dense
                  icon="delete"
                  :color="index < 2 ? 'grey' : 'red'"
                  @click="removeChoice(index)"
                >
                  <q-tooltip>Remove choice</q-tooltip>
                </q-btn>
              </div>
              <div class="col-8">
                <q-input
                  v-model="dataForm.choices[index].description"
                  outlined
                  dense
                  hide-bottom-space
                  :label="`Choice ${index + 1}`"
                  :rules="[(val) => !!val || requiredMsg]"
                />
              </div>
              <div class="col-2">
                <q-checkbox
                  v-model="dataForm.choices[index].isCorrect"
                  label="Is true"
                  color="primary"
                  dense
                  @update:model-value="updateIsTrueChoice(index)"
                />
              </div>
            </div>
            <div v-if="dataForm.choices.length <= 6" class="col-12">
              <q-btn
                flat
                dense
                icon="add"
                color="green"
                label="Add choice"
                @click="addChoice"
              >
                <q-tooltip>Add choice</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="accent" v-close-popup />
            <q-btn label="Save" color="primary" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useApi } from "~/api/useApi";

import type { Choice } from "~/types/response/question";
import type { RequestChoice } from "~/types/request/question";

const requiredMsg = useParam();
const modal = defineModel<boolean>("modal", { required: true });
const route = useRoute();
const props = defineProps<{
  answer: Choice[] | null;
  fetchData: () => void;
  totalAnswer: number;
  quizId: string;
}>();
const $q = useQuasar();
const dataForm = reactive<RequestChoice>({
  quizId: "",
  choices: [
    {
      id: "",
      no: 1,
      description: "",
      isCorrect: false,
      quizId: "",
    },
    {
      id: "",
      no: 1,
      description: "",
      isCorrect: false,
      quizId: "",
    },
    {
      id: "",
      no: 1,
      description: "",
      isCorrect: false,
      quizId: "",
    },
    {
      id: "",
      no: 1,
      description: "",
      isCorrect: false,
      quizId: "",
    },
  ],
});

async function onSubmit() {
  if (!dataForm.choices.some((choice) => choice.isCorrect === true)) {
    $q.notify({
      message: "Please select the true choice",
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
    return;
  }

  $q.loading.show();

  const items = await dataForm.choices.map((choice, index) => {
    return {
      no: no.value,
      description: choice.description,
      isCorrect: choice.isCorrect,
      quizId: props.quizId,
    };
  });

  const response: any = await useApi(
    props.answer ? "PUT" : "POST",
    props.answer
      ? `/quiz/answer/choice/${props.quizId}?no=${no.value}`
      : "/quiz/answer/choice",
    {
      quizId: props.quizId,
      choices: items,
    }
  );
  if (response.data) {
    onReset();
    props.fetchData();
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
  dataForm.quizId = "";
  dataForm.choices = [
    {
      id: "",
      no: 1,
      description: "",
      isCorrect: false,
      quizId: "",
    },
    {
      id: "",
      no: 1,
      description: "",
      isCorrect: false,
      quizId: "",
    },
    {
      id: "",
      no: 1,
      description: "",
      isCorrect: false,
      quizId: "",
    },
    {
      id: "",
      no: 1,
      description: "",
      isCorrect: false,
      quizId: "",
    },
  ];
  // props.ques = null;
}

function addChoice() {
  dataForm.choices.push({
    id: "",
    no: 1,
    quizId: "",
    description: "",
    isCorrect: false,
  });
}

function removeChoice(index: number) {
  dataForm.choices.splice(index, 1);
}

async function updateIsTrueChoice(index: number) {
  return await dataForm.choices.forEach((choice, i) => {
    if (i !== index) {
      choice.isCorrect = false;
    }
  });
}

const no = ref<number>(0);
watch(
  () => modal.value,
  (val) => {
    no.value = props.totalAnswer;

    if (!val) {
      onReset();
    } else if (props.answer) {
      dataForm.choices = props.answer.map((c) => {
        return {
          id: c.id,
          no: c.no,
          quizId: c.quizId,
          description: c.description,
          isCorrect: c.isCorrect,
        };
      });
    }
  }
);
</script>
