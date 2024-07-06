<template>
  <div class="canvas-wrapper">
    <div id="kanbaneon-canvas"></div>
  </div>
  <div v-if="isLoading" class="loading-wrapper">
    <div>Loading....</div>
  </div>
  <a-modal title="Enter the message of new item" :visible="visible" @ok="handleOk" @cancel="handleCancel">
    <textarea rows="8" class="ant-input" placeholder="Type here..." v-model="message" />
    <template v-slot:footer>
      <a-button key="back" @click="handleCancel"> Cancel </a-button>
      <a-button key="submit" type="primary" @click="handleOk">
        Confirm
      </a-button>
    </template>
  </a-modal>
  <a-modal :title="listDialog.title" :visible="listDialog.visible" @ok="handleOkListDialog"
    @cancel="handleCancelListDialog">
    <input class="ant-input" placeholder="Name" v-model="listDialog.editingList.name" @change="handleNameChange" />
    <label class="error-label">{{ listDialog.error.name }}</label>
    <template v-slot:footer>
      <a-button v-if="!listDialog.creating" class="btn-danger" type="danger" @click="handleDeleteList">Delete</a-button>
      <a-button key="back" @click="handleCancelListDialog"> Cancel </a-button>
      <a-button key="submit" type="primary" @click="handleOkListDialog">
        Confirm
      </a-button>
    </template>
  </a-modal>
  <a-modal :title="cardDialog.title" :visible="cardDialog.visible" @ok="handleOkCardDialog"
    @cancel="handleCancelCardDialog">
    <textarea class="ant-input edit-card-textarea" placeholder="Type here..." v-model="cardDialog.editingCard.text" />
    <template v-slot:footer>
      <a-button class="btn-danger" type="danger" @click="handleDeleteCard">Delete</a-button>
      <a-button key="back" @click="handleCancelCardDialog"> Cancel </a-button>
      <a-button key="submit" type="primary" @click="handleOkCardDialog">
        Confirm
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import {
  initCanvas,
  addMoreCard,
  addMoreList,
  editCard,
  deleteCard,
  editList,
  deleteList,
} from "../utils/DrawCanvas";
import { initList } from "../utils/DrawList";
import { initListItem } from "../utils/DrawListItem";
import getAddButton from "../utils/DrawAddButton";
import getAddText from "../utils/DrawAddText";
import getCard from "../utils/DrawCard";
import getTile from "../utils/DrawTile";
import getText from "../utils/DrawText";
import { getBoard } from '../helpers/ApiHelper';

export default {
  data() {
    return {
      isLite: import.meta.env.VITE_LITE_VERSION === "ON",
      isLoading: false,
      visible: false,
      message: "",
      addingList: null,
      cardDialog: {
        editingCard: {
          text: "",
        },
      },
      listDialog: {
        editingList: {
          name: "",
        },
        error: {
          name: "",
        },
      },
    };
  },
  methods: {
    drawFns() {
      return {
        initCanvas: initCanvas.bind(this),
        initList: initList.bind(this),
        initListItem: initListItem.bind(this),
        getAddButton: getAddButton.bind(this),
        getAddText: getAddText.bind(this),
        getCard: getCard.bind(this),
        getTile: getTile.bind(this),
        getText: getText.bind(this),
      };
    },
    addMoreCard,
    addMoreList,
    editCard,
    deleteCard,
    editList,
    deleteList,
    handleCancel() {
      this.visible = false;
      this.message = "";
    },
    handleCancelCardDialog() {
      this.cardDialog = {
        ...this.cardDialog,
        visible: false,
        editingCard: {
          text: "",
        },
      };
    },
    handleCancelListDialog() {
      this.listDialog = {
        ...this.listDialog,
        visible: false,
        editingList: {
          name: "",
        },
        error: {
          name: "",
        },
      };
    },
    handleOk() {
      const newCard = { listId: this.addingList?.id, text: this.message };
      this.addMoreCard(newCard);
      this.handleCancel();
    },
    handleOkCardDialog() {
      const editingCard = {
        id: this.cardDialog.editingCard.id,
        listId: this.cardDialog.editingCard.parentList.id,
        text: this.cardDialog.editingCard.text,
      };
      this.editCard(editingCard);
      this.handleCancelCardDialog();
    },
    handleOkListDialog() {
      if (!!this.listDialog?.creating) {
        const newList = {
          name: this.listDialog.editingList.name,
        };
        this.addMoreList(newList);
        return this.handleCancelListDialog();
      }

      const editingList = {
        listId: this.listDialog.editingList.id,
        name: this.listDialog.editingList.name,
      };
      this.editList(editingList);
      this.handleCancelListDialog();
    },
    handleDeleteList() {
      const deletingList = {
        listId: this.listDialog.editingList.id,
      };
      this.deleteList(deletingList);
      this.handleCancelListDialog();
    },
    handleDeleteCard() {
      const deletingCard = {
        id: this.cardDialog.editingCard.id,
        listId: this.cardDialog.editingCard.parentList.id,
      };
      this.deleteCard(deletingCard);
      this.handleCancelCardDialog();
    },
    handleNameChange(e) {
      this.listDialog.editingList.name = e.target.value;
      this.listDialog.error.name = !this.listDialog?.editingList?.name
        ? "*required"
        : "";
    },
    async fetchDataAndDraw() {
      try {
        this.isLoading = true;
        const id = this.$route.params.id;
        const data = await getBoard(id);
        this.isLoading = false;
        if (!data?.board) {
          return this.$router.push("/");
        }


        if (data.board)
          this.$store.api = {
            board: data.board
          };
        this.drawFns().initCanvas(data);

        setInterval(() => { }, 5000);
      } catch (ex) {
        console.error(ex);
        return this.$router.push("/");
      }
    }
  },
  async mounted() {
    if (this.isLite) {
      const currentList = this.$store.getters.currentBoards.find(
        (v) => v.id === this.$store.state.currentBoardID
      );
      if (!currentList) {
        this.$router.push("/");
      }
      return;
    }
    this.fetchDataAndDraw();
  },
};
</script>

<style scoped>
.title {
  font-size: 24px;
  font-weight: bold;
  color: #42b883;
}

.subtitle {
  color: #35495e;
}

.loading-wrapper {
  width: 100vw;
  height: 60vh;
  font-size: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.canvas-wrapper {
  width: 100%;
  max-height: 90vh;
  overflow-x: scroll;
}

.edit-card-textarea {
  margin-bottom: 10px;
}

.btn-danger {
  background: #ef180c;
  color: white;
}
</style>

<style>
.konvajs-content {
  background-color: #42b883;
}
</style>
