class StateManager {
  constructor() {
    this._choosenFile = null;
    this._listeners = new Set();
  }

  get choosenFile() {
    return this._choosenFile;
  }

  set choosenFile(value) {
    this._choosenFile = value;
    this._notifyListeners();
  }

  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  _notifyListeners() {
    this._listeners.forEach(listener => listener(this._choosenFile));
  }
}

export const stateManager = new StateManager(); 