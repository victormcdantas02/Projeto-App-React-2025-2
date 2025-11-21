import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

interface TodoFormProps {
  onAddTodo: (text: string, category: string, date: Date) => void;
}

export default function TodoForm({ onAddTodo }: TodoFormProps) {
  const [value, setValue] = useState("");
  const [category, setCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = () => {
    if (!value.trim()) {
      Alert.alert("Atenção", "Por favor, digite o título da tarefa");
      return;
    }
    if (!category) {
      Alert.alert("Atenção", "Por favor, escolha uma categoria");
      return;
    }
    if (!selectedDate) {
      Alert.alert("Atenção", "Por favor, selecione uma data");
      return;
    }

    onAddTodo(value.trim(), category, selectedDate);
    
    // Limpar formulário
    setValue("");
    setCategory("");
    setSelectedDate(new Date());
  };

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === "ios"); // iOS mantém aberto
    if (date) {
      setSelectedDate(date);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar tarefa:</Text>

      {/* Input de Título */}
      <TextInput
        style={styles.input}
        placeholder="Digite o título da tarefa"
        placeholderTextColor="#999"
        value={value}
        onChangeText={setValue}
      />

      {/* Picker de Categoria */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Escolha uma categoria" value="" />
          <Picker.Item label="Trabalho" value="Trabalho" />
          <Picker.Item label="Pessoal" value="Pessoal" />
          <Picker.Item label="Estudos" value="Estudos" />
          <Picker.Item label="Saúde" value="Saúde" />
        </Picker>
      </View>

      {/* Botão de Selecionar Data */}
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>
          📅 {formatDate(selectedDate)}
        </Text>
      </TouchableOpacity>

      {/* DatePicker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
          minimumDate={new Date()}
          locale="pt-BR"
        />
      )}

      {/* Botão de Criar */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Criar tarefa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fafafa",
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fafafa",
    alignItems: "center",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});