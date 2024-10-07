<template>
  <section class="container">
    <ChangePassword subtitle-color="black" :in-app="true" />
  </section>
</template>

<script setup>
import ChangePassword from '../Shared/ChangePassword.vue';

</script>

<style scoped>
.container {
  margin-top: 48px;
  height: 66vh;
  width: 70vw;
}
</style>