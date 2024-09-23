<template>
  <div class="wrapper">
    <form @submit.prevent="isLite ? login($event) : loginApi($event)">
      <a-card class="card">
        <h2 class="title">
          KAN<span class="subtitle">BANEON</span>
          <span class="version" v-if="isLite"> Lite</span>
        </h2>
        <div class="input-wrapper">
          <a-input v-model:value="username" placeholder="Enter your username or email">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
          <label class="error-label">{{ error.username }}&nbsp;</label>
          <a-input-password v-if="!isLite" v-model:value="password" placeholder="Enter your password" type="password">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
            <template #iconRender="v">
              <EyeTwoTone v-if="v"></EyeTwoTone>
              <EyeInvisibleOutlined v-else></EyeInvisibleOutlined>
            </template>
          </a-input-password>
          <label v-if="!isLite" class="error-label">{{ error.password }}&nbsp;</label>
        </div>
        <input type="submit" hidden />
        <a-button :disabled="isLoading" type="primary" size="large" block
          @click="isLite ? login($event) : loginApi($event)">
          <a-spin v-if="isLoading" />
          Login</a-button>
        <div class="form-footer" v-if="!isLite">
          Don't have an account?
          <span>
            <router-link to="/signup">Sign Up Here</router-link>
          </span>
        </div>
      </a-card>
    </form>
  </div>
</template>

<script lang="ts">
import { v4 } from "uuid";
import { INDEXED_DB, browserDB } from "../helpers/IndexedDbHelper";
import { getExistingUser } from "../store";
import { login } from "../helpers/ApiHelper";
import { EyeTwoTone, EyeInvisibleOutlined, UserOutlined, LockOutlined } from '@ant-design/icons-vue';

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
  components: {
    EyeTwoTone, EyeInvisibleOutlined, UserOutlined, LockOutlined
  },
  methods: {
    async login(e) {
      e.preventDefault();
      let userId = await getExistingUser(this.username);
      if (!userId) {
        userId = v4();
        await browserDB.put(INDEXED_DB.objectStores.KANBANEON, "users", {
          [this.username]: userId,
        });
      }

      this.$store.commit("setUser", {
        username: this.username,
        isLoggedIn: true,
        id: userId,
      });
      this.$router.push("/");
    },
    async loginApi(e) {
      e.preventDefault();
      this.isLoading = true;
      try {
        const user = await login(this.username, this.password);
        if (!!user?.success) {
          this.$store.commit("setUser", {
            username: this.username,
            isLoggedIn: true,
            ...user
          });
          localStorage.setItem("token", user.token);
          this.$router.push("/");
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

.ant-input-affix-wrapper, .ant-input-password {
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
