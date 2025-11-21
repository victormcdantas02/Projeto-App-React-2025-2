import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface TodoProps {
  todo: {
    id: string;
    text: string;
    category: string;
    isCompleted: boolean;
    data: Date | null;
  };
  onComplete?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export default function Todo({ todo, onComplete, onRemove }: TodoProps) {
  const formatDate = (dateObj: any): string => {
    if (!dateObj) return "";

    let date: Date;
    if (typeof dateObj === "string") {
      const [year, month, day] = dateObj.split("-").map(Number);
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(dateObj);
    }

    return date.toLocaleDateString("pt-BR");
  };

  const getCategoryEmoji = (category: string): string => {
    const emojis: { [key: string]: string } = {
      Trabalho: "📊",
      Pessoal: "👤",
      Estudos: "📚",
      Saúde: "💪",
    };
    return emojis[category] || "📌";
  };

  return (
    <View style={[styles.container, todo.isCompleted && styles.completed]}>
      <View style={styles.content}>
        <Text
          style={[styles.text, todo.isCompleted && styles.completedText]}
          numberOfLines={2}
        >
          {todo.text}
        </Text>
        <Text style={styles.category}>
          {getCategoryEmoji(todo.category)} {todo.category}
        </Text>
        {todo.data && (
          <Text style={styles.date}>📅 {formatDate(todo.data)}</Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.completeButton,
            todo.isCompleted && styles.undoButton,
          ]}
          onPress={() => onComplete && onComplete(todo.id)}
        >
          <Text style={styles.completeButtonText}>
            {todo.isCompleted ? "↩️ Desfazer" : "✅ Completar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.removeButton]}
          onPress={() => onRemove && onRemove(todo.id)}
        >
          <Text style={styles.removeButtonText}>🗑️ Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  completed: {
    backgroundColor: "#f0f9ff",
    borderLeftColor: "#10b981",
    opacity: 0.8,
  },
  content: {
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  category: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  completeButton: {
    backgroundColor: "#10b981",
  },
  undoButton: {
    backgroundColor: "#f59e0b",
  },
  completeButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  removeButton: {
    backgroundColor: "#ef4444",
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});