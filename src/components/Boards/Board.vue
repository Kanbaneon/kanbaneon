<template>
  <a-spin :spinning="isLoading" tip="Loading..." size="large">
    <div class="canvas-wrapper">
      <div id="kanbaneon-canvas"></div>
    </div>
  </a-spin>
  <a-modal title="Enter the details of new card" :visible="visible" @ok="handleOk" @cancel="handleCancel">
    <a-form layout="vertical" :model="cardDialog.newCard">
      <a-form-item label="Title" :rules="[{ required: true, message: 'Title is required' }]" name="title"> <a-input
          v-model:value="cardDialog.newCard.title"></a-input></a-form-item>
      <a-form-item label="Description">
        <a-textarea rows="8" class="ant-input edit-card-textarea" placeholder="Type here..."
          v-model:value="cardDialog.newCard.text" />
      </a-form-item>
      <a-form-item>
        <a-checkbox v-model:checked="cardDialog.newCard.isWatching">Watch this card</a-checkbox>
      </a-form-item>
    </a-form>
    <template v-slot:footer>
      <a-button key="back" @click="handleCancel"> Cancel </a-button>
      <a-button key="submit" type="primary" @click="handleOk">
        Confirm
      </a-button>
    </template>
  </a-modal>
  <a-modal :title="listDialog.title" :visible="listDialog.visible" @ok="handleOkListDialog"
    @cancel="handleCancelListDialog">
    <a-input class="ant-input" placeholder="Name" v-model:value="listDialog.editingList.name"
      @change="handleNameChange" />
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
    <a-form layout="vertical" :model="cardDialog.editingCard">
      <a-form-item label="Title"> <a-input v-model:value="cardDialog.editingCard.title"></a-input></a-form-item>
      <a-form-item label="Description">
        <a-textarea rows="8" class="ant-input edit-card-textarea" placeholder="Type here..."
          v-model:value="cardDialog.editingCard.text" />
      </a-form-item>
      <a-form-item>
        <a-checkbox v-model:checked="cardDialog.editingCard.isWatching">Watch this card</a-checkbox>
      </a-form-item>
      <a-popover v-model:open="watcherOpen" trigger="click">
        <template #content>
          <Watchers :watchers="watcherDetails" />
        </template>
        <div class="watchers" @click="handleWatcherData(cardDialog.editingCard.watchers)">
          {{ cardDialog.editingCard.watchers?.length === 1 ? "1 person is watching this card." :
            `${cardDialog.editingCard.watchers?.length} are watching this card.` }}
        </div>
      </a-popover>
    </a-form>
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
  addCardOnCanvas,
  addListOnCanvas,
  editCardOnCanvas,
  deleteCardOnCanvas,
  editListOnCanvas,
  deleteListOnCanvas,
} from "../../utils/DrawCanvas";
import { initList } from "../../utils/DrawList";
import { initListItem } from "../../utils/DrawListItem";
import getAddButton from "../../utils/DrawAddButton";
import getAddText from "../../utils/DrawAddText";
import getCard from "../../utils/DrawCard";
import getTile from "../../utils/DrawTile";
import getText from "../../utils/DrawText";
import {
  addList, addCard,
  editList, editCard,
  deleteList, deleteCard,
  getBoard,
  getProfiles
} from '../../helpers/ApiHelper';
import * as uuid from "uuid";
import { message } from "ant-design-vue";
import Watchers from "./Watchers.vue";

