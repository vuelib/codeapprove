import {
  ChangeEntryAPI,
  PullRequestAPI,
  CommentThreadAPI
} from "../components/api";

export type KeyActionMap = Record<string, KeyAction>;
export type KeyDescMap = Record<string, KeyDesc>;
export type KeyMap = Record<string, KeyBinding>;

export interface KeyDesc {
  desc: string;
}

export interface KeyAction {
  keydown: Function;
  keyup?: Function;
}

export type KeyBinding = KeyDesc & KeyAction;

export const PULL_REQUEST_KEY_DESC: KeyDescMap = {
  "alt+j": {
    desc: "Select next file."
  },
  "alt+k": {
    desc: "Select previous file."
  },
  "alt+x": {
    desc: "Expand/collapse selected file."
  }
};

export const PULL_REQUEST_KEY_MAP = (instance: PullRequestAPI) => {
  const actionMap: KeyActionMap = {
    "alt+j": {
      keydown: instance.onNextFile
    },
    "alt+k": {
      keydown: instance.onPrevFile
    },
    "alt+x": {
      keydown: instance.onToggleFile
    }
  };

  return zip(PULL_REQUEST_KEY_DESC, actionMap);
};

export const CHANGE_ENTRY_KEY_DESC: KeyDescMap = {
  "alt+n": {
    desc: "Next line in file."
  },
  "alt+m": {
    desc: "Previous line in file."
  },
  "alt+p": {
    desc: "Add comment to current line."
  }
};

export const CHANGE_ENTRY_KEY_MAP = (instance: ChangeEntryAPI) => {
  const actionMap: KeyActionMap = {
    "alt+n": {
      keydown: instance.nextLine
    },
    "alt+m": {
      keydown: instance.prevLine
    },
    "alt+p": {
      keydown: instance.addLineComment
    }
  };

  return zip(CHANGE_ENTRY_KEY_DESC, actionMap);
};

export const COMMENT_THREAD_KEY_DESC: KeyDescMap = {
  "alt+enter": {
    desc: "Save comment."
  },
  "alt+shift+enter": {
    desc: "Save comment and resolve thread."
  }
};

export const COMMENT_THREAD_KEY_MAP = (instance: CommentThreadAPI) => {
  const actionMap: KeyActionMap = {
    "alt+enter": {
      keydown: () => instance.addComment(undefined)
    },
    "alt+shift+enter": {
      keydown: () => instance.addComment(true)
    }
  };

  return zip(COMMENT_THREAD_KEY_DESC, actionMap);
};

export function combineHotkeys(...maps: KeyDescMap[]): KeyDescMap {
  const res: KeyDescMap = {};

  for (const map of maps) {
    for (const key in map) {
      res[key] = map[key];
    }
  }

  return res;
}

function zip(desc: KeyDescMap, action: KeyActionMap): KeyMap {
  const res: KeyMap = {};

  for (const key in desc) {
    res[key] = {
      keydown: action[key].keydown,
      keyup: action[key].keyup,
      desc: desc[key].desc
    };
  }

  return res;
}
