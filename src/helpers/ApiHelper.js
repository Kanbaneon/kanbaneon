const apiUrl = import.meta.env.VITE_KANBANEON_API_URL;
import { message } from "ant-design-vue";

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

const post = async (endpoint, body) => {
  const response = await fetch(apiUrl + endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });

  const json = await response.json();
  if (response.status !== 200) {
    return message.error(json.message);
  }

  return json;
};
