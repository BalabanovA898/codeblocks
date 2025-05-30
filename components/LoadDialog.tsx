import React from "react";
import { View, Text, Button, Modal, FlatList } from "react-native";

interface LoadDialogProps {
  visible: boolean;
  onLoad: (name: string) => void;
  onCancel: () => void;
  projectList: string[];
}

const LoadDialog: React.FC<LoadDialogProps> = ({ 
  visible, 
  onLoad, 
  onCancel,
  projectList
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{ backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10 }}>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>Выберите проект для загрузки:</Text>
          
          <FlatList
            data={projectList}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Text 
                style={{ padding: 15, backgroundColor: '#f0f0f0', marginVertical: 5, borderRadius: 5 }}
                onPress={() => onLoad(item)}
              >
                {item}
              </Text>
            )}
          />
          
          <View style={{ marginTop: 20 }}>
            <Button title="Отмена" onPress={onCancel} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LoadDialog;