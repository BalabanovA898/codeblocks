export interface SerializedBlock {
  type: string;
  [key: string]: any;
}

export interface SerializedCCodeBlockWrapper {
  type: string;
  content: SerializedBlock | null;
  next: SerializedCCodeBlockWrapper[];
}