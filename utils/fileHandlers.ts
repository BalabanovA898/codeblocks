class CodeBlockFunction {
  // свойства и конструктор

  toJSON() {
    return {
      __class: 'CodeBlockFunction',
      type: this.type,
      codeBlocks: this.codeBlocks.toJSON(),
      lexicalEnvironment: this.lexicalEnvironment.toJSON()
    };
  }

  static fromJSON(json: any, changeFunctionList: Function): CodeBlockFunction {
    const globalLE = LexicalEnvironment.fromJSON(json.lexicalEnvironment);
    return new CodeBlockFunction(
      CCodeBlockWrapper.fromJSON(json.codeBlocks, globalLE),
      changeFunctionList,
      json.type,
      globalLE
    );
  }
}

export const saveToFile = (data: any, filename: string = 'codeblocks-save.json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};

export const loadFromFile = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        resolve(JSON.parse(event.target?.result as string));
      } catch (e) {
        reject(new Error('Invalid JSON file'));
      }
    };
    
    reader.onerror = () => reject(new Error('File reading error'));
    reader.readAsText(file);
  });
};