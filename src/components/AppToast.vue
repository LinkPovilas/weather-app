<script setup lang="ts">
import { useMessagesStore } from '@/stores/useMessagesStore';

const messageStore = useMessagesStore();
</script>

<template>
  <v-snackbar-queue
    v-model="messageStore.queue"
    location="top right"
    timer="white"
  ></v-snackbar-queue>
</template>
