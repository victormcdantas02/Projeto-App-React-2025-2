import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

interface Todo {
  id: string;
  text: string;
  category: string;
  isCompleted: boolean;
  data: Date | null;
}

interface CalendarProps {
  selectedDate: Date;
  todos: Todo[];
  onDateSelect?: (date: Date) => void;
}

export default function Calendar({ selectedDate, todos, onDateSelect }: CalendarProps) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [dayTodos, setDayTodos] = useState<Todo[]>([]);

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  const monthNames = [
    "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
    "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO",
  ];

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const previousMonth = () =>
    setViewDate(new Date(currentYear, currentMonth - 1, 1));

  const nextMonth = () =>
    setViewDate(new Date(currentYear, currentMonth + 1, 1));

  const goToToday = () => {
    const newToday = new Date(today.getFullYear(), today.getMonth(), 1);
    setViewDate(newToday);
    handleDateSelect(today);
  };

  const normalizeDate = (date: any): Date | null => {
    if (!date) return null;
    if (typeof date === "string") {
      const [year, month, day] = date.split("-").map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date(date);
  };

  const sameDay = (d1: any, d2: any): boolean => {
    const date1 = normalizeDate(d1);
    const date2 = normalizeDate(d2);
    if (!date1 || !date2) return false;

    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleDateSelect = (date: Date) => {
    onDateSelect && onDateSelect(date);
    const todosDoDia = todos.filter(
      (todo) => todo.data && sameDay(todo.data, date)
    );
    setDayTodos(todosDoDia);
  };

  const hasTasksOnDate = (day: number): boolean => {
    const dayDate = new Date(currentYear, currentMonth, day);
    return todos.some((todo) => todo.data && sameDay(todo.data, dayDate));
  };

  const getTaskCountForDate = (day: number): number => {
    const dayDate = new Date(currentYear, currentMonth, day);
    return todos.filter((todo) => todo.data && sameDay(todo.data, dayDate)).length;
  };

  const getCompletedTasksForDate = (day: number): number => {
    const dayDate = new Date(currentYear, currentMonth, day);
    return todos.filter(
      (todo) => todo.data && sameDay(todo.data, dayDate) && todo.isCompleted
    ).length;
  };

  const areAllTasksCompleted = (day: number): boolean => {
    const dayDate = new Date(currentYear, currentMonth, day);
    const dayTodos = todos.filter(
      (todo) => todo.data && sameDay(todo.data, dayDate)
    );
    return dayTodos.length > 0 && dayTodos.every((todo) => todo.isCompleted);
  };

  const isSelectedDay = (day: number): boolean =>
    sameDay(selectedDate, new Date(currentYear, currentMonth, day));

  const isPastDay = (day: number): boolean => {
    const dayDate = new Date(currentYear, currentMonth, day);
    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    return dayDate < todayDate;
  };

  const isWeekend = (day: number): boolean => {
    const d = new Date(currentYear, currentMonth, day);
    return d.getDay() === 0 || d.getDay() === 6;
  };

  const selectDay = (day: number) =>
    handleDateSelect(new Date(currentYear, currentMonth, day));

  const renderDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = sameDay(today, new Date(currentYear, currentMonth, day));
      const taskCount = getTaskCountForDate(day);
      const completedCount = getCompletedTasksForDate(day);
      const allCompleted = areAllTasksCompleted(day);
      const past = isPastDay(day);
      const weekend = isWeekend(day);
      const selected = isSelectedDay(day);
      const hasTasks = hasTasksOnDate(day);

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            selected && styles.selectedDay,
            hasTasks && styles.hasTasks,
            allCompleted && styles.allCompleted,
            isToday && styles.today,
            past && styles.pastDay,
            weekend && styles.weekend,
          ]}
          onPress={() => selectDay(day)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.dayNumber,
              (selected || isToday) && styles.dayNumberActive,
            ]}
          >
            {day}
          </Text>
          {taskCount > 0 && (
            <View style={styles.taskIndicators}>
              <Text
                style={[
                  styles.taskCount,
                  allCompleted && styles.taskCountCompleted,
                ]}
              >
                {taskCount}
              </Text>
              {taskCount > 1 && completedCount > 0 && !allCompleted && (
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${(completedCount / taskCount) * 100}%` },
                    ]}
                  />
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>
      );
    }
    return days;
  };

  const getMonthStats = () => {
    const monthTodos = todos.filter((todo) => {
      const d = normalizeDate(todo.data);
      return (
        d &&
        d.getFullYear() === currentYear &&
        d.getMonth() === currentMonth
      );
    });
    const completed = monthTodos.filter((todo) => todo.isCompleted).length;
    const total = monthTodos.length;
    return { total, completed, pending: total - completed };
  };

  const monthStats = getMonthStats();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.navigation}>
          <TouchableOpacity onPress={previousMonth} style={styles.navBtn}>
            <Text style={styles.navBtnText}>←</Text>
          </TouchableOpacity>

          <View style={styles.monthInfo}>
            <Text style={styles.monthText}>
              {monthNames[currentMonth]} {currentYear}
            </Text>
            {monthStats.total > 0 && (
              <View style={styles.monthStats}>
                <Text style={styles.statText}>{monthStats.total} tarefas</Text>
                <Text style={[styles.statText, styles.statCompleted]}>
                  {monthStats.completed} concluídas
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
            <Text style={styles.navBtnText}>→</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={goToToday} style={styles.todayBtn}>
          <Text style={styles.todayBtnText}>Hoje</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.todayLegend]} />
          <Text style={styles.legendText}>Hoje</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.hasTasksLegend]} />
          <Text style={styles.legendText}>Com tarefas</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.completedLegend]} />
          <Text style={styles.legendText}>Concluídas</Text>
        </View>
      </View>

      <View style={styles.weekdays}>
        {weekDays.map((day) => (
          <Text key={day} style={styles.weekdayText}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.calendarGrid}>{renderDays()}</View>

      <View style={styles.selectedDayTodos}>
        <Text style={styles.selectedDayTitle}>
          Tarefas de {selectedDate.toLocaleDateString("pt-BR")}:
        </Text>
        {dayTodos.length === 0 ? (
          <Text style={styles.noTasksText}>Nenhuma tarefa neste dia.</Text>
        ) : (
          <View style={styles.todosList}>
            {dayTodos.map((todo) => (
              <Text
                key={todo.id}
                style={[
                  styles.todoItem,
                  todo.isCompleted && styles.completedText,
                ]}
              >
                • {todo.text} {todo.isCompleted ? "(Concluída)" : ""}
              </Text>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  navBtn: {
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    minWidth: 40,
    alignItems: "center",
  },
  navBtnText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  monthInfo: {
    alignItems: "center",
  },
  monthText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  monthStats: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  statText: {
    fontSize: 12,
    color: "#666",
  },
  statCompleted: {
    color: "#10b981",
    fontWeight: "600",
  },
  todayBtn: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: "center",
  },
  todayBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: "#666",
  },
  todayLegend: {
    backgroundColor: "#007AFF",
  },
  hasTasksLegend: {
    backgroundColor: "#fbbf24",
  },
  completedLegend: {
    backgroundColor: "#10b981",
  },
  weekdays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    flex: 1,
    textAlign: "center",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDay: {
    width: "14.28%",
    aspectRatio: 1,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  selectedDay: {
    backgroundColor: "#007AFF",
  },
  hasTasks: {
    backgroundColor: "#fef3c7",
  },
  allCompleted: {
    backgroundColor: "#d1fae5",
  },
  today: {
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  pastDay: {
    opacity: 0.5,
  },
  weekend: {
    backgroundColor: "#f9fafb",
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  dayNumberActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  taskIndicators: {
    marginTop: 2,
    alignItems: "center",
  },
  taskCount: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#f59e0b",
    backgroundColor: "#fff",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 8,
  },
  taskCountCompleted: {
    color: "#10b981",
  },
  progressBar: {
    width: "80%",
    height: 2,
    backgroundColor: "#e0e0e0",
    borderRadius: 1,
    marginTop: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
  },
  selectedDayTodos: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  selectedDayTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  noTasksText: {
    color: "#999",
    fontStyle: "italic",
  },
  todosList: {
    gap: 8,
  },
  todoItem: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#999",
  },
});