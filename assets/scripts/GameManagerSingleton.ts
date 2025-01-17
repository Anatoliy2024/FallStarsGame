import { _decorator, Component, Node, director } from "cc"
const { ccclass, property } = _decorator

@ccclass("GameManagerSingleton")
export class GameManagerSingleton extends Component {
  static instance: GameManagerSingleton = null
  bestResult: number[] = [0, 0, 0, 0, 0]

  protected onLoad(): void {
    if (GameManagerSingleton.instance) {
      this.node.destroy() // Убедитесь, что существует только один экземпляр
    } else {
      GameManagerSingleton.instance = this // Сохраняем ссылку на экземпляр
      director.addPersistRootNode(this.node)
    }
  }

  setBestResult(results: number[]) {
    this.bestResult = results
  }
  getBestResult() {
    return this.bestResult
  }
  start() {}

  update(deltaTime: number) {}
}
