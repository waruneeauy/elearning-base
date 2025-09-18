<template>
  <q-dialog v-model="modal" backdrop-filter="blur(4px)" persistent>
    <q-card flat bordered>
      <q-card-section class="row items-center q-py-sm">
        <div class="text-h6">{{ ques ? "Edit" : "Add" }} Question</div>
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
          style="max-height: 80vh; min-width: 550px"
          class="q-gutter-y-sm scroll"
        >
          <div class="row q-gutter-x-sm">
            <div class="col-2">
              <q-input
                v-model="dataForm.no"
                type="number"
                outlined
                dense
                hide-bottom-space
                label="No *"
                min="0"
              />
            </div>
            <div class="col-2">
              <q-input
                v-model="dataForm.subNo"
                type="number"
                outlined
                dense
                hide-bottom-space
                label="Sub No"
                min="0"
              />
            </div>
            <!-- <div class="col-3">
                <q-input
                  v-model="dataForm.score"
                  type="number"
                  outlined
                  dense
                  hide-bottom-space
                  label="Score *"
                  min="0"
                />
              </div> -->
          </div>
          <div class="row q-gutter-sm">
            <div class="col-3">
              <q-select
                v-model="dataForm.type"
                outlined
                dense
                hide-bottom-space
                label="Type Question *"
                emit-value
                :options="[
                  { label: 'Text', value: 'TEXT' },
                  { label: 'Picture', value: 'IMAGE' },
                ]"
                :rules="[(val) => !!val || requiredMsg]"
              />
            </div>

            <div v-if="dataForm.type === 'IMAGE'" class="col-8">
              <input
                type="file"
                ref="fileInput"
                @change="handleFileChange"
                accept="image/*"
                class="hidden"
              />
              <q-btn outline color="primary" @click="triggerFileInput">
                Select Image
              </q-btn>

              <q-img
                v-if="dataForm.description"
                :src="dataForm.description"
                alt="image"
              />
            </div>
            <div v-else class="col-8">
              <q-input
                v-model="dataForm.description"
                outlined
                dense
                hide-bottom-space
                label="Question content *"
                type="textarea"
                rows="2"
                :rules="[(val) => !!val || requiredMsg]"
              />
            </div>
          </div>
          <div v-for="(c, index) in dataForm.choices" class="row q-gutter-x-xs">
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

          <div class="col-12">
            <q-input
              v-model="dataForm.explanation"
              outlined
              dense
              hide-bottom-space
              label="Explanation"
              type="textarea"
              rows="2"
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

import type { QuestionResponse } from "~/types/response/question";
import type { QuestionRequest } from "~/types/request/question";

const requiredMsg = useParam();
const modal = defineModel<boolean>("modal", { required: true });
const route = useRoute();
const props = defineProps<{
  ques: QuestionResponse | null;
  fetchData: () => void;
  totalQuiz: number;
}>();
const $q = useQuasar();
const dataForm = reactive<QuestionRequest>({
  type: "TEXT",
  description: "",
  explanation: "",
  score: 1,
  no: 1,
  subNo: 0,
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
    dataForm.description = reader.result as string; // Convert to Base64
  };

  reader.readAsDataURL(file); // Read file as Data URL
};

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
  dataForm.score = Number(dataForm.score);
  dataForm.no = Number(dataForm.no);
  dataForm.subNo = Number(dataForm.subNo);
  dataForm.score = Number(dataForm.score);
  const response: any = await useApi(
    props.ques ? "PUT" : "POST",
    props.ques ? `/quiz/${props.ques.id}` : `/quiz/${route.params.id}`,
    dataForm
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
  dataForm.type = "TEXT";
  dataForm.description = "";
  dataForm.explanation = "";
  dataForm.score = 1;
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

watch(
  () => modal.value,
  (val) => {
    if (!val) {
      onReset();
      dataForm.no = props.totalQuiz + 1;
    } else if (props.ques) {
      dataForm.no = props.ques.no;
      dataForm.subNo = props.ques.subNo;
      dataForm.description = props.ques.description;
      dataForm.explanation = props.ques.explanation;
      dataForm.score = props.ques.score;
      dataForm.type = props.ques.type;
      dataForm.choices = props.ques.CourseQuizAnswer[0].answers.map(
        (choice) => {
          return {
            id: choice.id,
            no: choice.no,
            quizId: choice.quizId,
            description: choice.description,
            isCorrect: choice.isCorrect,
          };
        }
      );
    }
  }
);
</script>
