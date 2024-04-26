import { addBoard } from "./helpers/ApiHelper";

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
      const userId = state.user.id;
      await addBoard(board, userId);
    };
