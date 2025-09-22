<template>
  <header-learning
    :title="
      curriculumProcess?.find((e: any) => e.courseChildId === selectedCourse)
        ?.label
    "
  />

  <div class="my-learning__content d-flex">
    <div
      class="my-learning__content_box"
      :class="{ 'left-sidebar': !isShowSidebar }"
      style="top: 75px"
    >
      <div class="my-learning__content_sidebar">
        <ul class="curriculum-sidebar">
          <li
            v-for="(curriculum, index) in curriculumList?.curriculum"
            :key="index"
            class="curriculum-sidebar__items"
          >
            <div
              class="curriculum-sidebar__header d-flex align-items-center gap-20px justify-content-between cursor-pointer"
            >
              <a @click="toggleCollapse(index)">
                <i
                  class="fa-solid cursor-pointer"
                  :class="
                    curriculum.collapsed ? 'fa-chevron-up' : 'fa-chevron-down'
                  "
                ></i>
              </a>
              <h5 class="curriculum-sidebar__header_title fs-20 fw-semibold">
                {{ curriculum.label }}
              </h5>
              <!-- <span
                class="d-block fw-semibold curriculum-sidebar__header_quantity"
                >{{ curriculum.total }}</span
              > -->
            </div>
            <transition name="collapse">
              <ul
                v-if="!curriculum.collapsed"
                class="curriculum-sidebar__content"
              >
                <li
                  v-for="(item, idx) in curriculum.list"
                  :key="idx"
                  class="curriculum-sidebar__content_items d-flex flex-wrap gap-10px justify-content-between"
                >
                  <a
                    v-if="item.status !== 'LOCKED'"
                    @click="onSelectedCourse(item)"
                    class="lesson-title d-flex gap-20px align-items-center cursor-pointer"
                    :class="{ active: selectedCourse === item.id }"
                  >
                    <i
                      class="iconify fs-20 curriculum-section__content_icon"
                      :data-icon="
                        item.type === 'DOCUMENT'
                          ? 'la:file-invoice'
                          : item.type === 'VIDEO'
                            ? 'la:video'
                            : 'heroicons:puzzle-piece'
                      "
                    ></i>
                    <p class="curriculum-sidebar__content_title">
                      {{ item.label }}
                    </p>
                  </a>
                  <div
                    v-else
                    class="lesson-title d-flex gap-20px align-items-center"
                    :class="{ active: selectedCourse === item.id }"
                  >
                    <i
                      class="iconify fs-20 curriculum-section__content_icon"
                      :data-icon="
                        item.type === 'DOCUMENT'
                          ? 'la:file-invoice'
                          : item.type === 'VIDEO'
                            ? 'la:video'
                            : 'heroicons:puzzle-piece'
                      "
                    ></i>
                    <p class="curriculum-sidebar__content_title">
                      {{ item.label }}
                    </p>
                  </div>
                  <div class="d-flex align-items-center gap-10px">
                    <span class="fs-14">{{
                      formatMinutesToEnglish(item.duration)
                    }}</span>
                    <div v-if="item.status !== 'LOCKED'">
                      <i
                        class="iconify fs-20 eye_icon"
                        data-icon="lucide:eye"
                      ></i>
                    </div>
                    <div v-else>
                      <i
                        class="iconify fs-20 lock_icon"
                        data-icon="ph:lock-simple-light"
                      ></i>
                    </div>
                  </div>
                </li>
              </ul>
            </transition>
          </li>
        </ul>
      </div>
      <div @click="toggleSidebar()" class="my-learning__toggleSidebar">
        <i
          class="iconify fs-24 toggleSidebar-icon"
          data-icon="ph:caret-left-light"
        ></i>
      </div>
    </div>

    <div
      v-if="!loading"
      class="my-learning__content_body"
      :class="{ 'p-0': !isShowSidebar }"
      style="margin-top: 75px"
    >
      <div class="container">
        <div
          v-if="type === 'VIDEO'"
          class="lesson-video data-lesson-type"
          data-lesson-type="lesson-video"
        >
          <div class="lesson-video__wrapper mt-3">
            <div class="lesson-video__iframe mb-20px">
              <div class="video-container">
                <!-- วิธีที่ 1: ใช้ iframe embed (แนะนำสำหรับ YouTube) -->
                <iframe
                  v-if="
                    items.content?.videoUrl?.includes('youtube.com') ||
                    items.content?.videoUrl?.includes('youtu.be')
                  "
                  width="100%"
                  :src="getYouTubeEmbedUrl(items.content?.videoUrl)"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                  @load="onPlay()"
                ></iframe>

                <!-- วิธีที่ 2: ใช้ VideoPlayer สำหรับไฟล์วิดีโออื่นๆ (MP4, WebM, etc.) -->
                <VideoPlayer
                  v-else
                  :video-url="items.content?.videoUrl"
                  :course-child-id="selectedCourse"
                  @onPlay="onPlay()"
                />
              </div>
            </div>
            <h2 class="fw-bolder mb-20px">{{ items.content?.title }}</h2>
            <p v-html="items.content?.content" />
          </div>
          <div class="text-end mt-20px mb-120px">
            <button
              v-if="items.course.status !== 'DONE'"
              @click="onComplete()"
              class="btn btn-primary"
              :disabled="!isPlay"
            >
              Complete
            </button>
            <button v-else class="btn btn-primary" :disabled="true">
              <i class="fa-solid fa-check"></i>
              Complete
            </button>
          </div>
          <quiz-navbar
            :isShowSidebar
            :is-previos="
              curriculumProcess.findIndex(
                (item: any) => item.courseChildId === selectedCourse
              ) !== 0
            "
            :is-next="items.isNext"
            @onPreviousCourse="onPreviousCourse"
            @onNextCourse="onNextCourse"
          />
        </div>
        <div
          v-if="type === 'QUIZ'"
          class="lesson-video data-lesson-type"
          data-lesson-type="lesson-video"
        >
          <div v-if="firstCome">
            <h5 class="fw-bolder transition-all mb-3">
              {{
                curriculumProcess?.find(
                  (e: any) => e.courseChildId === selectedCourse
                )?.label
              }}
            </h5>
            <p v-html="items.content?.content" />

            <div class="text-end mb-20px">
              <button @click="firstCome = false" class="btn btn-primary">
                <div class="d-flex align-items-center">
                  <p class="text-start" style="padding-right: 5px">
                    Start Quiz
                  </p>
                </div>
              </button>
            </div>
          </div>
          <div v-else-if="!selectSet && listSet?.length">
            <h5 class="fw-bolder transition-all mb-3">
              {{
                curriculumProcess?.find(
                  (e: any) => e.courseChildId === selectedCourse
                )?.label
              }}
            </h5>
            <div
              class="d-flex flex-wrap gap-20px w-100 justify-content-between align-items-center"
            >
              <div></div>
              <p v-if="isCompleted" class="text-end mb-2">
                Your score : {{ scoreApi?.score || 0 }} /
                {{ scoreApi?.total }}
              </p>
              <div v-else class="mb-3 w-50 text-center">
                <p>Your progress : {{ progress }} / {{ progressAll }}</p>
                <div class="progress">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    :style="`width: ${(progress * 100) / progressAll}%`"
                  ></div>
                </div>
              </div>
            </div>

            <button
              v-for="(item, index) in listSet"
              class="btn btn-outline-primary text-black text-start border-2 w-100 mb-3 py-3"
              @click="onSelectSet(item.set, quizzes?.set)"
              :disabled="quizzes?.set < item.set"
            >
              <div
                class="d-flex align-items-center justify-content-between w-100"
              >
                <div>
                  <span style="text-wrap-mode: nowrap">
                    {{ String.fromCharCode(65 + index) }}.
                  </span>
                  <span> Set {{ item.set }} </span>
                </div>
                <p>({{ item.answeredCount }}/{{ item.count }})</p>
              </div>
            </button>
            <div class="text-end mb-20px">
              <button
                v-if="items.course.status !== 'DONE'"
                @click="onComplete"
                class="btn btn-primary"
                :disabled="!isCompleted"
              >
                <div class="d-flex align-items-center">
                  <p class="text-start" style="padding-right: 5px">Complete</p>
                </div>
              </button>
              <button v-else class="btn btn-primary" :disabled="true">
                <i class="fa-solid fa-check"></i>
                Complete
              </button>
            </div>
          </div>
          <div
            v-else
            class="lesson-video__wrapper mt-3"
            style="margin-bottom: 100px"
          >
            <h3 class="fw-bolder mb-20px">{{ items.content?.title }}</h3>
            <div
              class="d-flex flex-wrap gap-20px w-100 justify-content-between align-items-center"
            >
              <div v-if="selectSet && listSet?.length">
                <button @click="selectSet = ''" class="btn btn-primary">
                  <div class="d-flex align-items-center">
                    <p class="text-start">Back</p>
                  </div>
                </button>
              </div>
              <div v-else></div>
              <div
                v-if="progress <= progressAll && !selectResult"
                class="w-50 my-2 text-center"
              >
                <p v-if="listSet?.length">
                  Your progress :
                  {{
                    isAnswer
                      ? listSet
                          ?.find((e: any) => e.set === selectSet)
                          ?.results.filter((e: any) => e.isAnswered === true)
                          ?.length || 0
                      : listSet
                          ?.find((e: any) => e.set === selectSet)
                          ?.results.filter((e: any) => e.isAnswered === true)
                          ?.length + 1 || 0
                  }}
                  /
                  {{
                    listSet?.find((e: any) => e.set === selectSet)?.results
                      ?.length
                  }}
                </p>
                <p v-else>Your progress : {{ progress }} / {{ progressAll }}</p>
                <div class="progress">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    :style="`width: ${(progress * 100) / progressAll}%`"
                  ></div>
                </div>
              </div>
              <div v-else class="w-50 my-2 text-end">
                <p
                  v-if="
                    selectedCourse === '1747b66a-c597-4f93-90c1-81ec16a61c3a' ||
                    selectedCourse === '2f6b16dc-06da-4184-b28f-05025ebbda2c'
                  "
                >
                  Your score :
                  {{
                    listSet
                      ?.find((e: any) => e.set === selectResult)
                      ?.results.filter((f: any) => f.results.isCorrect)
                      ?.length || 0
                  }}
                  /
                  {{
                    listSet?.find((e: any) => e.set === selectResult)?.results
                      ?.length
                  }}
                </p>

                <p v-else>
                  Your score : {{ scoreApi?.score || 0 }} /
                  {{ scoreApi?.total }}
                </p>
                <!-- <div class="progress">
                  <div
                    class="progress-bar bg-success"
                    role="progressbar"
                    :style="`width: ${(score * 100) / results?.length}%`"
                  ></div>
                </div> -->
              </div>
            </div>
            <quiz
              v-if="!results?.length && !selectResult"
              :data="quizzes"
              :answers
              @answer-selected="handleAnswer"
            />
            <quiz
              v-else-if="!selectResult && !listSet.length"
              v-for="(data, index) in results"
              :data="data"
              :answers="data.results"
              :key="index"
              :is-done="true"
            />
            <quiz
              v-else-if="selectResult"
              v-for="(data, index) in listSet.find(
                (e: any) => e.set === selectResult
              )?.results"
              :data="data"
              :answers="data.results"
              :key="data.id"
              :is-done="true"
            />

            <div v-if="!selectResult" class="text-end mb-20px">
              <button
                v-if="isCompleted && items.course.status !== 'DONE'"
                @click="onComplete"
                class="btn btn-primary"
              >
                <div class="d-flex align-items-center">
                  <p class="text-start" style="padding-right: 5px">
                    {{ isCompleted ? "Complete" : "Continue" }}
                  </p>
                </div>
              </button>
              <button
                v-else-if="items.course.status === 'INPROGRESS'"
                @click="handleNext"
                class="btn btn-primary"
                :disabled="
                  format === 'normal'
                    ? !answers.answerId
                    : answers?.filter((e: any) => e.answerId === null)?.length
                "
              >
                <div class="d-flex align-items-center">
                  <p class="text-start" style="padding-right: 5px">
                    {{ isAnswer ? "Continue" : "Send Answers" }}
                  </p>
                  <i class="fa-solid fa-chevron-right"></i>
                </div>
              </button>
              <button v-else class="btn btn-primary" :disabled="true">
                <i class="fa-solid fa-check"></i>
                Complete
              </button>
            </div>
          </div>

          <quiz-navbar
            :isShowSidebar
            :is-previos="
              curriculumProcess.findIndex(
                (item: any) => item.courseChildId === selectedCourse
              ) !== 0
            "
            :is-next="items.isNext"
            @onPreviousCourse="onPreviousCourse"
            @onNextCourse="onNextCourse"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import VideoPlayer from "@/components/VideoPlayer.vue";

