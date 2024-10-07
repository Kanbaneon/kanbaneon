<template>
  <section class="wrapper">
    <router-link to="/">Back to home</router-link>
    <div class="type-component" v-if="state.isValidating">
      <LoadingImg />
      <h1>Loading...</h1>
    </div>
    <div v-else>
      <div v-if="state.isValidated && !state.isSuccess">
        <change-password
          :token="state.token"
          @onSuccess="handleSuccess"
        ></change-password>
      </div>

      <div class="type-component" v-if="!state.isValidated">
        <ThrowImg />
        <h1>The link might have been expired.</h1>
        <h2>Please send recovery email again.</h2>
        <a-form ref="formRef">
          <a-button type="primary" size="large" block @click="backToForgot()">
            <a-spin v-if="state.isLoading" />
            Go to Password Recovery</a-button
          >
        </a-form>
      </div>

      <div class="type-component" v-if="state.isValidated && state.isSuccess">
        <SuccessImg />
        <h1>Password has been changed.</h1>
        <h2>Please go back to Login page to try again.</h2>
        <a-form ref="formRef">
          <a-button type="primary" size="large" block @click="backToLogin()">
            <a-spin v-if="state.isLoading" />
            Back to Login</a-button
          >
        </a-form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onBeforeMount, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  EyeTwoTone,
  EyeInvisibleOutlined,
  LockOutlined,
} from "@ant-design/icons-vue";
import { editPassword, validateToken } from "../../helpers/ApiHelper";
import LoadingImg from "../../assets/Loading.vue";
import ThrowImg from "../../assets/Throw.vue";
import SuccessImg from "../../assets/Success.vue";
import ChangePassword from "../Shared/ChangePassword.vue";

const route = useRoute();
const router = useRouter();
const state = reactive({
  token: route.query.token,
  isSuccess: false,
  isLoading: false,
  isValidating: true,
  isValidated: false,
});

onBeforeMount(async () => {
  try {
    const response = await validateToken(route.query?.token);
    if (response.success) {
      state.isValidated = true;
    }
  } catch (ex) {
    console.error(ex);
  } finally {
    state.isValidating = false;
  }
});

const backToLogin = () => {
  router.push({ path: "/login" });
};

const backToForgot = () => {
  router.push({ path: "/forgot", query: { type: "password" } });
};

const handleSuccess = (event) => {
  state.isSuccess = event;
};
</script>

<style scoped>
.wrapper {
  padding: 64px;
}

.wrapper .type-component {
  margin: 32px;
}

h1 {
  font-weight: 700;
}

h2 {
  font-size: 1rem;
  color: white;
}

.ant-form {
  margin-top: 32px;
  max-width: 480px !important;
}

.ant-input {
  padding: 10px 10px;
}

.ant-input-affix-wrapper,
.ant-input-password {
  padding: 10px 10px;
}

a {
  text-decoration: underline;
  color: -webkit-link;
}
</style>
