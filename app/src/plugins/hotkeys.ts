import { ChangeEntryAPI, PullRequestAPI } from "../components/api";

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
  "alt+down": {
    desc: "Next line in file."
  },
  "alt+up": {
    desc: "Previous line in file."
  },
  "alt+m": {
    desc: "Add comment to current line."
  }
};

export const CHANGE_ENTRY_KEY_MAP = (instance: ChangeEntryAPI) => {
  const actionMap: KeyActionMap = {
    "alt+down": {
      keydown: instance.nextLine
    },
    "alt+up": {
      keydown: instance.prevLine
    },
    "alt+m": {
      keydown: instance.addLineComment
    }
  };

  return zip(CHANGE_ENTRY_KEY_DESC, actionMap);
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
