export interface Badge {
  id: number
  name: string
  description: string
  icon: string
  requirement: string
}

export const BADGES: Badge[] = [
  { id: 0, name: "First Step", description: "Create your first task", icon: "🌱", requirement: "Create 1 task" },
  { id: 1, name: "Task Master", description: "Create 10 tasks", icon: "🔥", requirement: "Create 10 tasks" },
  { id: 2, name: "Go Getter", description: "Create 50 tasks", icon: "🚀", requirement: "Create 50 tasks" },
  { id: 3, name: "Centurion", description: "Create 100 tasks", icon: "💯", requirement: "Create 100 tasks" },
  { id: 4, name: "Finisher", description: "Complete 10 tasks", icon: "✅", requirement: "Move 10 tasks to Done" },
  { id: 5, name: "Overachiever", description: "Complete 50 tasks", icon: "🏆", requirement: "Move 50 tasks to Done" },
  { id: 6, name: "Organizer", description: "Use all 4 columns", icon: "📋", requirement: "Have tasks in every column" },
  { id: 7, name: "Label Lover", description: "Use 5+ unique labels", icon: "🏷️", requirement: "Create 5 unique labels" },
]
