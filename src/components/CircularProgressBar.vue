<script setup lang="ts">
withDefaults(defineProps<{ message?: string }>(), {
  message: 'Loading...',
});
</script>

<template>
  <div
    data-testid="circular-progress-bar"
    class="d-flex justify-center align-center pa-8 fill-height"
  >
    <v-progress-circular indeterminate />
    <p class="ml-3">{{ message }}</p>
  </div>
</template>
