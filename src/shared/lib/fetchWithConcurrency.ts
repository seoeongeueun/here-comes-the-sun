//동시성 제한을 두고 비동기 작업 목록을 순차적으로 처리하는 유틸리티 함수
export async function fetchWithConcurrency<T>(
  items: T[],
  limit: number,
  task: (item: T) => Promise<unknown>
): Promise<void> {
  const queue = [...items];
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (queue.length) {
        const item = queue.shift()!;
        await task(item);
      }
    }
  );
  await Promise.all(workers);
}
