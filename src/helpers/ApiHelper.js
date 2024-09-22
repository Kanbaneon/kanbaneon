const apiUrl = import.meta.env.VITE_KANBANEON_API_URL;
import { message } from "ant-design-vue";

const token = () => localStorage.getItem("token");
const imgBBurl = import.meta.env.VITE_IMGBB_API_URL;
const imgBBkey = import.meta.env.VITE_IMGBB_API_KEY;

export async function login(username, password) {
  try {
    const response = await post("/login", { username, password });
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function uploadPhoto(formData) {
  try {
    const response = await postImgBB(formData);
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function signUp(username, email, password) {
  try {
    const response = await post("/signup", { username, email, password });
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function reauth(token) {
  try {
    const response = await post("/reauth", { token });
    if (response.success) {
      return response;
    }
  } catch (ex) {
    console.info(ex.message);
  }
}

export async function getProfile() {
  try {
    const response = await get(`/profile`);
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function editProfile(profile) {
  try {
    const response = await put(`/profile`, profile);
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function getBoard(id) {
  try {
    const response = await get(`/boards/${id}`);
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function getBoards() {
  try {
    const response = await get("/boards");
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function addBoard(board) {
  try {
    const response = await post("/boards", { ...board }, token());
    if (response.success) {
      message.success("Board is successfully added.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function addList(boardId, list) {
  try {
    const response = await post(
      `/boards/${boardId}/lists`,
      { ...list },
      token()
    );
    if (response.success) {
      message.success("List is successfully added.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function addCard(boardId, listId, card) {
  try {
    const response = await post(
      `/boards/${boardId}/lists/${listId}/cards`,
      { ...card },
      token()
    );
    if (response.success) {
      message.success("Card is successfully added.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function editBoard(boardId, board) {
  try {
    const response = await put(`/boards/${boardId}`, { ...board }, token());
    if (response.success) {
      message.success("Board is successfully updated.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function editList(boardId, list) {
  try {
    const response = await put(
      `/boards/${boardId}/lists/${list.listId}`,
      { ...list },
      token()
    );
    if (response.success) {
      message.success("List is successfully updated.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function editCard(boardId, { listId, ...card }) {
  try {
    const response = await put(
      `/boards/${boardId}/lists/${listId}/cards/${card.id}`,
      { ...card },
      token()
    );
    if (response.success) {
      message.success("Card is successfully updated.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function deleteBoard(boardId) {
  try {
    const response = await del(`/boards/${boardId}`, token());
    if (response.success) {
      message.success("Board is successfully deleted.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function deleteList(boardId, list) {
  try {
    const response = await del(
      `/boards/${boardId}/lists/${list.listId}`,
      token()
    );
    if (response.success) {
      message.success("List is successfully deleted.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function deleteCard(boardId, { listId, id }) {
  try {
    const response = await del(
      `/boards/${boardId}/lists/${listId}/cards/${id}`,
      token()
    );
    if (response.success) {
      message.success("Card is successfully deleted.");
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function swapList(boardId, from, to) {
  try {
    const response = await post(
      `/boards/${boardId}/swap-lists?from=${from}&to=${to}`,
      {},
      token()
    );
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function swapCardExternal(boardId, parentList, foundList) {
  try {
    const response = await post(
      `/boards/${boardId}/swap-cards-external`,
      { parentList, foundList },
      token()
    );
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

export async function swapCardInternal(boardId, listId, from, to) {
  try {
    const response = await post(
      `/boards/${boardId}/swap-cards-internal/${listId}?from=${from}&to=${to}`,
      {},
      token()
    );
    if (response.success) {
      return response;
    }
  } catch (ex) {
    message.error(ex.message);
  }
}

const get = async (endpoint) => {
  const response = await fetch(apiUrl + endpoint, {
    method: "GET",
    headers: new Headers({
      Authorization: `Bearer ${token()}`,
    }),
  });

  const json = await response.json();
  if (response.status !== 200) {
    return message.error(json.message);
  }

  return json;
};

const put = async (endpoint, body) => {
  const response = await fetch(apiUrl + endpoint, {
    method: "PUT",
    headers: new Headers({
      Authorization: `Bearer ${token()}`,
    }),
    body: JSON.stringify(body),
  });

  const json = await response.json();
  if (response.status !== 200) {
    return message.error(json.message);
  }

  return json;
};

const del = async (endpoint) => {
  const response = await fetch(apiUrl + endpoint, {
    method: "DELETE",
    headers: new Headers({
      Authorization: `Bearer ${token()}`,
    }),
  });

  const json = await response.json();
  if (response.status !== 200) {
    return message.error(json.message);
  }

  return json;
};

const post = async (endpoint, body, token) => {
  const response = await fetch(apiUrl + endpoint, {
    method: "POST",
    headers: token
      ? new Headers({
          Authorization: `Bearer ${token}`,
        })
      : {},
    body: JSON.stringify(body),
  });

  const json = await response.json();
  if (response.status !== 200) {
    return message.error(json.message);
  }

  return json;
};

const postImgBB = async (body) => {
  const response = await fetch(`${imgBBurl}?key=${imgBBkey}`, {
    method: "POST",
    body,
  });

  const json = await response.json();
  if (response.status !== 200) {
    return message.error(json.message);
  }

  return json;
};
