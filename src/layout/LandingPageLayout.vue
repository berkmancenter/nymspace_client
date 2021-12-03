<template>
  <BannerSection />
  <router-view></router-view>
</template>

<script>
import BannerSection from "../components/Banner/BannerSection.vue";
export default {
  components: { BannerSection },
};
</script>
