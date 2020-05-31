export interface Change {
  type: "del" | "add" | "normal";
  content: string;

  ln?: number;
  ln1?: number;
  ln2?: number;
}
