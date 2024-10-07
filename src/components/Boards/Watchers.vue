<template>
    <a-list size="small" borded item-layout="horizontal" :data-source="props.watchers">
        <template #renderItem="{ item }">
            <a-list-item>
                <router-link target="_blank" :to="{ path: 'profile', params: { username: item.username } }">{{
                    item.username }}</router-link>

                <a-avatar v-if="item?.details?.profilePicture?.link" :src="item?.details?.profilePicture?.link" />
                <div class="mini-avatar">
                    <UserIcon />
                </div>
            </a-list-item>
        </template>
        <template #header>
            <a-list-item>
                Watchers
            </a-list-item>
        </template>
    </a-list>
</template>

<script setup>
import { defineProps } from 'vue';
import UserIcon from '../../assets/UserIcon.vue';

const props = defineProps(["watchers"]);
</script>

<style scoped>
.ant-list-item {
    padding: 4px;
}
</style>