<template>
    <section class="wrapper">
        <div class="type-component">
            <h1>Change your username</h1>
            <a-alert message="Changing your username will reauthenticate you with a new session." type="info"
                show-icon />
            <a-form ref="usernameFormRef" :model="usernameFormState" @finish="submitUsername" autocomplete="new-form"
                class="form">
                <a-form-item class="custom-input" :name="['username']"
                    :rules="[{ required: true, message: 'Username is required.' }, { validator: validateUsername, message: 'Username must be 5-10 characters long and contain only lowercase letters, numbers, or underscores (no special characters or dashes).' }]">
                    <a-input v-model:value="usernameFormState.username" placeholder="Enter your username"
                        autocomplete="new-username">
                        <template #prefix>
                            <UserOutlined class="site-form-item-icon" />
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
        <div class="type-component">
            <h1>Delete your account</h1>
            <a-alert message="Deleting your account will log you out."
                description="We will remove all your boards, teams and organizations." type="error" show-icon>
                <template #icon>
                    <WarningOutlined />
                </template>
            </a-alert>
            <a-form ref="deleteAccFormRef" :model="deleteAccFormState" @finish="deleteAccount" autocomplete="new-form"
                class="form">
                <a-form-item class="custom-input" :name="['password']"
                    :rules="[{ required: true, message: 'Password is required.' }]">
                    <a-input-password v-model:value="deleteAccFormState.password" placeholder="Enter your password"
                        autocomplete="new-password">
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
                <a-button :disabled="state.isDeleting" type="primary" danger size="large" class="button"
                    @click="deleteAccount">
                    <a-spin v-if="state.isDeleting" />
                    Delete Account</a-button>
            </a-form>
        </div>
    </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined, WarningOutlined } from '@ant-design/icons-vue';
import { deleteUser, editUsername, reauth } from '../../helpers/ApiHelper';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const state = reactive({
    isLoading: false,
    isDeleting: false
})

const usernameFormState = reactive({
    username: store.state.user.username,
});

const deleteAccFormState = reactive({
    password: null,
    username: store.state.user.username,
})

const hasChanged = computed(() => {
    return usernameFormState.username !== store.state.user.username
})

const usernameFormRef = ref("usernameFormRef");
const deleteAccFormRef = ref("deleteAccFormRef");

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
        await usernameFormRef.value.validateFields();
        const response = await editUsername({
            ...usernameFormState
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

const deleteAccount = async (e) => {
    state.isDeleting = true;
    try {
        await deleteAccFormRef.value.validateFields();
        const response = await deleteUser({
            ...deleteAccFormState
        });
        if (response.success) {
            await logout();
        }
    } catch (ex) {
        console.error(ex);
    }
    finally {
        state.isDeleting = false;
    }
}

async function logout() {
    store.commit("setUser", {
        isLoggedIn: false,
        username: "",
        id: undefined,
    });
    localStorage.removeItem("token");
    router.push("/login");
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