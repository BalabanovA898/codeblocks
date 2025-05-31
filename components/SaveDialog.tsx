import React, { useState } from "react";
import { View, Text, TextInput, Button, Modal, FlatList } from "react-native";

interface SaveDialogProps {
  visible: boolean;
  onSave: (name: string) => void;
  onCancel: () => void;
  projectList: string[];
}

const SaveDialog: React.FC<SaveDialogProps> = ({ 
  visible, 
  onSave, 
  onCancel,
  projectList
}) => {
  const [projectName, setProjectName] = useState("");

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{ backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10 }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Сохранить проект как:</Text>
          
          <TextInput
            placeholder="Введите название проекта"
            value={projectName}
            onChangeText={setProjectName}
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />
          
          <Text style={{ marginTop: 10 }}>Существующие проекты:</Text>
          <FlatList
            data={projectList}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Text 
                style={{ padding: 10, backgroundColor: '#f0f0f0', marginVertical: 2 }}
                onPress={() => setProjectName(item)}
              >
                {item}
              </Text>
            )}
          />
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <Button title="Отмена" onPress={onCancel} />
            <Button 
              title="Сохранить" 
              onPress={() => onSave(projectName)} 
              disabled={!projectName.trim()}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SaveDialog;