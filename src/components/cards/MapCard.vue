<script setup lang="ts">
import { computed, ref } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useGeolocationStore } from '@/stores/useGeolocationStore';
import { storeToRefs } from 'pinia';
import LoadingSpinner from '../CircularProgressBar.vue';
import NoDataContentText from './NoDataContentText.vue';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const zoom = ref(14);
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

const geoStore = useGeolocationStore();
const { loading, location } = storeToRefs(geoStore);

const lat = computed(() => location.value.latitude ?? 0);
const lng = computed(() => location.value.longitude ?? 0);
const mapRef = ref<InstanceType<typeof LMap>>();
</script>

<template>
  <v-card class="fill-height">
    <template v-if="loading">
      <LoadingSpinner />
    </template>

    <template v-else-if="!location">
      <NoDataContentText />
    </template>

    <div v-else>
      <v-lazy :inert="true">
        <l-map
          ref="mapRef"
          :center="[lat, lng]"
          :zoom="zoom"
          :use-global-leaflet="false"
          style="min-height: 400px; height: 100%; width: 100%"
          :options="{ zoomControl: false }"
          data-testid="map-container"
        >
          <l-tile-layer :url="tileUrl" />
          <l-marker :lat-lng="[lat, lng]">
            <l-popup />
          </l-marker>
        </l-map>
      </v-lazy>
      <v-chip
        size="x-small"
        variant="flat"
        class="position-absolute"
        color="grey-darken-3"
        rounded="pill"
        style="bottom: 5px; right: 5px; z-index: 1000"
        data-testid="map-attribution"
      >
        <span class="text-caption">
          ©
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener"
            class="text-decoration-none"
          >
            OpenStreetMap
          </a>
          contributors
        </span>
      </v-chip>
    </div>
  </v-card>
</template>
