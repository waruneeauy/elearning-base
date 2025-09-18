<script setup lang="ts">
defineProps({
  label: {
    type: String,
    default: "",
  },
  subLabel: {
    type: String,
    default: "",
  },
});

const isShow = defineModel<boolean>("isShow", { required: true });
</script>

<template>
  <q-dialog v-model="isShow">
    <q-card>
      <q-card-section class="row items-center q-pa-sm">
        <div class="text-bold">{{ label }}</div>
        <q-space />
        <q-btn
          rounded
          icon="close"
          color="red"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>

      <q-separator />
      <q-card-section class="q-pa-lg" style="min-width: 400px">
        <div
          v-html="
            `
            <strong>LISTENING</strong>
            <li>Template 1 : image and audio</li> 
            <li>Template 2 : video only</li> 
            <li>Template 3 : audio only</li> 
                
            <br/><hr/><br/>

            <strong>READING</strong>
            <li>Template 1 : question and answer</li> 
            <li>Template 2 : image only</li> 
            <li>Template 3 : content only</li> 
            
          `
          "
        ></div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
