// components/DeleteForm.tsx
"use client";

import { Trash2 } from "lucide-react";
import { Button } from "./button";

export function DeleteForm({ id }: { id: string }) {
  return (
    <form
      onSubmit={(e) => {
        if (!confirm("Delete this item?")) e.preventDefault();
      }}
      action={`/api/items/${id}`}
    >
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-danger hover:text-danger hover:bg-danger/10"
        type="submit"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </form>
  );
}
