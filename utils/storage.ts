import AsyncStorage from "@react-native-async-storage/async-storage";
import { SerializedProject } from "../types";

const PROJECT_KEY = "current_project";

// Сохранение проекта
export const saveProject = async (project: SerializedProject) => {
    try {
        await AsyncStorage.setItem(PROJECT_KEY, JSON.stringify(project));
    } catch (e) {
        console.error("Failed to save project", e);
    }
};

// Загрузка проекта
export const loadProject = async (): Promise<SerializedProject | null> => {
    try {
        const data = await AsyncStorage.getItem(PROJECT_KEY);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error("Failed to load project", e);
        return null;
    }
};