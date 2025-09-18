<template>
  <div class="reviews">
    <section class="uni-rankings pt-20px pb-20px">
      <div class="container">
        <template v-if="data?.find((e: any) => e.isYou === true)">
          <h4 class="fw-medium text-center mb-5px">
            You got
            <span class="text-primary">{{
              data?.find((e: any) => e.isYou === true)?.rankNo
            }}</span>
          </h4>
          <p class="text-center mb-40px">
            We&apos;ve achieved an enviable reputation for research and teaching
            excellence.
          </p>
        </template>
        <div class="row gy-30px">
          <div v-for="e in data" class="col-md-6">
            <div class="rankings-item p-20px d-flex gap-30px">
              <img
                :src="e.learner.photo || `/images/profile-default.png`"
                alt="rankings icon"
                class="img-fluid rounded-circle"
                width="65"
                height="65"
              />
              <div class="rankings-item-box">
                <h5 class="fw-bold mb-5px">
                  {{ e.rankNo }}
                </h5>
                <p>{{ e.learner.name }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
});

function toOrdinalNumber(num: number) {
  if (num < 1 || num > 9) {
    return "Number out of range (1-9 only)";
  }

  const suffixes = ["th", "st", "nd", "rd"];
  const remainder = num % 10;

  const suffix =
    remainder <= 3 && Math.floor(num / 10) !== 1
      ? suffixes[remainder]
      : suffixes[0];

  return `${num}${suffix}`;
}
</script>
