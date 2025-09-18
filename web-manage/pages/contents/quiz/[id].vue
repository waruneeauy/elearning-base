<template>
  <div class="q-pa-md q-gutter-sm">
    <q-breadcrumbs>
      <q-breadcrumbs-el label="หลักสูตร" to="/contents" />
      <q-breadcrumbs-el label="แก้ไขคำถาม" />
    </q-breadcrumbs>
  </div>

  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <h6>{{ data.title }}</h6>
        <p class="text-grey-8">{{ data.description }}</p>
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
    </q-card>

    <q-card class="q-mt-md">
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-sm">
          <q-input
            v-model="dataForm.title"
            label="Title"
            outlined
            dense
            hide-bottom-space
            :rules="[(val) => !!val || 'Title is required']"
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

          <div align="right">
            <q-btn type="submit" color="primary" label="Save" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <div class="q-mt-sm">
      <div class="q-py-md q-gutter-y-sm">
        <q-toolbar class="q-pl-none">
          <q-btn
            dense
            icon="add"
            label="Add question"
            color="secondary"
            class="q-px-sm"
            @click="openDialog()"
          />
        </q-toolbar>
      </div>
      <q-card
        v-for="(question, index) in questions"
        flat
        bordered
        class="q-mb-sm"
      >
        <q-card-section>
          <div>
            <div class="row">
              <div class="col-6">
                <strong
                  >Question {{ question.no
                  }}{{
                    question.subNo > 0 ? `.${question.subNo}` : ""
                  }}:</strong
                >
              </div>

              <div class="col-4 q-mt-sm" align="right">
                <strong>Score: </strong> {{ question.score }}
              </div>
              <div class="col-2" align="right">
                <q-btn
                  dense
                  flat
                  icon="add"
                  color="primary"
                  @click="
                    openDialogAnswer(
                      null,
                      question.id,
                      question.CourseQuizAnswer.length + 1
                    )
                  "
                >
                  <q-tooltip>Add answer</q-tooltip>
                </q-btn>
                <q-btn
                  dense
                  flat
                  icon="edit"
                  color="info"
                  @click="openDialog(question)"
                >
                  <q-tooltip>Edit this question</q-tooltip>
                </q-btn>
                <q-btn
                  dense
                  flat
                  icon="delete"
                  color="negative"
                  @click="onRemove(question.id)"
                >
                  <q-tooltip>Remove this question</q-tooltip>
                </q-btn>
              </div>
            </div>
            <span
              v-if="question.type === 'TEXT'"
              class="text-grey-8"
              v-html="question.description.replaceAll('\n', '<br />')"
            >
            </span>
            <q-img
              v-else="question.description"
              :src="question.description"
              alt="image"
              width="300px"
            />
            <q-space />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section v-for="(ans, i) in question.CourseQuizAnswer">
          <div v-if="question.CourseQuizAnswer.length > 1">
            <strong>Answer {{ question.no + "." + (i + 1) }}:</strong>

            <q-btn
              dense
              flat
              icon="edit"
              color="info"
              @click="openDialogAnswer(ans, question.id, ans.no)"
            >
              <q-tooltip>Add answer</q-tooltip>
            </q-btn>

            <q-btn
              dense
              flat
              icon="delete"
              color="negative"
              @click="onRemoveAnswer(question.id, ans.no)"
            />
          </div>
          <q-list bordered separator>
            <q-item v-for="(v, i) in ans.answers">
              <q-item-section
                >{{ store.choiceIndex[i] }}. {{ v.description }}
              </q-item-section>
              <q-item-section v-if="v.isCorrect" avatar>
                <q-btn dense flat icon="check" color="green" label="Is true" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <AddQuestion
        v-model:modal="modal"
        :ques="ques"
        :total-quiz="totalQuiz"
        :fetch-data="getData"
      />

      <AddAnswer
        v-model:modal="modalAnswer"
        :answer="answer"
        :total-answer="totalAnswer"
        :fetch-data="getData"
        :quiz-id="quizId"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useApi } from "~/api/useApi";
import type { FormContent } from "~/types/request/question";
import type { ContentDetail } from "~/types/response/course";
import type {
  Choice,
  QuestionResponse,
  Answer,
} from "~/types/response/question";
import AddQuestion from "~/components/Question/AddQuestion.vue";
import AddAnswer from "~/components/Question/AddAnswer.vue";

const $q = useQuasar();
const route = useRoute();
const store = useQuestionStore();
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
const modal = ref<boolean>(false);
const modalAnswer = ref<boolean>(false);
const ques = ref<QuestionResponse | null>(null);
const questions = ref<QuestionResponse[]>([]);
const totalQuiz = ref<number>(0);
const totalAnswer = ref<number>(0);
const answer = ref<Choice[] | null>(null);
const quizId = ref<string>("");

function openDialog(q: QuestionResponse | null = null) {
  modal.value = true;
  ques.value = q ? { ...q } : null;
}

function openDialogAnswer(c: Answer | null = null, qId: string, total: number) {
  modalAnswer.value = true;
  answer.value = c ? [...c.answers] : null;
  totalAnswer.value = total;
  quizId.value = qId;
}

async function getData() {
  const response: any = await useApi("GET", `/content/${route.params.id}`);
  if (response.data) {
    data.value = await response.data.result;
    questions.value = Array.isArray(data.value.quiz) ? data.value.quiz : [];
    totalQuiz.value = questions.value.length;
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

async function onRemove(id: string) {
  $q.dialog({
    title: "Remove question",
    message: "Are you sure to remove this question?",
    persistent: true,
    ok: {
      label: "Yes",
      color: "negative",
    },
    cancel: {
      label: "No",
    },
  }).onOk(async () => {
    $q.loading.show();
    const response: any = await useApi("DELETE", `/quiz/${id}`);
    if (response.data) {
      getData();
      $q.loading.hide();
      $q.notify({
        message: "Remove successfully",
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
  });
}

async function onRemoveAnswer(id: string, no: number) {
  $q.dialog({
    title: "Remove question",
    message: "Are you sure to remove this question?",
    persistent: true,
    ok: {
      label: "Yes",
      color: "negative",
    },
    cancel: {
      label: "No",
    },
  }).onOk(async () => {
    $q.loading.show();
    const response: any = await useApi(
      "DELETE",
      `/quiz/answer/choice/${id}?no=${no}`
    );
    if (response.data) {
      getData();
      $q.loading.hide();
      $q.notify({
        message: "Remove successfully",
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
  });
}

async function onSubmit() {
  $q.loading.show();
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