const { useApi } = useApis();
const { setNo, learnerCodeId, selectedCourse, setSelectedCourse } =
  useQuizStores();
const { toastData, toggleToast } = useConfigsStores();

definePageMeta({
  middleware: ["auth"],
  layout: "learning",
});

onMounted(async () => {
  fetchCurriculum();
  fetchCurriculumProcess();
});

const loading = ref(true);
const items = ref();
const quizzes = ref();
const isCompleted = ref(false);
const results = ref();
const format = ref();
const progress = ref();
const progressAll = ref();
const score = ref();
const firstCome = ref<boolean>(false);
const scoreApi = ref();

// ฟังก์ชันแปลง YouTube URL ให้เป็น embed URL
const getYouTubeEmbedUrl = (url: string): string => {
  if (!url) return "";

  // รองรับ URL รูปแบบต่างๆ
  let videoId = "";

  // https://youtu.be/VIDEO_ID
  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  }
  // https://www.youtube.com/watch?v=VIDEO_ID
  else if (url.includes("youtube.com/watch?v=")) {
    videoId = url.split("v=")[1].split("&")[0];
  }
  // https://www.youtube.com/embed/VIDEO_ID
  else if (url.includes("youtube.com/embed/")) {
    return url; // ถ้าเป็น embed URL แล้วให้ return กลับไป
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return url; // ถ้าไม่ใช่ YouTube URL ให้ return กลับไป
};

