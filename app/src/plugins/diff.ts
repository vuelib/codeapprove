import * as parseDiff from "parse-diff";

type Side = "left" | "right";

export interface FileMetadata {
  from: string;
  to: string;
  additions: number;
  deletions: number;
}

export interface RenderedChange {
  type: "add" | "del" | "normal";
  empty: boolean;
  number: number;
  marker: string;
  content: string;
}

export interface RenderedChangePair {
  left: RenderedChange;
  right: RenderedChange;
}

export interface ChangePair {
  left?: parseDiff.Change;
  right?: parseDiff.Change;
}

const EMPTY_RENDERED: RenderedChange = {
  type: "normal",
  empty: true,
  number: -1,
  marker: " ",
  content: ""
};

export function getFileMetadata(file: parseDiff.File): FileMetadata {
  return {
    from: file.from || "unknown",
    to: file.to || "unknown",
    additions: file.additions,
    deletions: file.deletions
  };
}

export function renderPairs(pairs: ChangePair[]): RenderedChangePair[] {
  return pairs.map(p => {
    // TODO: Is this appropriate?
    return Object.freeze({
      left: renderChange(p.left, "left"),
      right: renderChange(p.right, "right")
    });
  });
}

/**
 * Zip the list of changes from a chunk into an array of pairs ready to be diffed side-by-side.
 */
export function zipChangePairs(chunk: parseDiff.Chunk): ChangePair[] {
  const res: ChangePair[] = [];

  // First sort by line number
  // const changes = sortChanges(chunk.changes);
  const changes = chunk.changes;

  let i = 0;
  while (i < changes.length) {
    const change = changes[i];

    // Del followed by add means the lines "match"
    if (i < changes.length - 1) {
      const next = changes[i + 1];
      if (change.type === "del" && next.type === "add") {
        res.push({
          left: change,
          right: next
        });

        // Extra increment
        i += 2;
        continue;
      }
    }

    if (change.type === "del") {
      res.push({ left: change, right: undefined });
    } else if (change.type === "add") {
      res.push({ left: undefined, right: change });
    } else {
      res.push({ left: change, right: change });
    }

    i++;
  }

  return res;
}

export function renderChange(
  change: parseDiff.Change | undefined,
  side: Side
): RenderedChange {
  // TODO: Drop this block and remove optional
  if (!change) {
    return EMPTY_RENDERED;
  }

  return {
    type: change.type,
    empty: false,
    number: changeLineNumber(change, side),
    content: changeContent(change),
    marker: changeLineMarker(change)
  };
}

export function changeLineMarker(change: parseDiff.Change): string {
  switch (change.type) {
    case "del":
      return "-";
    case "add":
      return "+";
    default:
      return " ";
  }
}

export function changeContent(change: parseDiff.Change): string {
  // Remove the + or the - from the start
  // TODO: Why is this the case for "normal" lines
  return change.content.substring(1);
}

export function changeLineNumber(change: parseDiff.Change, side: Side): number {
  switch (change.type) {
    case "add":
      return change.ln;
    case "del":
      return change.ln;
    case "normal":
      if (side == "left") {
        return change.ln1;
      } else {
        return change.ln2;
      }
  }
}
