const apiUrl = import.meta.env.VITE_KANBANEON_API_URL;
import { message } from "ant-design-vue";

const token = localStorage.getItem("token");

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
    const response = await post("/boards", { ...board }, token);
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
      Authorization: `Bearer ${token}`,
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
