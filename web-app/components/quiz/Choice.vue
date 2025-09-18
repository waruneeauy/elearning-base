<template>
  <div v-if="format === 'normal'">
    <button
      v-if="data.results.isCorrect === null"
      v-for="(answer, index) in data.answers"
      :key="index"
      class="btn btn-outline-primary text-black text-start border-2 w-100 mb-3 py-3"
      :class="{
        active: answer.id === selectedAnswer,
        'w-50': type === 'TEXT',
      }"
      @click="checkAnswer(answer.id)"
    >
      <div class="flex align-items-center w-100">
        <span style="text-wrap-mode: nowrap">
          {{ String.fromCharCode(65 + index) }}.
        </span>
        <span>
          {{ answer.description }}
        </span>
      </div>
    </button>
    <button
      v-else
      v-for="(answer, index) in data.answers"
      class="btn btn-outline-primary text-black text-start border-2 w-100 mb-3 py-3"
      :class="{
        correct: answer.id === data.results.correctAnswerId,
        wrong:
          data.results.isCorrect === false &&
          answer.id === data.results.answerId,
        'w-50': type === 'TEXT',
      }"
      @click="checkAnswer(answer.id)"
    >
      <div class="flex align-items-center w-100">
        <span style="text-wrap-mode: nowrap">
          {{ String.fromCharCode(65 + index) }}.
        </span>
        <span>
          {{ answer.description }}
        </span>
      </div>
    </button>
  </div>
  <div v-else>
    <button
      v-if="data.results[0]?.isCorrect === null"
      v-for="(answer, index) in answer.items"
      :key="index"
      class="btn btn-outline-primary text-black text-start border-2 w-100 mb-3 py-3"
      :class="{
        active: answer.id === selectedAnswer,
        'w-50': type === 'TEXT',
      }"
      @click="checkAnswer(answer.id)"
    >
      <div class="flex align-items-center w-100">
        <span style="text-wrap-mode: nowrap">
          {{ String.fromCharCode(65 + index) }}.
        </span>
        <span>
          {{ answer.description }}
        </span>
      </div>
    </button>
    <button
      v-else
      v-for="(answer, index) in answer.items"
      class="btn btn-outline-primary text-black text-start border-2 w-100 mb-3 py-3"
      :class="{
        correct: answer.id === answers.correctAnswerId,
        wrong: answers.isCorrect === false && answer.id === answers.answerId,
        'w-50': type === 'TEXT',
      }"
      @click="checkAnswer(answer.id)"
    >
      <div class="flex align-items-center w-100">
        <span style="text-wrap-mode: nowrap">
          {{ String.fromCharCode(65 + index) }}.
        </span>
        <span>
          {{ answer.description }}
        </span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
  answer: {
    type: Object,
    default: null,
  },
  answers: {
    type: Object,
    default: null,
  },
  type: {
    type: String,
    default: null,
  },
  format: {
    type: String,
    default: "normal",
  },
  index: {
    type: Number,
    default: null,
  },
});

onMounted(() => {
  // if (props.answers) {
  //   selectedAnswer.value = props.answers.answerId;
  // }
});

const emit = defineEmits(["answer-selected"]);
const selectedAnswer = ref<string>("");
const checkAnswer = (_selectedAnswer: string) => {
  selectedAnswer.value = _selectedAnswer;
  emit("answer-selected", _selectedAnswer, props.index);
};

const clearSelected = () => {
  selectedAnswer.value = "";
};
</script>

<style scoped>
.btn-outline-primary {
  width: 100%;
  box-shadow: 0 0 #0000;
  text-transform: none;
  border-color: black;
}

.btn-outline-primary:hover {
  background-color: transparent;
  color: #356df1 !important;
  border-color: #356df1 !important;
}

.w-50 {
  width: 50%;
}

.active {
  color: #356df1 !important;
  border: 3px solid #356df1 !important;
  background-color: transparent;
}

.correct {
  color: #00cc00 !important;
  border: 3px solid #00cc00 !important;
  background-color: transparent;
}

.wrong {
  color: #f13535 !important;
  border: 3px solid #f13535 !important;
  background-color: transparent;
}
</style>
