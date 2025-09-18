<template>
  <template v-if="format === 'normal'">
    <div class="col-12" :class="{ 'col-lg-6': type !== 'TEXT' }">
      <div>
        <p v-if="type === 'TEXT'" class="fw-bold mb-3">
          {{ data.no }}. {{ data.description }}
        </p>
        <div
          class="mt-2"
          :class="{
            'd-block': type === 'TEXT',
            disabled: answers.isCorrect !== null || isDone,
          }"
        >
          <quiz-choice
            :data
            :answers
            :type
            :format
            @answer-selected="handleAnswerSelected"
          />
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="col-lg-6">
      <div>
        <p class="fw-bold mb-3">{{ answer.no }}</p>
        <div
          class="mt-2"
          :class="{
            disabled:
              answers.length ===
                answers.filter((e: any) => e.isCorrect !== null).length ||
              isDone,
          }"
        >
          <quiz-choice
            :answer="answer"
            :data
            :answers="answers[index]"
            :type
            :format
            :index
            @answer-selected="handleAnswerSelected"
          />
        </div>
      </div>
    </div>
  </template>

  <!-- explanation -->
  <div
    v-if="
      ((format === 'normal' && data.results.correctAnswerId) ||
        (format !== 'normal' &&
          data.results.length - 1 === index &&
          !data.results.find((x: any) => !x.correctAnswerId))) &&
      data.explanation
    "
    class="col-12 mt-3"
  >
    <strong>Explanation:</strong>
    <div class="multiline-text">{{ data.explanation }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  data: { type: Object, default: null },
  answer: { type: Object, default: null },
  answers: { type: Object, default: null },
  type: { type: String, default: null },
  isDone: { type: Boolean, default: false },
  format: { type: String, default: "normal" },
  index: { type: Number, default: null },
});

const emit = defineEmits(["answer-selected"]);
const handleAnswerSelected = (answer: string, questionId: string) => {
  emit("answer-selected", answer, questionId);
};
</script>

<style scoped>
.multiline-text {
  white-space: pre-line;
}
</style>
