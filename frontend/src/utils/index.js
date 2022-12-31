export const timeSince = (timestamp) => {
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years";
  }

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }

  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }

  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }

  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }

  return Math.floor(seconds) + " seconds";
};

export const client = (endpoint, { body, ...customConfig } = {}) => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (refreshToken) {
    headers.Refresh = `${refreshToken}`;
  }

  const config = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }
  console.log("hii");
  if (endpoint.includes("users")) {
    const userapiUrl =
      process.env.NODE_ENV == "development"
        ? `${process.env.REACT_APP_USERS_API_URL}`
        : "";
    console.log(`${userapiUrl}`);
    return fetch(`${userapiUrl}${endpoint}`, config).then(async (res) => {
      const data = await res.json();
      if (res.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    });
  } else if (endpoint.includes("auth")) {
    const authapiUrl =
      process.env.NODE_ENV == "development"
        ? `${process.env.REACT_APP_AUTH_API_URL}`
        : "";
    console.log(`${authapiUrl}`);
    return fetch(`${authapiUrl}${endpoint}`, config).then(async (res) => {
      const data = await res.json();
      if (res.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    });
  } else if (endpoint.includes("posts")) {
    const postapiUrl =
      process.env.NODE_ENV == "development"
        ? `${process.env.REACT_APP_POSTS_API_URL}`
        : "";
    console.log(`${postapiUrl}`);
    return fetch(`${postapiUrl}${endpoint}`, config).then(async (res) => {
      const data = await res.json();
      if (res.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    });
  }
};

export const uploadImage = (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "ckgj8jch");

  const cloudinaryUrl =
    process.env.NODE_ENV == "development"
      ? `${process.env.REACT_APP_CLOUDINARY_URL}`
      : "/upload";

  return fetch(`${cloudinaryUrl}`, {
    method: "POST",
    body: data,
  }).then((res) => res.json());
};
