<template>
  <div class="container">
    <GetStartedImg />
    <h1>Kanbaneon is in development.</h1>
    <h5>
      Please trace the progress at
      <a href="https://github.com/Kanbaneon/kanbaneon"
        >https://github.com/Kanbaneon/kanbaneon</a
      >
    </h5>
  </div>
</template>

<script>
import GetStartedImg from "../assets/GetStartedImg.vue";

export default {
  components: {
    GetStartedImg,
  },
};
</script>

<style scoped>
.container {
  height: 100vh;
  background: #42b883;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h1 {
  color: white;
  font-size: 46px;
}

h5 {
  color: white;
  font-size: 16px;
}

a {
  text-decoration: underline;
  color: #35495e;
  font-weight: bold;
}
</style>
