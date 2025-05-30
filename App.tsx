import { Dimensions, SafeAreaView, View } from "react-native";
import Header from "./components/Header";
import FunctionNavigator from "./components/FunctionNavigator";
import CodeblocksZone from "./components/CodeblocksZone";
import Footer from "./components/Footer";
import BlockList from "./components/BlockList";
import { useEffect, useReducer, useState, useCallback, useRef } from "react";
import CodeBlockFunction from "./classes/CodeBlockFunction";
import CCodeBlockWrapper from "./classes/CodeBlockWrapper";
import LexicalEnvironment from "./classes/Functional/LexicalEnvironment";
import OutputWindow from "./components/OutoutWindow";
import TypeNumber from "./classes/types/TypeNumber";
import Menu from "./components/Menu";
import Debug from "./components/Debug";
import ICodeBlock from "./shared/Interfaces/CodeBlock";
import { useSharedValue } from "react-native-reanimated";
import { output } from "./shared/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadDialog from "./components/LoadDialog";
import SaveDialog from "./components/SaveDialog";

interface SerializedProject {
  meta: {
    version: string;
    savedAt: string;
  };
  fileName: string;
  currentFunction: number;
  functions: any[];
}

const serializeProject = (
  functions: CodeBlockFunction[],
  currentFunction: number,
  fileName: string
): SerializedProject => {
  return {
    meta: {
      version: "1.0",
      savedAt: new Date().toISOString(),
    },
    fileName,
    currentFunction,
    functions: functions.map(fn => fn.serialize()),
  };
};

const deserializeProject = async (
  data: SerializedProject,
  changeFunctionList: (fn: CodeBlockFunction) => void
): Promise<{
  functions: CodeBlockFunction[];
  currentFunction: number;
  fileName: string;
}> => {
  const functions = await Promise.all(
    data.functions.map(async fnData => 
      await CodeBlockFunction.deserialize(fnData, changeFunctionList)
    )
  );

  return {
    functions,
    currentFunction: Math.min(data.currentFunction, functions.length - 1),
    fileName: data.fileName,
  };
};

const PROJECT_KEY = "current_project";

const saveProject = async (project: SerializedProject) => {
  try {
    await AsyncStorage.setItem(PROJECT_KEY, JSON.stringify(project));
  } catch (e) {
    console.error("Failed to save project", e);
  }
};

