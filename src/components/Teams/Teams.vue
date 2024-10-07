<template>
  <div class="container">
    <a-spin :spinning="state.isLoading" tip="Loading..." size="large">
      <a-row v-if="state.teams?.length" :gutter="16">
        <a-col :xs="24" :md="6" class="col">
          <a-card class="add-new-btn-card" @click="handleCreateNewTeam">
            <a-button @click="visible = true" type="primary" size="large">
              <PlusIcon />New Team
            </a-button>
          </a-card>
        </a-col>
        <a-col
          class="col"
          :xs="24"
          :md="6"
          v-for="team in state.teams"
          v-bind:key="team.id"
        >
          <a-card
            class="card"
            :title="team.name"
            @click="handleDirect(team.id)"
          >
            <TeamImg />
          </a-card>
        </a-col>
      </a-row>
      <div v-if="!boards?.length && !isLoading" class="wrapper">
        <CreateTeamImg />
        <a-button
          @click="handleCreateNewTeam"
          class="add-new-btn"
          type="primary"
          size="large"
          >Create Team</a-button
        >
      </div>
    </a-spin>
  </div>
  <a-modal
    style="top: 20px"
    title="Enter the details of new team"
    :visible="state.visible"
    @ok="handleAddNewTeam"
    @cancel="handleCancelDialog"
  >
    <a-form layout="vertical" :model="state.teamForm">
      <a-form-item label="Name">
        <a-input
          class="ant-input"
          placeholder="Name"
          v-model:value="state.teamForm.name"
        />
      </a-form-item>
      <a-form-item label="Description">
        <a-textarea
          class="ant-input"
          placeholder="Description"
          v-model:value="state.teamForm.description"
          :rows="8"
        />
      </a-form-item>
      <a-modal :visible="state.searchedUsers.length" :closable="false">
        <div class="search-list" v-if="state.searchedUsers.length">
          <p>Searched results</p>
          <a-list
            size="small"
            bordered
            item-layout="horizontal"
            :data-source="state.searchedUsers"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <router-link
                  target="_blank"
                  :to="{
                    path: 'profile',
                    params: { username: item.username },
                  }"
                  >{{ item.username }}</router-link
                >

                <a-avatar
                  class="mini-avatar"
                  v-if="item?.details?.profilePicture?.link"
                  :src="item?.details?.profilePicture?.link"
                />
                <div v-else class="mini-avatar">
                  <UserIcon />
                </div>
                <a-button
                  v-if="
                    !state.teamForm.members
                      .map((member) => member.username)
                      .includes(item.username)
                  "
                  @click="handleAddMember(item)"
                  >Add as member</a-button
                >
                <a-button
                  danger
                  v-else
                  @click="handleRemoveMember(item.username)"
                >
                  Remove
                </a-button>
              </a-list-item>
            </template>
          </a-list>
        </div>
        <template v-slot:footer>
          <a-button key="back" @click="state.searchedUsers = []">
            Discard
          </a-button>
          <a-button
            type="primary"
            key="submit"
            @click="state.searchedUsers = []"
          >
            Done
          </a-button>
        </template>
      </a-modal>
      <a-form-item label="Members">
        <a-form layout="inline">
          <a-input
            class="ant-input"
            placeholder="Search by username"
            v-model:value="state.searchText"
          />
          <a-button @click="handleSearchMembers">Search</a-button>
        </a-form>
        <div class="members">
          <a-list
            size="small"
            bordered
            item-layout="horizontal"
            :data-source="state.teamForm.members"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <router-link
                  target="_blank"
                  :to="{
                    path: 'profile',
                    params: { username: item.username },
                  }"
                  >{{ item.username }}</router-link
                >

                <a-avatar
                  class="mini-avatar"
                  v-if="item?.details?.profilePicture?.link"
                  :src="item?.details?.profilePicture?.link"
                />
                <div v-else class="mini-avatar">
                  <UserIcon />
                </div>
                <a-button danger @click="handleRemoveMember(item.username)">
                  Remove
                </a-button>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </a-form-item>
    </a-form>

    <template v-slot:footer>
      <a-button key="back" @click="handleCancelDialog"> Cancel </a-button>
      <a-button key="submit" type="primary" @click="handleAddNewBoard">
        Confirm
      </a-button>
    </template>
  </a-modal>
</template>

<script setup>
import { reactive } from "vue";
import TeamImg from "../../assets/Team.vue";
import CreateTeamImg from "../../assets/CreateTeam.vue";
import { searchProfiles } from "../../helpers/ApiHelper";
import { message } from "ant-design-vue";
import UserIcon from "../../assets/UserIcon.vue";
import { store } from "../../store";

const state = reactive({
  isLoading: false,
  teams: [],
  visible: false,
  searchText: "",
  searchedUsers: [],
  teamForm: {
    name: "",
    description: "",
    members: [],
  },
});

const handleDirect = () => {};

const handleCreateNewTeam = () => {
  state.visible = true;
};

const handleAddMember = (member) => {
  state.teamForm.members.push(member);
};

const handleRemoveMember = (username) => {
  state.teamForm.members = state.teamForm.members.filter(
    (member) => member.username !== username
  );
};
const handleAddNewTeam = () => {};

const handleCancelDialog = () => {
  state.visible = false;
};

const handleSearchMembers = async () => {
  try {
    const result = await searchProfiles(state.searchText);
    if (result.success) {
      state.searchedUsers = result.users.filter(
        (user) => user.username !== store.state.user.username
      );
    } else {
      message.error("There are no users like the username you have search.");
    }
  } catch (ex) {
    console.error(ex);
  }
};
</script>

<style scoped>
.ant-form-inline {
  flex-direction: row;
}

.ant-form-inline .ant-input {
  width: 82%;
  margin-right: 10px;
}

.radio-wrapper {
  display: block;
  margin-top: 10px;
}

.col {
  padding-bottom: 16px;
}

.add-new-btn-card {
  height: 307px;
  border: 2px dashed rgb(219, 219, 219);
  background: rgba(73, 73, 73, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;
}

.add-new-btn {
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 18px;
  font-weight: 500;
  height: 46px;
  padding: 20px;
}

.container {
  padding: 16px;
  min-height: 70vh;
  margin-top: 140px;
  background: #42b883;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 70vh;
}

.card {
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.search-list {
  width: 450px;
  height: 500px;
  overflow-y: auto;
}

.search-list p {
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: 600;
}

.ant-list-item .mini-avatar {
  position: absolute;
  right: 300px;
}

.ant-list-item button {
  position: absolute;
  right: 4px;
}

.members {
  margin-top: 10px;
  height: 160px;
  overflow: auto;
}
</style>
