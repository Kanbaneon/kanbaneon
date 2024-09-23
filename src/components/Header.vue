<template>
  <div class="header">
    <div class="row-container">

      <a-row class="header-body">
        <a-col class="icon-container" :md="showNewList ? 14 : 18" :xl="showNewList ? 18 : 21"
          :xxl="showNewList ? 18 : 22">
          <h2 class="title" @click="handleDirectHome">
            KAN<span class="subtitle">BANEON</span>
          </h2>
        </a-col>
        <a-col :xl="3" :md="5" :xxl="2" v-if="showNewList && largeScreen"></a-col>
        <a-col :span="1" class="icon-btn-wrapper">
          <div class="icon-btn" v-if="showNewList" shape="round"
            @click="largeScreen ? (visibleEditBoard = true) : (popupMenu = true)">
            <DotsIcon />
          </div>
        </a-col>
        <a-col :span="1" v-if="$store.state.user.isLoggedIn">
          <a-popover :title="$store.state.user.username" trigger="click">
            <template #content>
              <user-menu />
              <p><a-button block @click="logout">Logout</a-button></p>
            </template>
            <div class="avatar" :size="64">
              <img v-if="$store.state.profile.details.profilePicture.link"
                :src="$store.state.profile.details.profilePicture.link" />
              <UserIcon v-else />
            </div>
          </a-popover>
        </a-col>
      </a-row>

      <a-row class="header-breadcrumb">
        <h3>
          <a-breadcrumb>
            <a-breadcrumb-item><a href="/">Home</a></a-breadcrumb-item>
            <a-breadcrumb-item :key="$route.path">{{ $route.name }}</a-breadcrumb-item>
            <a-breadcrumb-item v-if="currentBoard?.name" :key="currentBoard?.name">
              {{ currentBoard?.name
              }}</a-breadcrumb-item>
          </a-breadcrumb>
        </h3>
      </a-row>
    </div>
  </div>
  <a-modal title="Enter the name of new list" :visible="visible" @ok="handleOk" @cancel="handleCancel">
    <a-input class="ant-input" placeholder="Name" v-model="name" @change="handleNameChange" />
    <label class="error-label">{{ error.name }}</label>
    <template v-slot:footer>
      <a-button key="back" @click="handleCancel"> Cancel </a-button>
      <a-button key="submit" type="primary" @click="handleOk">
        Confirm
      </a-button>
    </template>
  </a-modal>
  <a-modal title="Edit board" :visible="visibleEditBoard" @ok="handleOkEditBoard" @cancel="handleCancelEditBoard">
    <a-input class="ant-input" placeholder="Name" v-model="boardDialog.editingBoard.name"
      @change="handleBoardNameChange" />
    <label class="error-label">{{ boardDialog.error.name }}</label>
    <template v-slot:footer>
      <a-button class="btn-danger" type="danger" @click="handleDeleteBoard">Delete</a-button>
      <a-button key="back" @click="handleCancelEditBoard"> Cancel </a-button>
      <a-button key="submit" type="primary" @click="handleOkEditBoard">
        Confirm
      </a-button>
    </template>
  </a-modal>
  <a-modal title="Save & Exit" :visible="visibleSave" @ok="handleOk" @cancel="handleCancelSave">
    <p>Do you want to save this board and go back to home page?</p>
    <template v-slot:footer>
      <a-button key="back" @click="handleCancelSave"> Cancel </a-button>
      <a-button key="submit" type="primary" @click="handleSaveData">
        Confirm
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import PlusIcon from "../assets/PlusIcon.vue";
import DotsIcon from "../assets/DotsIcon.vue";
import UserIcon from "../assets/UserIcon.vue";
import UserMenu from "./UserMenu.vue";
import { addListOnCanvas } from "../utils/DrawCanvas";
import { deleteBoard, getBoard } from "../helpers/ApiHelper";

