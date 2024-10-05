<template>
    <section class="wrapper">
        <div class="type-component">
            <h1>Change your username</h1>
            <a-alert message="Important Note"
                description="Changing your username will reauthenticate you with a new session." type="info" show-icon>
                <template #icon>
                    <InfoCircleOutlined />
                </template>
            </a-alert>
            <a-form ref="formRef" :model="formState" @finish="submitUsername" autocomplete="new-form" class="form">
                <a-form-item class="custom-input" :name="['username']"
                    :rules="[{ required: true, message: 'Username is required.' }, { validator: validateUsername, message: 'Username must be 5-10 characters long and contain only lowercase letters, numbers, or underscores (no special characters or dashes).' }]">
                    <a-input v-model:value="formState.username" placeholder="Enter your username"
                        autocomplete="new-username">
                        <template #prefix>
                            <UserOutlined class="site-form-item-icon" />
                        </template>
                        <template #iconRender="v">
                            <EyeTwoTone v-if="v"></EyeTwoTone>
                            <EyeInvisibleOutlined v-else></EyeInvisibleOutlined>
                        </template>
                    </a-input>
                </a-form-item>
                <input type="submit" hidden />
                <a-button :disabled="state.isLoading || !hasChanged" type="primary" size="large" class="button"
                    @click="submitUsername">
                    <a-spin v-if="state.isLoading" />
                    Change Username</a-button>
            </a-form>
        </div>
    </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { UserOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';
import { editPassword, editUsername, reauth, validateToken } from '../../helpers/ApiHelper';
import { useStore } from 'vuex';

const store = useStore();
const state = reactive({
    isLoading: false,
})

const formState = reactive({
    username: store.state.user.username,
})

const hasChanged = computed(() => {
    return formState.username !== store.state.user.username
})

const formRef = ref("formRef");

async function validateUsername(_, value) {
    if (!value) {
        return Promise.resolve();
    }
    const usernameStandard = /^[a-z0-9_]{5,10}$/
    if (usernameStandard.test(value)) {
        return Promise.resolve();
    }
    return Promise.reject("Password invalid");
}

const submitUsername = async (e) => {
    state.isLoading = true;
    try {
        await formRef.value.validateFields();
        const response = await editUsername({
            ...formState
        });
        if (response.success) {
            localStorage.setItem("token", response.token);
            const result = await reauth(response.token);
            store.state.user = {
                username: result.reauth.username,
                isLoggedIn: true,
            };
            store.commit("setProfile");
        }
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

.form {
    width: 600px;
    height: calc(40vh + 30px);
    position: relative;
}

.ant-form {
    margin-top: 32px;
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