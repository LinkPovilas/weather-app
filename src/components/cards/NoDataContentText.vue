<script setup lang="ts">
withDefaults(defineProps<{ message?: string }>(), {
  message: 'No data available',
});
</script>

<template>
  <v-card-text
    class="d-flex justify-center align-center fill-height text-body-1"
    data-testid="no-data-content-text"
  >
    <v-icon icon="mdi-information-outline" size="large" data-testid="no-data-content-text-icon" />
    <p class="ml-1">{{ message }}</p>
  </v-card-text>
</template>
