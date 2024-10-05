<template>
    <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" :items="items" mode="inline" theme="light"
        @click="handleClick">
    </a-menu>
</template>

<script setup>
import { h, ref } from 'vue';
import { UserOutlined, BorderInnerOutlined, TeamOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';

const selectedKeys = ref([]);
const openKeys = ref([]);
const isLite = import.meta.env.VITE_LITE_VERSION === "ON";

const items = ref(!isLite ? [
    {
        key: 1,
        icon: () => h(UserOutlined),
        label: 'Your profile',
        route: '/profile'
    },
    {
        key: 2,
        icon: () => h(BorderInnerOutlined),
        label: 'Your boards',
        route: '/boards'
    },
    {
        key: 3,
        icon: () => h(TeamOutlined),
        label: 'Your teams',
        route: '/teams'
    },
    {
        key: 4,
        icon: () => h(SettingOutlined),
        label: 'Settings',
        route: '/settings'
    },
] : null);

const router = useRouter();

const handleClick = (value) => {
    const item = value?.item;
    router.push({ path: item?.route });
}

</script>

<style lang="css" scoped>
.ant-menu-item-active {
    background-color: #42b8839c;
}
</style>