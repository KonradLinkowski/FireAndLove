export class Component {
  #listeners = {}
  addEvent($target, event, handler, id = Math.random().toString(36).substr(2, 9)) {
    $target.addEventListener(event, handler)
    this.#listeners[id] = { $target, event, handler }
    return id
  }

  removeEvent(id) {
    const listener = this.#listeners[id]
    listener.$target.removeEventListener(listener.event, listener.handler)
    delete this.#listeners[id]
  }

  onDestroy() {
    for (const id in this.#listeners) {
      this.removeEvent(id)
    }
  }
}
