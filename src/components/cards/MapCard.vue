<script setup lang="ts">
import { computed, ref } from 'vue';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useGeolocationStore } from '@/stores/useGeolocationStore';
import LoadingSpinner from '../CircularProgressBar.vue';
import NoDataContentText from './NoDataContentText.vue';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const zoom = ref(14);
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution =
  '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const geoStore = useGeolocationStore();

const lat = computed(() => geoStore.location.latitude ?? 0);
const lng = computed(() => geoStore.location.longitude ?? 0);
const mapRef = ref<InstanceType<typeof LMap>>();

const mapConfig = {
  zoomControl: false,
  attributionControl: true,
  dragging: false,
  touchZoom: false,
  scrollWheelZoom: false,
  doubleClickZoom: false,
  boxZoom: false,
  keyboard: false,
};
</script>

<template>
  <v-card class="fill-height">
    <template v-if="geoStore.loading">
      <LoadingSpinner />
    </template>

    <template v-else-if="!geoStore.location">
      <NoDataContentText />
    </template>

    <div v-else data-testid="map-wrapper">
      <v-lazy>
        <l-map
          ref="mapRef"
          :center="[lat, lng]"
          :zoom="zoom"
          :use-global-leaflet="false"
          style="min-height: 400px; height: 100%; width: 100%"
          :options="mapConfig"
          data-testid="map-container"
        >
          <l-tile-layer :url="tileUrl" :attribution="attribution" />
          <l-marker :lat-lng="[lat, lng]" />
        </l-map>
      </v-lazy>
    </div>
  </v-card>
</template>
