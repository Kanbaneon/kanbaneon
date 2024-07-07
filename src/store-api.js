import {
  addBoard,
  addList,
  addCard,
  editBoard,
  editList,
  editCard,
  deleteBoard,
  deleteList,
  deleteCard,
  swapList,
} from "./helpers/ApiHelper";

const isLite = import.meta.env.VITE_LITE_VERSION === "ON";

export const addKanbanBoard = isLite
  ? function (state, board) {
      const allBoards = JSON.parse(JSON.stringify(state.kanbanBoards ?? {}));
      const userId = state.user.id;
      const currentBoards = allBoards[userId] ?? [];
      currentBoards.push(board);
      this.commit("setKanbanBoards", {
        ...allBoards,
        [userId]: currentBoards,
      });
    }
  : async (state, board) => {
      await addBoard(board);
    };

export const addKanbanList = isLite
  ? function (state, list) {
      const allBoards = JSON.parse(JSON.stringify(state.kanbanBoards ?? {}));
      const userId = state.user.id;
      const currentBoards = allBoards[userId] ?? [];
      const currentBoardIndex = currentBoards.findIndex(
        (v) => v.id === state.currentBoardID
      );
      currentBoards[currentBoardIndex].kanbanList.push(list);
      this.commit("setKanbanBoards", {
        ...allBoards,
        [userId]: currentBoards,
      });
    }
  : async (state, list) => {
      await addList(state.currentBoardID, list);
    };

export const addKanbanCard = isLite
  ? function (state, { listId, newCard }) {
      const allBoards = JSON.parse(JSON.stringify(state.kanbanBoards ?? {}));
      const userId = state.user.id;
      const currentBoards = allBoards[userId] ?? [];
      const currentBoardIndex = currentBoards.findIndex(
        (v) => v.id === state.currentBoardID
      );
      const addingListIndex = currentBoards[
        currentBoardIndex
      ].kanbanList.findIndex((v) => v.id === listId);

      const addingList =
        currentBoards[currentBoardIndex].kanbanList[addingListIndex];
      addingList.children.push(newCard);
      this.commit("setKanbanBoards", {
        ...allBoards,
        [userId]: currentBoards,
      });
    }
  : async (state, { listId, newCard }) => {
      await addCard(state.currentBoardID, listId, newCard);
    };

export const editKanbanBoard = isLite
  ? function (state, board) {
      const allBoards = JSON.parse(JSON.stringify(state.kanbanBoards ?? {}));
      const userId = state.user.id;
      const currentBoards = allBoards[userId] ?? [];
      const currentBoardIndex = currentBoards.findIndex(
        (v) => v.id === state.currentBoardID
      );
      currentBoards[currentBoardIndex].name = board.name;
      this.commit("setKanbanBoards", {
        ...allBoards,
        [userId]: currentBoards,
      });
    }
  : async (state, board) => {
      await editBoard(state.currentBoardID, board);
    };

export const editKanbanList = isLite
  ? function (state, list) {
      const allBoards = JSON.parse(JSON.stringify(state.kanbanBoards ?? {}));
      const userId = state.user.id;
      const currentBoards = allBoards[userId] ?? [];
      const currentBoardIndex = currentBoards.findIndex(
        (v) => v.id === state.currentBoardID
      );
      const editingList = currentBoards[currentBoardIndex].kanbanList.find(
        (v) => v.id === list.listId
      );
      editingList.name = list.name;
      this.commit("setKanbanBoards", {
        ...allBoards,
        [userId]: currentBoards,
      });
    }
  : async (state, list) => {
      await editList(state.currentBoardID, list);
    };

export const editKanbanCard = isLite
  ? function (state, { listId, text, id }) {
      const allBoards = JSON.parse(JSON.stringify(state.kanbanBoards ?? {}));
      const userId = state.user.id;
      const currentBoards = allBoards[userId] ?? [];
      const currentBoardIndex = currentBoards.findIndex(
        (v) => v.id === state.currentBoardID
      );
      const editingListIndex = currentBoards[
        currentBoardIndex
      ].kanbanList.findIndex((v) => v.id === listId);

      const editingList =
        currentBoards[currentBoardIndex].kanbanList[editingListIndex];
      editingList.children.find((v) => v.id === id).text = text;

      this.commit("setKanbanBoards", {
        ...allBoards,
        [userId]: currentBoards,
      });
    }
  : async (state, card) => {
      await editCard(state.currentBoardID, card);
    };

export const deleteKanbanBoard = isLite
  ? function (state, boardId) {
      const allBoards = JSON.parse(JSON.stringify(state.kanbanBoards ?? {}));
      const userId = state.user.id;
      allBoards[userId] = allBoards[userId].filter((v) => v.id !== boardId);
      this.commit("setKanbanBoards", {
        ...allBoards,
        [userId]: allBoards[userId],
      });
    }
  : async (state) => {
      await deleteBoard(state.currentBoardID);
    };

export const deleteKanbanList = isLite
  ? function (state, list) {
      const allBoards = JSON.parse(JSON.stringify(state.kanbanBoards ?? {}));
      const userId = state.user.id;
      const currentBoards = allBoards[userId] ?? [];
      const currentBoardIndex = currentBoards.findIndex(
        (v) => v.id === state.currentBoardID
      );
      currentBoards[currentBoardIndex].kanbanList = currentBoards[
        currentBoardIndex
      ].kanbanList.filter((v) => v.id !== list.listId);

      this.commit("setKanbanBoards", {
        ...allBoards,
        [userId]: currentBoards,
      });
    }
  : async (state, list) => {
      await deleteList(state.currentBoardID, list);
    };

export const deleteKanbanCard = isLite
  ? function (state, { listId, id }) {
      const allBoards = JSON.parse(JSON.stringify(state.kanbanBoards ?? {}));
      const userId = state.user.id;
      const currentBoards = allBoards[userId] ?? [];
      const currentBoardIndex = currentBoards.findIndex(
        (v) => v.id === state.currentBoardID
      );
      const deletingListIndex = currentBoards[
        currentBoardIndex
      ].kanbanList.findIndex((v) => v.id === listId);

      const deletingList =
        currentBoards[currentBoardIndex].kanbanList[deletingListIndex];
      deletingList.children = deletingList.children.filter((v) => v.id !== id);

      this.commit("setKanbanBoards", {
        ...allBoards,
        [userId]: currentBoards,
      });
    }
  : async (state, card) => {
      await deleteCard(state.currentBoardID, card);
    };

export const swapKanbanList = isLite
  ? function (state, { currentListIndex, foundListIndex, currentList }) {
      const allBoards = JSON.parse(JSON.stringify(state.kanbanBoards ?? {}));
      const userId = state.user.id;
      const currentBoards = allBoards[userId] ?? [];
      const index = currentBoards.findIndex(
        (v) => v.id === state.currentBoardID
      );

      currentBoards[index].kanbanList.splice(currentListIndex, 1);
      currentBoards[index].kanbanList.splice(foundListIndex, 0, currentList);

      this.commit("setKanbanBoards", {
        ...allBoards,
        [userId]: currentBoards,
      });
    }
  : async (state, { currentListIndex, foundListIndex }) => {
      await swapList(state.currentBoardID, currentListIndex, foundListIndex);
    };
