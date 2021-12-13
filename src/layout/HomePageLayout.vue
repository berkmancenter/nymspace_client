<template>
  <HeaderSection />
  <router-view></router-view>
  <FooterSection />
</template>

<script setup>
import HeaderSection from "../components/Shared/HeaderSection.vue";
import FooterSection from "../components/Shared/FooterSection.vue";
</script>
