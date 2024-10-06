<template>
  <section class="wrapper">
    <a-spin :spinning="state.isLoading" size="large" tip="Loading...">
      <div class="type-component">
        <h1>Subscribe to newsletter and updates</h1>
        <a-form ref="notificationFormRef" :model="notificationFormState" @finish="submitNotificationSettings"
          autocomplete="new-form" class="form">
          <a-form-item class="custom-input" :name="['newsletter']">
            <a-checkbox v-if="notificationFormState.newsletter" v-model:checked="notificationFormState.newsletter">
              You are currently subscribed to our newsletter and updates
            </a-checkbox>
            <a-checkbox v-if="!notificationFormState.newsletter" v-model:checked="notificationFormState.newsletter">
              You are not subscribed to our newsletter and updates
            </a-checkbox>
          </a-form-item>
          <h1>Your watchlists</h1>
          <a-form-item class="custom-input" :name="['watchlists']">
            <div v-if="!notificationFormState.watchlists.length">
              <WatchlistImg />
              <p>You do not have any watchlist. You may watch the activities on the boards that you have access.</p>
            </div>
          </a-form-item>
          <input type="submit" hidden />
          <a-button :disabled="state.isLoading" type="primary" size="large" class="button"
            @click="submitNotificationSettings">
            <a-spin v-if="state.isLoading" />
            Save Settings</a-button>
        </a-form>
      </div>
    </a-spin>
  </section>
</template>

<script setup>
import { computed, onBeforeMount, reactive, ref } from 'vue';
import WatchlistImg from "../../assets/Watchlist.vue";
import { getNotification } from '../../helpers/ApiHelper';


const state = reactive({
  isLoading: false,
  isDeleting: false
})

const notificationFormState = reactive({
  newsletter: false,
  watchlists: []
});

const notificationFormRef = ref("notificationFormRef");

onBeforeMount(async () => {
  state.isLoading = true;
  try {
    const result = await getNotification();
    if (result.success) {
      notificationFormState.newsletter = result.notification.newsletter;
      notificationFormState.watchlists = result.notification.watchlists;
    }
  } catch (ex) {
    console.error(ex);
  }
  finally {
    state.isLoading = false;
  }
})

const submitNotificationSettings = async (e) => {
  state.isLoading = true;
  try {
    await notificationFormRef.value.validateFields();
  } catch (ex) {
    console.error(ex);
  }
  finally {
    state.isLoading = false;
  }
}
</script>

<style scoped>
h1 {
  font-weight: 700;
}

h2 {
  font-size: 1rem;
  color: white;
}

.wrapper {
  height: calc(65vh + 6px);
  margin-top: 50px;
  width: 78vw;
  overflow-y: auto;
}

.type-component {
  max-width: 600px;
}

.form {
  position: relative;
}

.ant-form {
  margin-top: 14px;
  margin-bottom: 80px;
}

.ant-alert {
  padding: 14px;
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

.button {
  position: absolute;
  right: 0px;
}
</style>