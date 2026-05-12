import { useState } from "react";
import ItemDetailPage from "./pages/ItemDetailPage";
import ItemListPage from "./pages/ItemListPage";

type AppView =
  | {
      name: "list";
    }
  | {
      name: "detail";
      itemId: string;
    };

export default function App() {
  const [view, setView] = useState<AppView>({ name: "list" });

  if (view.name === "detail") {
    return (
      <ItemDetailPage
        itemId={view.itemId}
        onBack={() => setView({ name: "list" })}
      />
    );
  }

  return (
    <ItemListPage
      onSelectItem={(itemId) => setView({ name: "detail", itemId })}
    />
  );
}
