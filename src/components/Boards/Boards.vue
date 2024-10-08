<template>
  <div class="container">
    <a-spin :spinning="isLoading" tip="Loading..." size="large">
      <a-row v-if="$store.state.user.isLoggedIn && boards?.length" :gutter="16">
        <a-col :xs="24" :md="6" v-if="smallScreen" class="col">
          <a-card class="add-new-btn-card" @click="visible = true">
            <a-button @click="visible = true" type="primary" size="large">
              <PlusIcon />New Board
            </a-button>
          </a-card>
        </a-col>
        <a-col class="col" :xs="24" :md="6" v-for="board in boards" v-bind:key="board.id">
          <a-card class="card" :title="board.name" @click="handleDirect(board.id)">
            <KanbanImg />
          </a-card>
        </a-col>
        <a-col :xs="24" :md="6" v-if="largeScreen" class="col">
          <a-card class="add-new-btn-card" @click="visible = true">
            <a-button @click="visible = true" class="add-new-btn" type="primary" size="large">
              <PlusIcon />New Board
            </a-button>
          </a-card>
        </a-col>
      </a-row>
      <div v-if="$store.state.user.isLoggedIn && !boards?.length && !isLoading" class="wrapper">
        <GetStartedImg />
        <a-button @click="visible = true" class="add-new-btn" type="primary" size="large">Get Started</a-button>
      </div>
    </a-spin>
  </div>
  <a-modal title="Enter the name of new board" :visible="visible" @ok="handleAddNewBoard" @cancel="handleCancelDialog">
    <a-input class="ant-input" placeholder="Name" v-model:value="name" @change="handleNameChange" />
    <label class="error-label">{{ error.name }}</label>

    <a-radio-group class="radio-wrapper" v-model:value="mode" default-value="template" @change="handleModeChange">
      <a-radio class="radio-wrapper" value="empty">
        Create empty board
      </a-radio>
      <a-radio class="radio-wrapper" value="template">
        Create with a template
      </a-radio>
    </a-radio-group>
    <template v-slot:footer>
      <a-button key="back" @click="handleCancelDialog"> Cancel </a-button>
      <a-button key="submit" type="primary" @click="handleAddNewBoard">
        Confirm
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import PlusIcon from "../../assets/PlusIcon.vue";
import KanbanImg from "../../assets/KanbanImg.vue";
import GetStartedImg from "../../assets/GetStartedImg.vue";
import * as uuid from "uuid";
import { addBoard, getBoards } from "../../helpers/ApiHelper";

const getTemplateList = () => [
  {
    id: uuid.v4(),
    name: "To-Do",
    children: [],
  },
  {
    id: uuid.v4(),
    name: "Doing",
    children: [],
  },
  {
    id: uuid.v4(),
    name: "Done",
    children: [],
  },
];

export default {
  data() {
    return {
      isLite: import.meta.env.VITE_LITE_VERSION === "ON",
      isLoading: false,
      boards: [],
      visible: false,
      mode: "template",
      smallScreen: window.matchMedia("(max-width:456px)").matches,
      largeScreen: window.matchMedia("(min-width:456px)").matches,
      name: "",
      error: {
        name: "",
      },
    };
  },
  watch: {
    "$store.state.user": function () {
      this.boards = this.$store.getters.currentBoards;
    },
    "$store.state.kanbanBoards": function () {
      this.boards = this.$store.getters.currentBoards;
    },
  },
  components: {
    KanbanImg,
    GetStartedImg,
    PlusIcon,
  },
  async mounted() {
    await this.refresh();
  },
  methods: {
    async refresh() {
      if (this.isLite) {
        return this.boards = this.$store.getters.currentBoards;
      }
      try {
        this.isLoading = true;
        const { boards } = await getBoards();
        this.boards = boards ?? this.$store.getters.currentBoards;
      } catch (ex) {
        console.error(ex);
      } finally {
        this.isLoading = false;
      }
    },
    handleModeChange(e) {
      this.mode = e.target.value;
    },
    handleDirect(id) {
      this.$router.push(`/boards/${id}`);
    },
    handleNameChange(e) {
      this.name = e.target.value;
      this.error.name = !this.name ? "*required" : "";
    },
    handleCancelDialog() {
      this.name = "";
      this.visible = false;
      this.error.name = "";
    },
    async handleAddNewBoard() {
      if (!this.name) {
        return (this.error.name = !this.name ? "*required" : "");
      }

      const newBoard = {
        id: uuid.v4(),
        name: this.name,
        kanbanList: this.mode === "template" ? getTemplateList() : [],
      };

      if (this.isLite) {
        this.$store.commit("addKanbanBoard", newBoard);
      } else {
        await addBoard(newBoard);
      }
      this.handleCancelDialog();
      await this.refresh();
    },
  },
};
</script>

<style scoped>
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
  height: 80vh;
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
</style>