export default {
  data() {
    return {
      isLite: import.meta.env.VITE_LITE_VERSION === "ON",
      isLoading: false,
      visible: false,
      addingList: null,
      watcherDetails: [],
      watcherOpen: false,
      cardDialog: {
        newCard: {
          title: "",
          text: "",
          isWatching: false
        },
        editingCard: {
          title: "",
          text: "",
          isWatching: false,
          watchers: []
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
  components: {
    Watchers
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
    addCardOnCanvas,
    addListOnCanvas,
    editCardOnCanvas,
    deleteCardOnCanvas,
    editListOnCanvas,
    deleteListOnCanvas,
    async handleWatcherData(ids) {
      if (this.watcherOpen) {
        this.watcherOpen = false;
        return;
      }
      const result = await getProfiles(ids);
      if (result.success) {
        this.watcherDetails = result.users;
        this.watcherOpen = true;
      }
    },
    handleCancel() {
      this.visible = false;
      this.cardDialog.newCard = {
        title: "",
        text: "",
        isWatching: false
      }
    },
    handleCancelCardDialog() {
      this.cardDialog = {
        ...this.cardDialog,
        visible: false,
        editingCard: {
          text: "",
          title: "",
          isWatching: false,
          watchers: []
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
    async handleOk() {
      try {
        const newCard = {
          id: uuid.v4(),
          ...this.cardDialog.newCard,
        };
        const listId = this.addingList?.id;
        const addedResult = this.isLite ? this.addCardOnCanvas({ listId, newCard }) : await addCard(this.$store.state.currentBoardID, listId, newCard);
        if (addedResult?.board) {
          this.$store.api = {
            board: addedResult.board
          };
        }
      } catch (ex) {
        console.error(ex);
      } finally {
        this.drawFns().initCanvas();
        this.handleCancel();
      }
    },
    async handleOkCardDialog() {
      try {
        const { parentList, ...cardDetails } = this.cardDialog.editingCard;
        const editingCard = {
          listId: this.cardDialog.editingCard.parentList.id,
          ...cardDetails
        };
        const editedResult = this.isLite ? this.editCardOnCanvas(editingCard) : await editCard(this.$store.state.currentBoardID, editingCard);
        if (editedResult?.board) {
          this.$store.api = {
            board: editedResult.board
          };
        }
      } catch (ex) {
        console.error(ex);
      } finally {
        this.drawFns().initCanvas();
        this.handleCancelCardDialog();
      }
    },
    async handleOkListDialog() {
      try {
        if (!this.listDialog.editingList.name) {
          return this.listDialog.error.name = !this.listDialog?.editingList?.name
            ? "*required"
            : "";
        }

        if (!!this.listDialog?.creating) {
          const newList = {
            id: uuid.v4(),
            name: this.listDialog?.editingList?.name,
            children: [],
          };
          const addedResult = this.isLite ? this.addListOnCanvas(newList) : await addList(this.$store.state.currentBoardID, newList);
          if (addedResult?.board) {
            this.$store.api = {
              board: addedResult.board
            };
          }
        } else {
          const editingList = {
            listId: this.listDialog.editingList.id,
            name: this.listDialog.editingList.name,
          };
          const editedResult = this.isLite ? this.editListOnCanvas(editingList) : await editList(this.$store.state.currentBoardID, editingList);
          if (editedResult?.board) {
            this.$store.api = {
              board: editedResult.board
            };
          }
        }
      } catch (ex) {
        console.error(ex);
      } finally {
        this.drawFns().initCanvas();
        this.handleCancelListDialog();
      }
    },
    async handleDeleteList() {
      try {
        const deletingList = {
          listId: this.listDialog.editingList.id,
        };
        const deletedResult = this.isLite ? this.deleteListOnCanvas(deletingList) : await deleteList(this.$store.state.currentBoardID, deletingList);
        if (deletedResult?.board) {
          this.$store.api = {
            board: deletedResult.board
          };
        }
      } catch (ex) {
        console.error(ex);
      } finally {
        this.drawFns().initCanvas();
        this.handleCancelListDialog();
      }
    },
    async handleDeleteCard() {
      try {
        const deletingCard = {
          id: this.cardDialog.editingCard.id,
          listId: this.cardDialog.editingCard.parentList.id,
        };
        const deletedResult = this.isLite ? this.deleteCardOnCanvas(deletingCard) : await deleteCard(this.$store.state.currentBoardID, deletingCard);
        if (deletedResult?.board) {
          this.$store.api = {
            board: deletedResult.board
          };
        }
      } catch (ex) {
        console.error(ex);
      } finally {
        this.drawFns().initCanvas();
        this.handleCancelCardDialog();
      }
    },
    handleNameChange(e) {
      this.listDialog.editingList.name = e.target.value;
      this.listDialog.error.name = !this.listDialog?.editingList?.name
        ? "*required"
        : "";
    },
    async fetchData() {
      try {
        this.isLoading = true;
        const id = this.$route.params.id;
        const data = await getBoard(id);
        if (!data?.board) {
          return this.$router.push("/");
        }


        if (data.board) {
          this.$store.api = {
            board: data?.board
          };
        }
      } catch (ex) {
        console.error(ex);
        return this.$router.push("/");
      } finally {
        this.drawFns().initCanvas();
        this.isLoading = false;
      }
    }
  },
  async mounted() {
    this.drawFns().initCanvas();
    if (this.isLite) {
      const currentList = this.$store.getters.currentBoards.find(
        (v) => v.id === this.$store.state.currentBoardID
      );
      if (!currentList) {
        this.$router.push("/");
      }
    }
    else {
      await this.fetchData();
    }
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
  margin-top: 140px;
  width: 100%;
}

.edit-card-textarea {
  margin-bottom: 10px;
}

.btn-danger {
  background: #ef180c;
  color: white;
}

.watchers {
  text-decoration: underline;
  cursor: pointer;
  color: #42b883;
  width: fit-content;
}
</style>

<style>
.konvajs-content {
  background-color: #42b883;
}
</style>
