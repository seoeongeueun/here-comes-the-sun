import { useToastStore } from "@/shared/model/toastStore";

export function Toast() {
  const { message, hide } = useToastStore();

  if (!message) return null;

  return (
    <aside className="fixed inset-0 px-6 py-8 pointer-events-none w-full flex justify-center z-50">
      <article
        role="alert"
        aria-live="polite"
        className="rounded-sm bg-white text-black text-center text-xs px-6 py-2 shadow-md flex flex-row items-center pointer-events-auto opacity-85 w-fit h-fit"
      >
        <p className="whitespace-pre-wrap">{"⚡ " + message}</p>
        <button
          className="ml-6 text-background cursor-pointer whitespace-nowrap"
          onClick={hide}
          aria-label="알림 닫기"
        >
          닫기
        </button>
      </article>
    </aside>
  );
}
