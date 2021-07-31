<template>
  <ComingSoon />
</template>

<script>
import { store } from "./utils/Data.store";
import ComingSoon from "./components/ComingSoon.vue";
import Header from "./components/Header.vue";

export default {
  components: {
    Header,
    ComingSoon,
  },
  async mounted() {
    await store.openDatabase();
    await store.getFromDB();
  },
};
</script>

<style>
body {
  background-color: #42b883 !important;
}

.ant-card-body {
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.error-label {
  color: rgb(243, 67, 67);
}
</style>
