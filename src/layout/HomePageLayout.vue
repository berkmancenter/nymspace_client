<template>
  <HeaderSection />
  <router-view></router-view>
  <FooterSection />
</template>

<script setup>
import HeaderSection from "../components/HeaderSection.vue";
import FooterSection from "../components/FooterSection.vue";
</script>
