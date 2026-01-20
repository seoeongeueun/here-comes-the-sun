import { Toast } from "@/shared/ui/toast";
import { AppRouter } from "./providers/router";

export default function App() {
  return (
    <>
      <Toast />
      <AppRouter />
    </>
  );
}
