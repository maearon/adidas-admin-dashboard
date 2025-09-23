import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

// ⏱ Cache TTL
const CACHE_TTL = 1000 * 60 * 5; // 5 phút

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_TTL,
      gcTime: CACHE_TTL * 2,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

// 🔒 Tạo persister với localStorage (chỉ chạy client-side)
if (typeof window !== "undefined") {
  const localStoragePersister = createAsyncStoragePersister({
    storage: window.localStorage,
  });

  // 💾 Kích hoạt persistent cache
  persistQueryClient({
    queryClient,
    persister: localStoragePersister,
    maxAge: CACHE_TTL * 2, // Cache sẽ bị xóa sau 10 phút
  });
}