// ฟังก์ชันตัวอย่างสำหรับทดสอบ YouTube URL
const testYouTubeUrl = () => {
  const testUrl = "https://youtu.be/9hozpXbA6ek?si=ckVYWZZ7SvO4BhFo";
  console.log("Original URL:", testUrl);
  console.log("Embed URL:", getYouTubeEmbedUrl(testUrl));

  // ตัวอย่างการใช้งานใน items.content.videoUrl
  if (items.value && items.value.content) {
    items.value.content.videoUrl = testUrl;
  }
};

const fetchItems = async () => {
  const response: any = await useApi(
    "GET",
    `curriculum/detail/${selectedCourse.value}/${learnerCodeId.value}`
  );
  if (response.data) {
    items.value = response.data;
  } else {
    toastData.value.status = "fail";
    toastData.value.message = response.error;
    toggleToast();
    loading.value = false;
  }

  if (type.value === "QUIZ") {
    const response: any = await useApi(
      "GET",
      `quiz/${selectedCourse.value}/${learnerCodeId.value}`
    );

    if (response.data) {
      progress.value =
        response.data.filter((e: any) => e.isAnswered === true)?.length + 1 ||
        0;
      progressAll.value = response.data?.length || 0;
      if (progress.value === 1) {
        firstCome.value = true;
      }

      format.value = response.data.find(
        (e: any) => e.isAnswered === false
      )?.format;

      if (
        selectedCourse.value === "1747b66a-c597-4f93-90c1-81ec16a61c3a" ||
        selectedCourse.value === "2f6b16dc-06da-4184-b28f-05025ebbda2c"
      ) {
        listSet.value = Object.entries(
          response.data.reduce(
            (acc: any, item: any) => {
              const setKey = item.set;

              if (!acc[setKey]) {
                acc[setKey] = {
                  set: setKey,
                  count: 0,
                  answeredCount: 0,
                  results: [],
                };
              }

              acc[setKey].count += 1;
              if (item.isAnswered) {
                acc[setKey].answeredCount += 1;
              }
              acc[setKey].results.push(item);

              return acc;
            },
            {} as Record<
              number,
              { set: number; count: number; answeredCount: number }
            >
          )
        ).map(([_, value]) => value);
      } else {
        listSet.value = [];
      }

      if (isAnswer.value) {
        progress.value =
          response.data.filter((e: any) => e.isAnswered === true)?.length || 0;
        format.value = response.data.findLast(
          (e: any) => e.isAnswered === true
        )?.format;
      }

      if (format.value === "normal") {
        isCompleted.value = false;
        results.value = [];
        if (isAnswer.value) {
          const _quiz = response.data.findLast(
            (e: any) => e.isAnswered === true
          );

          quizzes.value = _quiz;
          answers.value = _quiz?.results || null;
        } else {
          const _quiz = response.data.find((e: any) => e.isAnswered === false);
          quizzes.value = _quiz;
          answers.value = _quiz.results;
        }
      } else if (format.value === "group") {
        isCompleted.value = false;
        results.value = [];

        if (isAnswer.value) {
          const _quiz = response.data.findLast(
            (e: any) => e.isAnswered === true
          );

          quizzes.value = _quiz;
          answers.value = _quiz.results;
        } else {
          const _quiz = response.data.find((e: any) => e.isAnswered === false);

          quizzes.value = _quiz;
          answers.value = _quiz.results;
        }
      } else {
        const _score: any = await useApi(
          "GET",
          `curriculum/score/${selectedCourse.value}/${learnerCodeId.value}`
        );
        scoreApi.value = _score.data;

        isCompleted.value = true;
        results.value = response.data;
        score.value =
          response.data.filter((e: any) => e.results.isCorrect === true)
            ?.length || 0;
      }

      loading.value = false;
    } else {
      toastData.value.status = "fail";
      toastData.value.message = response.error;
      toggleToast();
      loading.value = false;
    }
  } else {
    loading.value = false;
  }
};

