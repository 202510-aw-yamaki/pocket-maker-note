import { useState } from "react";
import ItemDetailPage from "./pages/ItemDetailPage";
import ItemFormPage from "./pages/ItemFormPage";
import ItemListPage from "./pages/ItemListPage";
import type { PocketItem, PocketItemInput } from "./types/PocketItem";

type AppView =
  | {
      name: "list";
    }
  | {
      name: "detail";
      itemId: string;
    }
  | {
      name: "add";
    }
  | {
      name: "edit";
      item: PocketItem;
    };

export default function App() {
  const [view, setView] = useState<AppView>({ name: "list" });

  if (view.name === "detail") {
    return (
      <ItemDetailPage
        itemId={view.itemId}
        onBack={() => setView({ name: "list" })}
        onEdit={(item) => setView({ name: "edit", item })}
      />
    );
  }

  if (view.name === "add") {
    return (
      <ItemFormPage
        mode="add"
        onBack={() => setView({ name: "list" })}
        onSubmit={async (_input: PocketItemInput) => {
          setView({ name: "list" });
        }}
      />
    );
  }

  if (view.name === "edit") {
    return (
      <ItemFormPage
        mode="edit"
        initialItem={view.item}
        onBack={() => setView({ name: "detail", itemId: view.item.id })}
        onSubmit={async (_input: PocketItemInput) => {
          setView({ name: "detail", itemId: view.item.id });
        }}
      />
    );
  }

  return (
    <ItemListPage
      onSelectItem={(itemId) => setView({ name: "detail", itemId })}
      onAddItem={() => setView({ name: "add" })}
    />
  );
}
