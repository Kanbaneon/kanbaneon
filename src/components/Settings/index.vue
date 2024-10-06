<template>
    <section id="settings" class="container">
        <a-row>
            <a-col :xs="4" class="col">
                <a-menu class="menu" v-model:selectedKeys="state.selectedKeys" mode="inline" theme="light"
                    :items="items"></a-menu>
            </a-col>
            <a-col :xs="20" class="col">
                <a-card class="card">
                    <div class="card">
                        <h2>{{ activeComponent?.label }} Settings</h2>
                        <keep-alive>
                            <component :is="activeComponent.component" />
                        </keep-alive>
                    </div>
                </a-card>
            </a-col>
        </a-row>
    </section>
</template>

<script setup>
import { computed, h, reactive } from 'vue';
import { UserOutlined, BellOutlined, LockOutlined, TeamOutlined, GlobalOutlined } from "@ant-design/icons-vue";
import Account from './Account.vue';
import Notifications from './Notifications.vue';
import Password from './Password.vue';
import Teams from './Teams.vue';
import Organization from './Organization.vue';

const components = [{
    key: '1',
    icon: () => h(UserOutlined),
    label: 'Account',
    component: Account
},
{
    key: '2',
    icon: () => h(BellOutlined),
    label: 'Notifications',
    component: Notifications
},
{
    key: '3',
    icon: () => h(LockOutlined),
    label: 'Password',
    component: Password
},
{
    key: '4',
    icon: () => h(TeamOutlined),
    label: 'Teams',
    component: Teams
},
{
    key: '5',
    icon: () => h(GlobalOutlined),
    label: 'Organization',
    component: Organization
}
];

const stateItems = components.map((item) => {
    const cloned = { ...item };
    delete cloned.component
    return cloned;
})

const items = reactive([
    ...stateItems
]);

const state = reactive({
    selectedKeys: ['1']
});

const activeComponent = computed(() => {
    return components.find((item) => state.selectedKeys.includes(item.key)) || {}
})
</script>

<style scoped>
.menu {
    height: 100%;
    border-radius: 4px;
    position: fixed;
    max-width: 250px;
}

.col {
    padding-left: 10px;
    padding-right: 10px;
}

.card {
    display: flex;
    justify-content: start;
    align-items: start;
    flex-direction: column;
    margin-left: 10px;
    border-radius: 4px;
}

.card h2 {
    position: absolute;
}
</style>