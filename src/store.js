import { browserDB, INDEXED_DB } from "./helpers/IndexedDbHelper";
import { createStore } from "vuex";
import {
  addKanbanBoard,
  addKanbanList,
  addKanbanCard,
  editKanbanBoard,
  editKanbanList,
  editKanbanCard,
  deleteKanbanBoard,
  deleteKanbanList,
  deleteKanbanCard,
  swapKanbanList,
  swapKanbanCardExternal,
  swapKanbanCardInternal,
  setProfile,
} from "./store-api";

const initialState = {
  kanbanBoards: {},
  currentBoardID: "",
  user: {
    isLoggedIn: false,
    username: "",
  },
  profile: {},
};

export async function getExistingUser(username) {
  const users =
    (await browserDB.get(INDEXED_DB.objectStores.KANBANEON, "users")) || {};

  const existingUser = users[username];
  return existingUser;
}

// Create a new store instance.
export const store = createStore({
  state() {
    return initialState;
  },
  getters: {
    kanbanList(_, getters) {
      return JSON.parse(
        JSON.stringify(
          getters.currentBoards.find((v) => v.id === getters.currentBoardID)
            ?.kanbanList ?? []
        )
      );
    },
    async kanbanBoards(state) {
      return JSON.parse(JSON.stringify(state.kanbanBoards));
    },
    currentBoardID(state) {
      return JSON.parse(JSON.stringify(state.currentBoardID));
    },
    user(state) {
      return JSON.parse(JSON.stringify(state.user));
    },
    profile(state) {
      return JSON.parse(JSON.stringify(state.profile));
    },
    currentBoards(state) {
      const userId = state.user.id ?? "";
      return JSON.parse(JSON.stringify(state.kanbanBoards?.[userId] ?? []));
    },
  },
  mutations: {
    addKanbanCard,
    addKanbanList,
    addKanbanBoard,
    editKanbanCard,
    editKanbanBoard,
    editKanbanList,
    deleteKanbanCard,
    deleteKanbanList,
    deleteKanbanBoard,
    swapKanbanList,
    swapKanbanCardExternal,
    swapKanbanCardInternal,
    setProfile,
    async setKanbanBoards(state, boards) {
      state.kanbanBoards = boards;
      await browserDB.put(
        INDEXED_DB.objectStores.KANBANEON,
        "kanbanBoards",
        boards
      );
    },
    async setCurrentBoardID(state, currentBoardID) {
      state.currentBoardID = currentBoardID;
      await browserDB.put(INDEXED_DB.objectStores.KANBANEON, "currentBoardID", {
        value: currentBoardID,
      });
    },
    async setUser(state, user) {
      state.user = user;
      if (user?.isLoggedIn && user?.username) {
        await setUpBoards();
      }
      await browserDB.put(INDEXED_DB.objectStores.KANBANEON, "user", {
        ...user,
      });
    },
  },
});

async function setUpCurrentBoardID() {
  const currentBoardID = await browserDB.get(
    INDEXED_DB.objectStores.KANBANEON,
    "currentBoardID",
    initialState.currentBoardID
  );
  if (currentBoardID?.value) {
    store.commit("setCurrentBoardID", currentBoardID.value);
  } else {
    store.commit("setCurrentBoardID", initialState.currentBoardID);
  }
}

async function setUpUser() {
  const user = await browserDB.get(
    INDEXED_DB.objectStores.KANBANEON,
    "user",
    initialState.user
  );
  if (user) {
    store.commit("setUser", user);
  } else {
    store.commit("setUser", initialState.user);
  }
  return user;
}

async function setUpBoards() {
  const kanbanBoards = await browserDB.get(
    INDEXED_DB.objectStores.KANBANEON,
    "kanbanBoards"
  );
  store.commit("setKanbanBoards", kanbanBoards);
}

export async function setUpDB() {
  await browserDB.openDatabase();

  await setUpCurrentBoardID();
  const user = await setUpUser();
  if (user?.isLoggedIn && user?.username) {
    await setUpBoards();
  }
}

export async function clearDB() {
  browserDB.clearDatabase();
}
