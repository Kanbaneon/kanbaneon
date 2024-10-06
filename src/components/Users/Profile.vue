<template>
    <section class="container">
        <a-spin :spinning="state.isLoading" tip="Loading..." size="large">
            <a-row class="form">
                <a-col :span="20">
                    <a-form ref="formRef" :model="state.formState" layout="vertical">
                        <a-form-item>
                            <template #label>
                                <label class="label">
                                    Username
                                </label>
                            </template>
                            <a-input v-model:value="state.formState.username" placeholder="Enter your username"
                                disabled>
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
                            <a-input v-model:value="state.formState.details.occupation"
                                placeholder="Enter your occupation">
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
                            <a-input v-model:value="state.formState.details.organization"
                                placeholder="Enter your organization">
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
                        <a-button :disabled="state.isLoading || state.isLoadingProfile" type="primary" size="large"
                            block @click="isLite ? saveProfile($event) : saveProfileApi($event)">
                            <a-spin v-if="state.isLoading" />
                            {{ state.isLoading || state.isLoadingProfile ? "Loading..." : "Save Profile" }}</a-button>
                    </a-form>
                </a-col>
                <a-col :span="4" class="avatar-form">
                    <label class="form-item-label">
                        Profile Picture
                    </label>
                    <a-popover trigger="click" placement="bottom" v-model:open="popoverRef">
                        <template #content>
                            <a-flex vertical>
                                <input type="file" hidden ref="fileRef" accept="image/*" @change="handleFileChange" />
                                <a-button @click="handleUpload">Upload photo</a-button>
                                <a-button @click="handleRemovePhoto">Remove photo</a-button>
                            </a-flex>
                        </template>
                        <div role="button">
                            <div class="avatar">
                                <p class="avatar-loading" v-if="state.isLoadingProfile">Uploading...</p>
                                <img v-else-if="state.formState.details?.profilePicture?.link"
                                    :src="state.formState.details?.profilePicture?.link" />
                                <UserIcon v-else />
                            </div>
                            <div class="edit-button-wrapper">
                                <a-button :icon="h(EditOutlined)">Edit</a-button>
                            </div>
                        </div>
                    </a-popover>
                </a-col>
            </a-row>
        </a-spin>
    </section>
</template>

<script setup>
import {
    UserOutlined, MailOutlined, IdcardOutlined,
    GlobalOutlined, TeamOutlined, HomeOutlined,
    EditOutlined
} from "@ant-design/icons-vue";
import { onMounted, reactive, h, ref } from "vue";
import UserIcon from "../../assets/UserIcon.vue";
import { useStore } from "vuex";
import { editProfile, getProfile, uploadProfilePicture, deleteProfilePicture } from "../../helpers/ApiHelper";
import { v4 } from "uuid";

const isLite = import.meta.env.VITE_LITE_VERSION === "ON";

const $store = useStore();

const state = reactive({
    isLoading: false,
    isLoadingProfile: false,
    formState: {
        username: $store?.state?.profile?.username,
        name: $store?.state?.profile?.name,
        email: $store?.state?.profile?.email,
        details: {
            occupation: $store?.state?.profile?.details?.occupation,
            teams: $store?.state?.profile?.details?.teams,
            organization: $store?.state?.profile?.details?.organization,
            location: $store?.state?.profile?.details?.location,
            profilePicture: $store?.state?.profile?.details?.profilePicture,
        }
    },
    isLoading: false
});

const fileRef = ref('fileRef');
const popoverRef = ref(false);

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

const handleUpload = () => {
    fileRef.value.click();
}

const handleRemovePhoto = async () => {
    state.isLoadingProfile = true;
    try {
        popoverRef.value = false;
        const response = await deleteProfilePicture();
        if (response.success) {
            $store.commit("setProfile");
            state.formState.details.profilePicture = response.details.profilePicture;
        }
    } catch (ex) {
        console.error(ex);
    } finally {
        state.isLoadingProfile = false;
    }
}

const handleFileChange = async () => {
    state.isLoadingProfile = true;
    try {
        popoverRef.value = false;
        const form = new FormData();
        const file = fileRef.value.files[0];
        const fileName = `${$store?.state?.profile?.username}-profile-picture-${v4()}`;
        form.append("image", file);
        form.set("name", fileName);
        const response = await uploadProfilePicture(form);
        if (response.success) {
            $store.commit("setProfile");
            state.formState.details.profilePicture = response.details.profilePicture;
        }
    } catch (ex) {
        console.error(ex);
    } finally {
        state.isLoadingProfile = false;
    }
}

const saveProfileApi = async (injectionData) => {
    try {
        state.isLoading = true;
        const response = await editProfile({
            name: state.formState.name, email: state.formState.email,
            details: {
                ...state.formState.details,
                ...injectionData
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

.form {
    padding: 48px 80px;
    margin-top: 10px;
    border-radius: 12px;
    background-color: rgba(255, 255, 255, 1);
    width: 1000px;
}

.form-item-label {
    position: absolute;
    font-weight: 600;
    font-size: 1.2em;
    margin-top: -24px;
    margin-left: -24px;
}

.ant-form {
    width: 600px;
}

.avatar-form {
    margin-top: 10px;
    padding: 24px;
    width: 400px;
    margin-left: -48px;
}

.edit-button-wrapper {
    margin-top: -38px;
    margin-left: -12px;
}

.ant-form-item-label .label {
    font-weight: 600;
    font-size: 1.2em;
}

.ant-input-affix-wrapper {
    padding: 8px 8px;
    width: 100%;
}

.avatar {
    width: 200px;
    height: 200px
}

.avatar-loading {
    color: white;
    font-weight: 600;
}

input[type="file"] {
    visibility: hidden;
}
</style>