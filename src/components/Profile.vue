<template>
    <section class="container">
        <a-spin :spinning="state.isLoading" tip="Loading..." size="large">
            <a-form ref="formRef" :model="state.formState" layout="vertical">
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

                <a-form-item :name="['email']" :rules="[{ required: true, message: 'Email is required.' },
                { type: 'email', message: 'This is not a valid email.' }]">
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
                    <a-input v-model:value="state.formState.details.occupation" placeholder="Enter your occupation">
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
                    <a-input v-model:value="state.formState.details.teams" placeholder="Enter your teams">
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
                    <a-input v-model:value="state.formState.details.organization" placeholder="Enter your organization">
                        <template #prefix>
                            <GlobalOutlined class="site-form-item-icon" />
                        </template>
                    </a-input>
                </a-form-item>

                <a-form-item>
                    <template #label>
                        <label class="label">
                            Location
                        </label>
                    </template>
                    <a-input v-model:value="state.formState.details.location" placeholder="Enter your location">
                        <template #prefix>
                            <HomeOutlined class="site-form-item-icon" />
                        </template>
                    </a-input>
                </a-form-item>

                <input type="submit" hidden />
                <a-button :disabled="state.isLoading" type="primary" size="large" block
                    @click="isLite ? saveProfile($event) : saveProfileApi($event)">
                    <a-spin v-if="state.isLoading" />
                    {{ state.isLoading ? "Loading..." : "Save Profile" }}</a-button>
            </a-form>
        </a-spin>
    </section>
</template>

<script setup>
import {
    UserOutlined, MailOutlined, IdcardOutlined,
    GlobalOutlined, TeamOutlined, HomeOutlined
} from "@ant-design/icons-vue";
import { onMounted, reactive } from "vue";
import { useStore } from "vuex";
import { editProfile, getProfile } from "../helpers/ApiHelper";

const isLite = import.meta.env.VITE_LITE_VERSION === "ON";

const $store = useStore();

const state = reactive({
    isLoading: false,
    formState: {
        username: $store?.state?.user?.username,
        name: $store?.state?.user?.name,
        email: $store?.state?.user?.email,
        details: {
            occupation: $store?.state?.user?.details?.occupation,
            teams: $store?.state?.user?.details?.teams,
            organization: $store?.state?.user?.details?.organization,
            location: $store?.state?.user?.details?.location
        }
    },
    isLoading: false
});

onMounted(async () => {
    try {
        state.isLoading = true;
        const response = await getProfile();
        state.formState = {
            ...state.formState,
            ...response.user
        };
    } catch (ex) {
        console.error(ex);
    } finally {
        state.isLoading = false;
    }
})

const saveProfileApi = async () => {
    try {
        state.isLoading = true;
        const response = await editProfile({
            name: state.formState.name, email: state.formState.email,
            details: {
                occupation: state.formState.occupation,
                teams: state.formState.teams,
                organization: state.formState.organization,
                location: state.formState.location
            }
        });
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
}

.ant-form {
    width: 1000px;
    padding: 48px 120px;
    margin-top: 10px;
    border-radius: 12px;
    background-color: rgba(255, 255, 255, 1);
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