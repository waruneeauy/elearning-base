<script setup lang="ts">
import Plyr from "plyr";

const { useApi } = useApis();
const { toastData, toggleToast } = useConfigsStores();

const props = defineProps<{ videoUrl: string; courseChildId: string }>();
const videoRef = ref<HTMLVideoElement | null>(null);
let player: Plyr | null = null;
let hasPlayed = false; // ตัวแปรเช็คว่ากด play ครั้งแรกหรือยัง

onMounted(() => {
  nextTick(() => {
    if (videoRef.value) {
      player = new Plyr(videoRef.value, {
        controls: [
          "play-large", // The large play button in the center
          "restart", // Restart playback
          "rewind", // Rewind by the seek time (default 10 seconds)
          "play", // Play/pause playback
          "fast-forward", // Fast forward by the seek time (default 10 seconds)
          "progress", // The progress bar and scrubber for playback and buffering
          "current-time", // The current time of playback
          "duration", // The full duration of the media
          "mute", // Toggle mute
          "volume", // Volume control
          "captions", // Toggle captions
          "settings", // Settings menu
          "pip", // Picture-in-picture (currently Safari only)
          "airplay", // Airplay (currently Safari only)
          // "download", // Show a download button with a link to either the current source or a custom URL you specify in your options
          "fullscreen", // Toggle fullscreen
        ],
        settings: ["speed"],
      });

      // Update Plyr source after creating the instance
      if (props.videoUrl) {
        player.source = {
          type: "video",
          sources: [{ src: props.videoUrl, type: "video/mp4" }],
        };
      }

      // Event listener สำหรับ play
      player.on("play", () => {
        if (!hasPlayed) {
          // ถ้ายังไม่เคยกด Play มาก่อน
          hasPlayed = true;
          // เรียก API สำหรับ track การดูวิดีโอ
          trackVideoPlay();
        }
      });
    }
  });
});

watch(
  () => props.videoUrl,
  (newUrl) => {
    if (player && newUrl) {
      player.source = {
        type: "video",
        sources: [{ src: newUrl, type: "video/mp4" }],
      };
    }
  }
);

const emit = defineEmits(["onPlay"]);

// ฟังก์ชันในการเรียก API เพื่อติดตามการดูวิดีโอ
const trackVideoPlay = async () => {
  emit("onPlay");
  const response: any = await useApi(
    "PUT",
    `course/start-video/${props.courseChildId}`
  );
  if (!response.data) {
    toastData.value.status = "fail";
    toastData.value.message = response.error;
    toggleToast();
  }
};
</script>

<template>
  <video ref="videoRef" playsinline controls></video>
</template>

<style>
@import "plyr/dist/plyr.css";
video {
  width: 100%;
  height: auto;
}
</style>