export default {
  data() {
    return {
      isLite: import.meta.env.VITE_LITE_VERSION === "ON",
      smallScreen: window.matchMedia("(max-width:456px)").matches,
      largeScreen: window.matchMedia("(min-width:456px)").matches,
      showNewList: this.$route.matched?.[0]?.path === "/board/:id",
      visible: false,
      visibleSave: false,
      visibleEditBoard: false,
      name: "",
      error: {
        name: "",
      },
      currentBoard: {},
      boardDialog: {
        editingBoard: {
          name: "",
        },
        error: {
          name: "",
        },
      },
    };
  },
  components: {
    PlusIcon,
    UserIcon,
    DotsIcon,
    UserMenu
  },
  watch: {
    async $route(to, from) {
      await this.handleCheckRoute();
    },
  },
  mounted() {
    this.handleCheckRoute();
  },
  methods: {
    openModalSave() {
      this.visibleSave = true;
    },
    openModal() {
      this.visible = true;
    },
    async logout() {
      this.$store.commit("setUser", {
        isLoggedIn: false,
        username: "",
        id: undefined,
      });
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
    async handleSaveData() {
      this.visibleSave = false;
      this.$router.push("/");
    },
    handleDirectHome() {
      this.currentBoard = {};
      this.$router.push("/");
    },
    async handleOkEditBoard() {
      this.currentBoard.name = this.boardDialog.editingBoard.name;
      this.$store.commit("editKanbanBoard", this.boardDialog.editingBoard);
      this.handleCancelEditBoard();
    },
    async handleDeleteBoard() {
      await deleteBoard(this.$store.getters.currentBoardID);
      this.currentBoard.name = null;
      await this.$store.commit("setCurrentBoardID", null);
      this.$router.push("/");
      this.handleCancelEditBoard();
    },
    handleOk() {
      if (!this.name) {
        return (this.error.name = !this.name ? "*required" : "");
      }

      const addingList = { name: this.name };
      addListOnCanvas(addingList);
      this.handleCancel();
    },
    handleNameChange(e) {
      this.name = e.target.value;
      this.error.name = !this.name ? "*required" : "";
    },
    handleBoardNameChange(e) {
      this.boardDialog.editingBoard.name = e.target.value;
      this.boardDialog.error.name = !this.boardDialog.editingBoard.name
        ? "*required"
        : "";
    },
    handleCancelSave() {
      this.visibleSave = false;
    },
    handleCancelEditBoard() {
      this.visibleEditBoard = false;
      this.boardDialog = {
        editingBoard: {
          name: this.currentBoard.name,
        },
        error: {
          name: "",
        },
      };
    },
    handleCancel() {
      this.name = "";
      this.error.name = "";
      this.visible = false;
    },
    async handleCheckRoute() {
      if (this.$route.matched?.[0]?.path === "/board/:id") {
        this.showNewList = true;
        this.$store.commit("setCurrentBoardID", this.$route?.params?.id);
        let result;
        if (!this.isLite) {
          result = await getBoard(this.$route?.params?.id)
        }
        this.currentBoard = this.isLite ? (this.$store.getters.currentBoards ?? []).find(
          (v) => v.id === this.$store.state.currentBoardID
        ) : result.board;

        this.boardDialog.editingBoard = {
          name: this.currentBoard?.name,
        };
      } else {
        this.showNewList = false;
        this.$store.commit("setCurrentBoardID", null);
      }
    },
  },
};
</script>

<style scoped>
h3 {
  padding-left: 8px;
  margin: 0px;
}

.icon-btn-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-btn {
  border-radius: 50%;
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #f0f0f0;
  cursor: pointer;
}

.icon-btn:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.title {
  display: inline;
  font-size: 32px;
  font-weight: bold;
  color: #42b883;

  cursor: pointer;
  margin-top: 16px;
  margin-left: 16px;
}

.subtitle {
  color: #35495e;
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

.btn-danger {
  background: #ef180c;
  color: white;
}
</style>

<style>
.container {
  margin-top: 140px;
}
</style>

<style scoped>
.header {
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 10;
  background: transparent;
}

.header-body {
  background: white;
  padding: 20px;
  border-radius: 1px solid whitesmoke;
}

.header-breadcrumb {
  background: #42b883;
  padding: 4px;
}

.row-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.icon-container {
  display: flex;
  align-items: center;
}

.ant-popover {
  position: fixed;
}

.ant-card-body {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.ant-breadcrumb,
.ant-breadcrumb a {
  color: whitesmoke;
  font-size: 20px;
  transition: color 0.3s;
}

.ant-breadcrumb a:hover {
  color: rgb(13, 68, 63);
  font-size: 20px;
  transition: color 0.3s;
}
</style>