const selectSet = ref();
const listSet = ref();
const selectResult = ref<any>();
function onSelectSet(_set: number, quizzesSet: number) {
  if (isCompleted.value) {
    selectResult.value = _set;
  } else {
    if (quizzesSet > _set) {
      selectResult.value = _set;
    } else {
      selectResult.value = null;
    }
  }
  selectSet.value = _set;
}

const curriculumList = ref();
const fetchCurriculum = async () => {
  loading.value = true;
  const response: any = await useApi("GET", "curriculum/" + setNo.value);
  if (response.data) {
    curriculumList.value = response.data;

    const allItems = curriculumList.value.curriculum.flatMap(
      (c: any) => c.list
    );

    if (!selectedCourse.value) {
      const inProgressItem = allItems.find(
        (item: any) => item.status === "INPROGRESS"
      );
      type.value = inProgressItem.type;
      setSelectedCourse(inProgressItem.id);
    } else {
      const selectedItem = allItems.find(
        (item: any) => item.id === selectedCourse.value
      );
      type.value = selectedItem.type;
    }

    fetchItems();
  } else {
    toastData.value.status = "fail";
    toastData.value.message = response.error;
    toggleToast();
    loading.value = false;
  }
};

const onComplete = async () => {
  if (isAnswer.value) {
    isAnswer.value = false;
    fetchItems();
  } else {
    const response: any = await useApi(
      "POST",
      `curriculum/complete/${selectedCourse.value}/${learnerCodeId.value}`
    );

    if (response.data) {
      await fetchCurriculum();
      // Auto continue to next Quiz
      // const inProgressItem = curriculumList.value.curriculum
      //   .flatMap((c: any) => c.list)
      //   .find((item: any) => item.status === "INPROGRESS");

      // if (inProgressItem) {
      //   setSelectedCourse(inProgressItem.id);
      //   type.value = inProgressItem.type;
      // }
    } else {
      toastData.value.status = "fail";
      toastData.value.message = response.error;
      toggleToast();
      loading.value = false;
    }
  }
};