const loadProject = async (): Promise<SerializedProject | null> => {
  try {
    const data = await AsyncStorage.getItem(PROJECT_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Failed to load project", e);
    return null;
  }
};

export default function App() {
    const [isBlockListVisible, setIsBlockListVisible] =
        useState<Boolean>(false);
    const [isOutputWindowVisible, setIsOutputWindowVisible] =
        useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isDebugMode, setIsDebugMode] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState<boolean>(false);
    const [isLoadDialogOpen, setIsLoadDialogOpen] = useState<boolean>(false);
    const [projectList, setProjectList] = useState<string[]>([]);

    const changeFunctionList = (fn: CodeBlockFunction) => {
        let res = [];
        for (let item = 0; item < functions.length; ++item)
            res.push(item != currentFunction ? functions[item] : fn);
        setFunctions(res);
    };
    
    const changeFunctionListRef = useRef(changeFunctionList);
    useEffect(() => {
        changeFunctionListRef.current = changeFunctionList;
    }, [changeFunctionList]);

    const clearOutput = () => {
        while (output.pop()) {}
    };

    let globalLE = new LexicalEnvironment(null);

    const [functions, setFunctions] = useState<CodeBlockFunction[]>([
        new CodeBlockFunction(
            new CCodeBlockWrapper(null),
            (fn) => changeFunctionListRef.current(fn),
            TypeNumber,
            "main"
        ),
    ]);
    const [currentFunction, setCurrentFunction] = useState<number>(0);
    const [countOfFunctions, setCountOfFunctions] = useState<number>(1);
    const [fileName, setFileName] = useState<string>("Untitled");
    const [debugBlock, setDebugBlock] = useState<ICodeBlock | null>(null);

    useEffect(() => {
        console.log("output: ", output);
    }, [output]);
    
    const fetchProjectList = useCallback(async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const projectKeys = keys.filter(key => key.startsWith("project_"));
        setProjectList(projectKeys.map(key => key.replace("project_", "")));
      } catch (e) {
        console.error("Failed to fetch project list", e);
      }
    }, []);
    
    useEffect(() => {
      fetchProjectList();
    }, []);

    useEffect(() => {
        if (currentFunction >= functions.length) {
            setCurrentFunction(Math.max(0, functions.length - 1));
        }
    }, [functions, currentFunction]);

    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
          const project = serializeProject(functions, currentFunction, fileName);
          await saveProject(project);
          setFileName(fileName || "saved_project");
        } finally {
          setIsSaving(false);
        }
    }, [functions, currentFunction, fileName]);

    const handleLoad = useCallback(async () => {
        setIsLoading(true);
        try {
          const project = await loadProject();
          if (project) {
            const { functions: loadedFunctions, ...rest } = 
              await deserializeProject(
                project,
                (fn) => changeFunctionListRef.current(fn)
              );
    
            setFunctions(loadedFunctions);
            setCurrentFunction(rest.currentFunction);
            setFileName(rest.fileName);
          }
        } catch (e) {
          console.error("Load error:", e);
        } finally {
          setIsLoading(false);
        }
    }, []);

    const handleSaveAs = useCallback(async (projectName: string) => {
      setIsSaving(true);
      try {
        const project = serializeProject(functions, currentFunction, projectName);
        await AsyncStorage.setItem(`project_${projectName}`, JSON.stringify(project));
        setFileName(projectName);
        fetchProjectList();
      } finally {
        setIsSaving(false);
        setIsSaveDialogOpen(false);
      }
    }, [functions, currentFunction]);

    const handleLoadFrom = useCallback(async (projectName: string) => {
      setIsLoading(true);
      try {
        const data = await AsyncStorage.getItem(`project_${projectName}`);
        if (data) {
          const project = JSON.parse(data) as SerializedProject;
          const { functions: loadedFunctions, ...rest } = 
            await deserializeProject(
              project,
              (fn) => changeFunctionListRef.current(fn)
            );
    
          setFunctions(loadedFunctions);
          setCurrentFunction(rest.currentFunction);
          setFileName(rest.fileName);
        }
      } catch (e) {
        console.error("Load failed:", e);
      } finally {
        setIsLoading(false);
        setIsLoadDialogOpen(false);
      }
    }, []); 

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header
                isBlockListVisible={isBlockListVisible}
                setBlockListVisible={setIsBlockListVisible}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                fileName={fileName}
                onSave={handleSave}
                onLoad={handleLoad}
                isSaving={isSaving}
                isLoading={isLoading}
            />
            <BlockList
                onDrop={functions[0].insertNewCodeBlock.bind(functions[0])}
                isVisible={isBlockListVisible}
                setIsVisible={setIsBlockListVisible}
            />
            <Menu 
                isOpen={isMenuOpen}
                onSave={() => handleSave()}
                onSaveAs={() => setIsSaveDialogOpen(true)}
                onLoad={() => handleLoad()}
                onLoadFrom={() => setIsLoadDialogOpen(true)}
                isSaving={isSaving}
                isLoading={isLoading}
            />
            <SaveDialog
              visible={isSaveDialogOpen}
              onSave={handleSaveAs}
              onCancel={() => setIsSaveDialogOpen(false)}
              projectList={projectList}
            />
            <LoadDialog
              visible={isLoadDialogOpen}
              onLoad={handleLoadFrom}
              onCancel={() => setIsLoadDialogOpen(false)}
              projectList={projectList}
            />
            <FunctionNavigator
                functions={functions}
                setCurrentFunction={setCurrentFunction}
                countOfFunctions={countOfFunctions}
            />
            <CodeblocksZone blocks={functions[currentFunction].codeBlocks} />
            {!isDebugMode ? (
                <Footer
                    executeCode={() => {
                        try {
                            clearOutput();
                            output.push(
                                `Выполенение ${fileName} ${new Date(
                                    Date.now()
                                ).toString()}`
                            );
                            globalLE = new LexicalEnvironment(null);
                            functions[currentFunction].execute.bind(
                                functions[currentFunction]
                            )(globalLE);
                        } catch (e: any) {}
                        setIsOutputWindowVisible(true);
                    }}
                    setIsDebugMode={setIsDebugMode}
                />
            ) : (
                <Debug
                    nextStep={() => {
                        if (!debugBlock) {
                            clearOutput();
                            setDebugBlock(
                                functions[currentFunction].codeBlocks.content
                            );
                            globalLE = new LexicalEnvironment(null);
                            output.push("Начало сессии отладки.");
                        } else {
                            try {
                                debugBlock.execute(globalLE);
                                setDebugBlock(debugBlock.next);
                                if (!debugBlock)
                                    output.push(
                                        "Программа завершила своё выполнение."
                                    );
                            } catch (e: any) {
                                setDebugBlock(null);
                            }
                        }
                        setIsOutputWindowVisible(true);
                    }}
                    setIsDebugMode={setIsDebugMode}
                    setDebugBlock={setDebugBlock}
                />
            )}
            <OutputWindow
                isActive={isOutputWindowVisible}
                setIsActive={setIsOutputWindowVisible}
                massages={output}></OutputWindow>
        </SafeAreaView>
    );
}
