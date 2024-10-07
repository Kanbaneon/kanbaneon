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
            <div v-if="!notificationFormState?.watchlists?.length">
              <WatchlistImg />
              <p>You do not have any watchlist. You may watch the activities on the boards that you have access.</p>
            </div>
            <div class="watchlists" v-else>
              <a-table :columns="watchListColumns" :data-source="watchListData" :pagination="state.pagination"
                :style="{ height: '250px' }">
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'item'">
                    <p v-if="record.item.isWatching">
                      You are watching a card titled <b class="tooltip"
                        v-if="record.item.cardName.length > 12"><a-tooltip :title="record.item.cardName">
                          {{ constructLabel(record.item.cardName) }}
                        </a-tooltip></b>
                      <b v-else>
                        {{ record.item.cardName }}
                      </b> of <b class="tooltip" v-if="record.item.listName.length > 12"><a-tooltip
                          :title="record.item.listName">
                          {{ constructLabel(record.item.listName) }}
                        </a-tooltip></b>
                      <b v-else>
                        {{ record.item.listName }}
                      </b> list on the board named <b class="tooltip"
                        v-if="record.item.boardName.length > 12"><a-tooltip :title="record.item.boardName">
                          {{ constructLabel(record.item.boardName) }}
                        </a-tooltip></b>
                      <b v-else>
                        {{ record.item.boardName }}
                      </b>
                    </p>
                    <p v-else>
                      You have unwatched a card titled <b class="role"
                        v-if="record.item.cardName.length > 12"><a-tooltip :title="record.item.cardName">
                          {{ constructLabel(record.item.cardName) }}
                        </a-tooltip></b>
                      <b v-else>
                        {{ record.item.cardName }}
                      </b> of <b class="role" v-if="record.item.listName.length > 12"><a-tooltip
                          :title="record.item.listName">
                          {{ constructLabel(record.item.listName) }}
                        </a-tooltip></b>
                      <b v-else>
                        {{ record.item.listName }}
                      </b> list on the board named <b class="role" v-if="record.item.boardName.length > 12"><a-tooltip
                          :title="record.item.boardName">
                          {{ constructLabel(record.item.boardName) }}
                        </a-tooltip></b>
                      <b v-else>
                        {{ record.item.boardName }}
                      </b>
                    </p>
                  </template>
                  <template v-if="column.key === 'actions'">
                    <a-space wrap>
                      <a-space v-if="!record.item.isDeleted" wrap>
                        <router-link :to="{ path: `/boards/${record.item.boardId}` }"><a-button
                            :icon="h(ExportOutlined)">View board</a-button></router-link>
                        <a-button v-if="record.item.isWatching" primary :icon="h(EyeInvisibleOutlined)"
                          @click="handleUnwatchWatchListItem(record.item.id)">Unwatch {{
                            record.item.type }}</a-button>
                        <a-button v-else primary :icon="h(EyeOutlined)"
                          @click="handleWatchWatchListItem(record.item.id)">Watch {{
                            record.item.type }}</a-button>
                      </a-space>
                      <a-space v-else>
                        Marked as deleted
                      </a-space>
                      <a-space wrap>
                        <a-button v-if="!record.item.isDeleted" danger
                          @click="handleDeleteWatchListItem(record.item.id)">Delete</a-button>
                        <a-button v-else danger @click="handleUndoDeleteWatchListItem(record.item.id)">Undo</a-button>
                      </a-space>
                    </a-space>
                  </template>
                </template>
              </a-table>
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
import { computed, onBeforeMount, reactive, ref, h } from 'vue';
import WatchlistImg from "../../assets/Watchlist.vue";
import { ExportOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons-vue";
import { editNotification, getNotification } from '../../helpers/ApiHelper';
import { message } from 'ant-design-vue';

const watchListColumns = [
  {
    title: 'Items',
    dataIndex: 'item',
    key: 'item',
    width: '65%',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    width: '35%',
  },
];

const state = reactive({
  isLoading: false,
  isDeleting: false,
  details: [],
  pagination: {
    pageSize: 3
  }
})

const notificationFormState = reactive({
  newsletter: false,
  watchlists: []
});

function constructLabel(label) {
  if (label?.length > 12) {
    return `${label.slice(0, 12)}...`
  }
  return label;
}

const notificationFormRef = ref("notificationFormRef");
const watchListData = computed(() => {
  const messages = notificationFormState.watchlists.map((item) => {
    const board = state.details.find(board => board.id === item.boardId) || {};
    const list = Array.isArray(board?.kanbanList) ? board?.kanbanList.find(list => list.id === item.listId) : {};
    const card = Array.isArray(list?.children) ? list?.children.find(card => card.id === item.cardId) : {};
    return {
      item: {
        ...item,
        boardName: board?.name || "",
        boardId: board?.id,
        listName: list?.name || "",
        cardName: card?.title || "",
        isNotFound: !card || !list || !board
      }
    }
  });
  const filteredMessages = messages.filter(message => !message.item.isNotFound);
  return filteredMessages;
})

onBeforeMount(async () => {
  state.isLoading = true;
  try {
    const result = await getNotification();
    if (result.success) {
      notificationFormState.newsletter = result.notification.newsletter;
      notificationFormState.watchlists = result.notification.watchlists;
      state.details = result.details;
    }
  } catch (ex) {
    console.error(ex);
  }
  finally {
    state.isLoading = false;
  }
})

const handleDeleteWatchListItem = (id) => {
  const watchlistItem = notificationFormState.watchlists.find(item => item.id === id);
  watchlistItem.isDeleted = true;
  message.info("You have marked this item to be deleted. Remember to save the settings.")
}

const handleUndoDeleteWatchListItem = (id) => {
  const watchlistItem = notificationFormState.watchlists.find(item => item.id === id);
  delete watchlistItem.isDeleted;
  message.info("You have undone this item to be deleted. Remember to save the settings.")
}

const handleUnwatchWatchListItem = (id) => {
  const watchlistItem = notificationFormState.watchlists.find(item => item.id === id);
  watchlistItem.isWatching = false;
  message.info("You have marked this item to be unwatched. Remember to save the settings.")
}

const handleWatchWatchListItem = (id) => {
  const watchlistItem = notificationFormState.watchlists.find(item => item.id === id);
  watchlistItem.isWatching = true;
  message.info("You have marked this item to be watched. Remember to save the settings.")
}

const submitNotificationSettings = async (e) => {
  state.isLoading = true;
  try {
    await notificationFormRef.value.validateFields();
    const result = await editNotification(notificationFormState);
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
  width: 1100px;
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
  margin-top: 40px;
}

.watchlists {
  height: 37vh;
}

.custom-input {
  margin-bottom: 12px;
}

.ant-table {
  height: 500px;
}

.tooltip {
  border-bottom: 1px dotted black;
  cursor: pointer;
}
</style>