const isShowSidebar = ref<boolean>(true);
const toggleSidebar = () => {
  isShowSidebar.value = !isShowSidebar.value;
};

const toggleCollapse = (index: any) => {
  curriculumList.value.curriculum[index].collapsed =
    !curriculumList.value.curriculum[index].collapsed;
};

const type = ref();
const onSelectedCourse = async (item: any) => {
  isPlay.value = false;
  selectResult.value = null;
  selectSet.value = null;
  if (selectedCourse.value !== item.id) {
    type.value = item.type;
    setSelectedCourse(item.id);

    fetchItems();
  }
};

const onPreviousCourse = async () => {
  const response: any = await useApi(
    "GET",
    `curriculum/process/${learnerCodeId.value}`
  );
  if (response.data) {
    const currentIndex = response.data.findIndex(
      (item: any) => item.courseChildId === selectedCourse.value
    );

    if (currentIndex > 0) {
      const previousItem = response.data[currentIndex - 1];
      setSelectedCourse(previousItem.courseChildId);
      type.value = previousItem.type;
      fetchItems();
    }
  }
};

const onNextCourse = async () => {
  const currentIndex = curriculumProcess.value.findIndex(
    (item: any) => item.courseChildId === selectedCourse.value
  );

  if (currentIndex + 1 < curriculumProcess.value.length) {
    const previousItem = curriculumProcess.value[currentIndex + 1];
    setSelectedCourse(previousItem.courseChildId);
    type.value = previousItem.type;
    fetchItems();
  }
};

