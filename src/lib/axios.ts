import axios from "axios";

const axiosInstance = axios.create({
  // Same-origin Next.js routes (/api/products, /api/search). Rails is client.ts.
  withCredentials: true,
  transformResponse: [
    (data) => {
      try {
        const parsed = JSON.parse(data, (key, value) => {
          if (typeof key === "string" && key.endsWith("At")) {
            return new Date(value);
          }
          return value;
        });
        return parsed;
      // } catch (err) {
      } catch {
        return data; // fallback nếu không phải JSON
        // throw err
      }
    },
  ],
});

export default axiosInstance;
