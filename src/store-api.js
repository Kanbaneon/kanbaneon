import { addBoard, addList, editBoard, deleteBoard } from "./helpers/ApiHelper";

const isLite = import.meta.env.VITE_LITE_VERSION === "ON";

export const addKanbanBoard = isLite
  ? (state, board) => {
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
  ? (state, list) => {
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

export const editKanbanBoard = isLite
  ? (state, board) => {
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

export const deleteKanbanBoard = isLite
  ? (state, boardId) => {
      const allBoards = JSON.parse(JSON.stringify(state.kanbanBoards ?? {}));
      const userId = state.user.id;
      allBoards[userId] = allBoards[userId].filter((v) => v.id !== boardId);
      this.commit("setKanbanBoards", {
        ...allBoards,
        [userId]: allBoards[userId],
      });
    }
  : async (state, board) => {
      await deleteBoard(state.currentBoardID);
    };
