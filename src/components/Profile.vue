<template>
    <section class="container">
        <a-form layout="vertical">
            <a-form-item>
                <template #label>
                    <label class="label">
                        Username
                    </label>
                </template>
                <a-input v-model:value="state.formState.username" placeholder="Enter your username" disabled>
                    <template #prefix>
                        <UserOutlined class="site-form-item-icon" />
                    </template>
                </a-input>
            </a-form-item>

            <a-form-item>
                <template #label>
                    <label class="label">
                        Name
                    </label>
                </template>
                <a-input v-model:value="state.formState.name" placeholder="Enter your name">
                    <template #prefix>
                        <UserOutlined class="site-form-item-icon" />
                    </template>
                </a-input>
            </a-form-item>

            <a-form-item>
                <template #label>
                    <label class="label">
                        Email
                    </label>
                </template>
                <a-input v-model:value="state.formState.email" placeholder="Enter your email address">
                    <template #prefix>
                        <MailOutlined class="site-form-item-icon" />
                    </template>
                </a-input>
            </a-form-item>

            <a-form-item>
                <template #label>
                    <label class="label">
                        Occupation
                    </label>
                </template>
                <a-input v-model:value="state.formState.occupation" placeholder="Enter your occupation">
                    <template #prefix>
                        <IdcardOutlined class="site-form-item-icon" />
                    </template>
                </a-input>
            </a-form-item>

            <a-form-item>
                <template #label>
                    <label class="label">
                        Teams
                    </label>
                </template>
                <a-input v-model:value="state.formState.teams" placeholder="Enter your teams">
                    <template #prefix>
                        <TeamOutlined class="site-form-item-icon" />
                    </template>
                </a-input>
            </a-form-item>

            <a-form-item>
                <template #label>
                    <label class="label">
                        Organization
                    </label>
                </template>
                <a-input v-model:value="state.formState.organization" placeholder="Enter your organization">
                    <template #prefix>
                        <GlobalOutlined class="site-form-item-icon" />
                    </template>
                </a-input>
            </a-form-item>

            <input type="submit" hidden />
            <a-button :disabled="state.isLoading" type="primary" size="large" block
                @click="isLite ? saveProfile($event) : saveProfileApi($event)">
                <a-spin v-if="state.isLoading" />
                {{ state.isLoading ? "Loading..." : "Save Profile" }}</a-button>
        </a-form>
    </section>
</template>

<script setup>
import { UserOutlined, MailOutlined, IdcardOutlined, GlobalOutlined, TeamOutlined } from "@ant-design/icons-vue";
import { onMounted, reactive } from "vue";
import { useStore } from "vuex";
import { editProfile, getProfile } from "../helpers/ApiHelper";

const isLite = import.meta.env.VITE_LITE_VERSION === "ON";

const $store = useStore();

const state = reactive({
    formState: {
        username: $store?.state?.user?.username,
        name: $store?.state?.user?.name,
        email: $store?.state?.user?.email,
    },
    isLoading: false
});

onMounted(async () => {
    try {
        const response = await getProfile();
        state.formState = {
            ...state.formState,
            ...response.user
        }
    } catch (ex) {
        console.error(ex);
    }
})

const saveProfileApi = async () => {
    try {
        state.isLoading = true;
        const response = await editProfile({ name: state.formState.name, email: state.formState.email });
        state.formState = {
            ...state.formState,
            ...response.user
        }
    } catch (ex) {
        console.error(ex);
    } finally {
        state.isLoading = false;
    }
}


</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    margin-top: 30px;
}

.ant-form {
    width: 400px;
    padding: 24px;
    border-radius: 12px;
    background-color: rgba(255, 255, 255, 0.397);
}

.ant-form-item-label .label {
    font-weight: 600;
    font-size: 1.2em;
}

.ant-input-affix-wrapper {
    padding: 8px 8px;
    width: 100%;
}
</style>