import { Header } from "./Header";

export function Dashboard() {
  return (
    <div className="w-full h-full flex flex-col p-10 gap-4">
      <Header />
      <div className="flex flex-row justify-end gap-4 items-center text-white">
        <h3>현재 위치: </h3>
        <span>Unknown</span>
      </div>
    </div>
  );
}
