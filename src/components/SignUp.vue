<template>
  <div class="wrapper">
    <form @submit.prevent="signUp($event)">
      <a-card class="card">
        <h2 class="title">
          KAN<span class="subtitle">BANEON</span>
          <span class="version" v-if="isLite"> Lite</span>
        </h2>
        <div class="input-wrapper">
          <a-input v-model:value="username" placeholder="Enter your username" />
          <label class="error-label">{{ error.username }}&nbsp;</label>
          <a-input v-if="!isLite" v-model:value="password" placeholder="Enter your password" type="password" />
          <label v-if="!isLite" class="error-label">{{ error.password }}&nbsp;</label>
        </div>
        <input type="submit" hidden />
        <a-button :disabled="isLoading" type="primary" size="large" block @click="signUp($event)">
          <a-spin v-if="isLoading" />
          Sign Up</a-button>
        <div class="form-footer">
          Already have an account?
          <span>
            <router-link to="/login">Login Here</router-link>
          </span>
        </div>
      </a-card>
    </form>
  </div>
</template>

<script lang="ts">
import { signUp } from "../helpers/ApiHelper";

export default {
  data: () => {
    return {
      // @ts-ignore
      isLite: import.meta.env.VITE_LITE_VERSION === "ON",
      isLoading: false,
      username: "",
      password: "",
      error: { username: "", password: "" },
    };
  },
  methods: {
    async signUp(e) {
      e.preventDefault();
      this.isLoading = true;
      try {
        const result = await signUp(this.username, this.password);
        if (result?.success) {
          this.$router.push("/login");
        }
      } catch (ex) {
        console.error(ex);
      }
      finally {
        this.isLoading = false;
      }
    }
  },
};
</script>

<style lang="css" scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.title {
  display: inline;
  font-size: 32px;
  font-weight: bold;
  color: #42b883;
  cursor: pointer;
}

.subtitle {
  color: #35495e;
}

.version {
  font-size: 14px;
}

.card {
  width: 25vw;
}

.input-wrapper {
  margin: 16px 0px;
  width: 100%;
}

.ant-input {
  padding: 8px 8px;
}

.form-footer {
  padding-top: 20px;
}
</style>

<style>
.card .ant-card-body {
  flex-direction: column;
}
</style>