const curriculumProcess = ref();
const fetchCurriculumProcess = async () => {
  const response: any = await useApi(
    "GET",
    `curriculum/process/${learnerCodeId.value}`
  );
  if (response.data) {
    curriculumProcess.value = response.data;
  }
};

function formatMinutesToEnglish(minutes: number): string {
  const hours = Math.floor(minutes / 60); // คำนวณจำนวนชั่วโมง
  const remainingMinutes = minutes % 60; // คำนวณจำนวนนาทีที่เหลือ

  let result = "";
  if (hours > 0) {
    result += `${hours} ${hours === 1 ? "hour" : "hours"}`; // hour หรือ hours
  }
  if (remainingMinutes > 0) {
    if (hours > 0) {
      result += " "; // เพิ่มช่องว่างระหว่างชั่วโมงและนาที
    }
    result += `${remainingMinutes} ${remainingMinutes === 1 ? "minute" : "minutes"}`; // minute หรือ minutes
  }

  return result.trim(); // ตัดช่องว่างท้ายข้อความ
}

const answers = ref<any>([]);

const handleAnswer = (answer: string, index: string) => {
  if (format.value === "normal") {
    answers.value.answerId = answer;
  } else {
    const answerObj = answers.value[index];
    if (answerObj) {
      answerObj.answerId = answer; // แก้ไขค่า answerId
    } else {
      console.error("Question not found index:", index); // หากไม่พบคำถาม
    }
  }
};

