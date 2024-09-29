<template>
    <section class="wrapper">
        <router-link to="/">Back to home</router-link>
        <div class="type-component" v-if="state.type === 'password' && !state.isSuccess">
            <h1>Reset your password</h1>
            <h2>Enter your username and <br />we’ll send a link to reset your password.</h2>
            <a-form ref="formRef" :model="formState[state.type]" @finish="sendEmail" autocomplete="new-form">
                <a-form-item class="custom-input" :name="['username']"
                    :rules="[{ required: true, message: 'Username is required.' }]">
                    <a-input v-model:value="formState[state.type].username" placeholder="Enter your username"
                        autocomplete="new-username">
                        <template #prefix>
                            <UserOutlined class="site-form-item-icon" />
                        </template>
                    </a-input>
                </a-form-item>
                <p><router-link to="forgot?type=username">Forgot your username?</router-link></p>
                <input type="submit" hidden />
                <a-button :disabled="state.isLoading" type="primary" size="large" block @click="sendEmail">
                    <a-spin v-if="state.isLoading" />
                    Send Email</a-button>
            </a-form>
        </div>

        <div class="type-component" v-if="state.type === 'username' && !state.isSuccess">
            <h1>Recover your account</h1>
            <h2>Enter your email to help us find you.<br />
                We’ll send you a link to recover your account.</h2>
            <a-form ref="formRef" :model="formState[state.type]" @finish="sendEmail" autocomplete="new-form">
                <a-form-item :name="['email']"
                    :rules="[{ required: true, message: 'Email is required.' }, { type: 'email', message: 'This is not a valid email.' }]">
                    <a-input v-model:value="formState[state.type].email" placeholder="Enter your email"
                        autocomplete="new-email">
                        <template #prefix>
                            <MailOutlined class="site-form-item-icon" />
                        </template>
                    </a-input>
                </a-form-item>
                <p><router-link to="forgot?type=password">Forgot your password?</router-link></p>
                <input type="submit" hidden />
                <a-button :disabled="state.isLoading" type="primary" size="large" block @click="sendEmail">
                    <a-spin v-if="state.isLoading" />
                    Send Email</a-button>
            </a-form>
        </div>

        <div class="type-component" v-if="state.isSuccess">
            <EmailSentImg />
            <h1>Check your email...</h1>
            <h2> There should be a link to recover your account.</h2>
            <a-form ref="formRef">
                <a-button type="primary" size="large" block @click="backToLogin()">
                    <a-spin v-if="state.isLoading" />
                    Back to Login</a-button>
            </a-form>
        </div>
    </section>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons-vue';
import { sendRecoveryEmail } from '../helpers/ApiHelper';
import EmailSentImg from "../assets/EmailSent.vue";

const route = useRoute();
const router = useRouter();
const state = reactive({
    type: route.query.type,
    isSuccess: false,
    isLoading: false
})

watch(() => route.query?.type, (newValue) => {
    state.type = newValue;
});

const formState = reactive({
    password: {
        username: null
    },
    username: {
        email: null
    }
})

const backToLogin = () => {
    router.push({ path: "/login" });
}

const sendEmail = async (e) => {
    state.isLoading = true;
    try {
        const response = await sendRecoveryEmail({
            type: state.type,
            ...formState[state.type]
        });
        if (response.success) {
            state.isSuccess = true;
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