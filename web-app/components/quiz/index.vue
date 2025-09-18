<template>
  <template v-if="data?.format === 'normal'">
    <div
      v-if="data"
      class="border-1 rounded mb-4 p-4 g-4 row m-0"
      :class="{
        block: data.type === 'TEXT',
      }"
      style="min-width: -webkit-fill-available; border: 1px solid black"
    >
      <quiz-questions v-if="data.type !== 'TEXT'" :data />

      <quiz-question-and-answers
        class="select-none"
        :data
        :answers
        :type="data.type"
        @answer-selected="handleAnswerSelected"
        :isDone
      />
    </div>
  </template>
  <template v-else>
    <div
      v-if="data"
      class="border-1 rounded mb-4 p-4 g-4 row m-0"
      :class="{
        block: data.type === 'TEXT',
      }"
      style="min-width: -webkit-fill-available; border: 1px solid black"
    >
      <template v-for="(answer, index) in data.answers">
        <quiz-questions v-if="data.type !== 'TEXT' && index === 0" :data />

        <div v-if="index !== 0" class="col-12 col-lg-6"></div>
        <quiz-question-and-answers
          class="select-none"
          :data
          :answer="answer"
          :answers
          :type="data.type"
          @answer-selected="handleAnswerSelected"
          :isDone
          :format="data.format"
          :index
        />
      </template>
    </div>
  </template>
</template>

<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
  answers: {
    type: Object,
    default: null,
  },
  isDone: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["answer-selected"]);
const handleAnswerSelected = (answer: string, questionId: string) => {
  emit("answer-selected", answer, questionId);
};
</script>