const isAnswer = ref(false);
const handleNext = async () => {
  loading.value = true;

  if (isAnswer.value) {
    isAnswer.value = false;

    if (answers.value.quizId === "a6294a37-74c1-4840-b740-ed8f6e60c029") {
      selectResult.value = 1;
    } else if (
      answers.value.quizId === "804e5af2-d847-425c-9f4c-958513dcbd13"
    ) {
      selectResult.value = 2;
    } else if (
      answers.value.quizId === "36999925-8959-41a7-ad23-7c5fca135e17"
    ) {
      selectResult.value = 3;
    } else if (
      answers.value.quizId === "75093e93-3248-44cf-9aa2-8d35799d8435"
    ) {
      selectResult.value = 4;
    } else if (
      answers.value.quizId === "ea5aa7e1-d2c0-459c-a5c2-c45176c6bc1b"
    ) {
      selectResult.value = 5;
    } else if (
      answers.value.quizId === "9b4b3a78-5397-4507-ba4e-66cc1ea4de45"
    ) {
      selectResult.value = 1;
    } else if (
      answers.value.quizId === "3f37681e-564a-4118-84f7-d10ce8fcabbb"
    ) {
      selectResult.value = 2;
    } else if (
      answers.value.quizId === "11fe67a5-05ad-4eac-a1ac-43534d46e765"
    ) {
      selectResult.value = 3;
    } else if (
      answers.value.quizId === "f96e6a35-7379-48b9-81c8-fb994cf2104a"
    ) {
      selectResult.value = 4;
    } else if (
      answers.value.quizId === "335a01d2-2745-439b-b3fe-dd5857b38935"
    ) {
      selectResult.value = 5;
    }
    fetchItems();
  } else {
    const response: any = await useApi(
      "POST",
      format.value === "normal" ? "quiz" : "quiz/group",
      {
        result: answers.value,
      }
    );

    if (response.data) {
      isAnswer.value = true;
      fetchItems();
    } else {
      toastData.value.status = "fail";
      toastData.value.message = response.error;
      toggleToast();
      loading.value = false;
    }
  }
};

const isPlay = ref(false);
const onPlay = () => {
  isPlay.value = true;
};
</script>
<style scoped>
.pl-20px {
  padding-left: 20px;
}

.my-learning__content_box {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.left-sidebar {
  transform: translateX(-100%);
}

.my-learning__content_box:not(.left-sidebar) {
  transform: translateX(0);
}

/* Transition Effect */
.collapse-enter-active,
.collapse-leave-active {
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  max-height: 500px; /* สูงสุดที่คาดว่าจะใช้ */
  opacity: 1;
}

@media (max-width: 1024px) {
  .my-learning__content_body {
    padding: 0;
  }
}

.video-container {
  position: relative;

  /* Responsive iframe สำหรับ YouTube */
  iframe {
    width: 100%;
    aspect-ratio: 16/9; /* ใช้ aspect-ratio แทน height fixed */
    min-height: 420px; /* กำหนด min-height เพื่อไม่ให้เล็กเกินไป */
    border-radius: 8px;
  }

  video {
    width: 100%;
    height: auto;
  }

  .controls {
    align-items: center;
    gap: 10px;
    background: rgba(0, 0, 0, 0.7);
    padding: 10px;
    color: white;
    font-size: 16px;
    position: absolute;
    bottom: 0;
    width: 100%;
  }

  button {
    background: transparent;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
  }
}

/* Responsive design สำหรับ YouTube iframe */
@media (max-width: 768px) {
  .video-container iframe {
    min-height: 250px;
  }
}

@media (max-width: 480px) {
  .video-container iframe {
    min-height: 200px;
  }
}

/* Style สำหรับ YouTube link container */
.youtube-link-container {
  background-color: #f8f9fa;
  border: 2px dashed #dee2e6 !important;
}

.youtube-link-container:hover {
  background-color: #e9ecef;
  border-color: #adb5bd !important;
}
</style>
