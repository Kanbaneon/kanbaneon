<template>
  <div class="wrapper">
    <a-form ref="formRef" :model="formState" @finish="signUp" autocomplete="new-form">
      <a-card class="card">
        <h2 class="title">
          KAN<span class="subtitle">BANEON</span>
          <span class="version" v-if="isLite"> Lite</span>
        </h2>
        <div class="input-wrapper">
          <a-form-item :name="['username']"
            :rules="[{ required: true, message: 'Username is required.' }, { validator: validateUsername, message: 'Username must be 5-10 characters long and contain only letters, numbers, or underscores (no special characters or dashes).'}]">
            <a-input v-model:value="formState.username" placeholder="Enter your username" autocomplete="new-username">
              <template #prefix>
                <UserOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item :name="['email']"
            :rules="[{ required: true, message: 'Email is required.' }, { type: 'email', message: 'This is not a valid email.' }]">
            <a-input v-model:value="formState.email" placeholder="Enter your email" autocomplete="new-email">
              <template #prefix>
                <MailOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item :name="['password']"
            :rules="[{ required: true, message: 'Password is required.' }, { validator: validatePassword, message: 'Password must have 8-16 characters long and include at least a uppercase letter, a lowercase letter, a number, and a special character.' }]">
            <a-input-password v-if="!isLite" v-model:value="formState.password" placeholder="Enter your password"
              type="password" autocomplete="new-password">
              <template #prefix>
                <LockOutlined class="site-form-item-icon" />
              </template>
              <template #iconRender="v">
                <EyeTwoTone v-if="v"></EyeTwoTone>
                <EyeInvisibleOutlined v-else></EyeInvisibleOutlined>
              </template>
            </a-input-password>
          </a-form-item>
        </div>
        <p>By signing up, you are agreeing to our <a href="/terms-and-conditions" target="blank">terms and
            conditions</a>.</p>
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
    </a-form>
  </div>
</template>

<script lang="ts">
import { message } from "ant-design-vue";
import { signUp } from "../helpers/ApiHelper";
import { EyeTwoTone, EyeInvisibleOutlined, UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons-vue';

export default {
  data: () => {
    return {
      // @ts-ignore
      isLite: import.meta.env.VITE_LITE_VERSION === "ON",
      isLoading: false,
      formState: {
        username: "",
        email: "",
        password: "",
      }
    };
  },
  components: {
    EyeTwoTone, EyeInvisibleOutlined, UserOutlined, MailOutlined, LockOutlined
  },
  methods: {
    async validateUsername(_, value) {
      if (!value) {
        return Promise.resolve();
      }
      const usernameStandard = /^[A-Za-z0-9_]{5,10}$/
      if (usernameStandard.test(value)) {
        return Promise.resolve();
      }
      return Promise.reject("Password invalid");
    },
    async validatePassword(_, value) {
      if (!value) {
        return Promise.resolve();
      }
      const passwordStandard = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,16}$/
      if (passwordStandard.test(value)) {
        return Promise.resolve();
      }
      return Promise.reject("Password invalid");
    },
    async signUp() {
      try {
        await this.$refs.formRef.validateFields();
        this.isLoading = true;
        const result = await signUp(this.formState.username, this.formState.email, this.formState.password);
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
  width: 30vw;
}

.input-wrapper {
  margin: 16px 0px;
  width: 100%;
}

.ant-input {
  padding: 8px 8px;
}

.ant-input-affix-wrapper,
.ant-input-password {
  padding: 8px 8px;
}

.form-footer {
  padding-top: 20px;
}

a {
  text-decoration: underline;
}
</style>

<style>
.card .ant-card-body {
  flex-direction: column;
}
</style>
