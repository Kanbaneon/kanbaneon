<template>
  <div class="type-component">
    <h1>Reset your password</h1>
    <h2 :style="{ color: props.subtitleColor }">
      Enter your new password below.<br />
    </h2>
    <a-form
      ref="formRef"
      :model="formState"
      @finish="submitPassword"
      autocomplete="new-form"
    >
      <a-form-item
        class="custom-input"
        :name="['password']"
        :rules="[
          { required: true, message: 'Password is required.' },
          {
            validator: validatePassword,
            message:
              'Password must have 8-24 characters long and include at least a uppercase letter, a lowercase letter, a number, and a special character.',
          },
        ]"
      >
        <a-input-password
          v-model:value="formState.password"
          placeholder="Enter your new password"
          autocomplete="new-password"
        >
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
          <template #iconRender="v">
            <EyeTwoTone v-if="v"></EyeTwoTone>
            <EyeInvisibleOutlined v-else></EyeInvisibleOutlined>
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item
        class="custom-input"
        :name="['confirmPassword']"
        :rules="[
          { required: true, message: 'Confirm your password' },
          {
            validator: validateConfirmation,
            message: 'Both passwords must match.',
          },
        ]"
      >
        <a-input-password
          v-model:value="formState.confirmPassword"
          placeholder="Enter your password again to confirm"
          autocomplete="new-password"
        >
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
          <template #iconRender="v">
            <EyeTwoTone v-if="v"></EyeTwoTone>
            <EyeInvisibleOutlined v-else></EyeInvisibleOutlined>
          </template>
        </a-input-password>
      </a-form-item>
      <input type="submit" hidden />
      <a-button
        :disabled="state.isLoading"
        type="primary"
        size="large"
        block
        @click="submitPassword"
      >
        <a-spin v-if="state.isLoading" />
        Change Password</a-button
      >
    </a-form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import {
  EyeTwoTone,
  EyeInvisibleOutlined,
  LockOutlined,
} from "@ant-design/icons-vue";
import { editPassword } from "../../helpers/ApiHelper";

const state = reactive({
  isLoading: false,
});

const props = defineProps(["subtitleColor", "inApp", "token"]);
const emit = defineEmits(["onSuccess"])

const formState = reactive({
  password: null,
  confirmPassword: null,
});

const formRef = ref("formRef");

const validateConfirmation = async (rule, value) => {
  if (!value) {
    return Promise.resolve();
  }
  if (rule.field === "password") {
    if (value !== formState.confirmPassword) {
      return Promise.reject("Both passwords must match.");
    }
    return Promise.resolve();
  }
  if (rule.field === "confirmPassword") {
    if (value !== formState.password) {
      return Promise.reject("Both passwords must match.");
    }
    return Promise.resolve();
  }
};

const validatePassword = async (_, value) => {
  if (!value) {
    return Promise.resolve();
  }
  const passwordStandard =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,24}$/;
  if (passwordStandard.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject("Password invalid");
};

const submitPassword = async (e) => {
  state.isLoading = true;
  try {
    await formRef.value.validateFields();
    const response = await editPassword({
      inApp: props.inApp,
      token: props.token,
      ...formState,
    });
    if (response.success) {
      emit("onSuccess", true);
    }
  } catch (ex) {
    console.error(ex);
  } finally {
    state.isLoading = false;
  }
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
