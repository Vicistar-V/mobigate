import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Pencil, Check } from "lucide-react";
import { useState } from "react";

interface EditableListSectionProps {
  items: string[];
  onItemsChange: (items: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
}

export const EditableListSection = ({
  items,
  onItemsChange,
  placeholder = "Add new item...",
  emptyMessage = "No items added yet"
}: EditableListSectionProps) => {
  const [newItem, setNewItem] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAdd = () => {
    if (newItem.trim()) {
      onItemsChange([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const handleRemove = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index));
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(items[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editValue.trim()) {
      const newItems = [...items];
      newItems[editingIndex] = editValue.trim();
      onItemsChange(newItems);
    }
    setEditingIndex(null);
    setEditValue("");
  };

  return (
    <div className="space-y-2">
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">{emptyMessage}</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2 group">
              <span className="text-primary font-bold text-sm mt-1">•</span>
              {editingIndex === index ? (
                <div className="flex-1 flex gap-1">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-8 text-sm"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                  />
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveEdit}>
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  </Button>
                </div>
              ) : (
                <>
                  <span className="text-sm flex-1">{item}</span>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => handleStartEdit(index)}
                    >
                      <Pencil className="h-3 w-3 text-muted-foreground" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => handleRemove(index)}
                    >
                      <X className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2 pt-1">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          className="h-9 text-sm"
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <Button size="sm" variant="outline" onClick={handleAdd} disabled={!newItem.trim()}>
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
};
