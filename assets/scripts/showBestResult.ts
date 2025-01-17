import {
  _decorator,
  Component,
  Node,
  instantiate,
  director,
  Prefab,
  Label,
} from "cc"
const { ccclass, property } = _decorator
// import { createStars } from "./GameManager"
import { GameManagerSingleton } from "./GameManagerSingleton"
@ccclass("showBestResult")
export class showBestResult extends Component {
  @property(Prefab)
  rowTable: Prefab
  @property(Node)
  table: Node

  protected onLoad(): void {
    setTimeout(() => {
      this.showResultBest()
    }, 1000)
  }

  private showResultBest() {
    const gameManagerSingle = GameManagerSingleton.instance
    console.log("gameManager найден")

    if (gameManagerSingle) {
      console.log("Всё нашлось")
      const bestResult = gameManagerSingle.getBestResult()
      bestResult.forEach((data, index) => {
        const stringRowTable: Node = instantiate(this.rowTable)
        stringRowTable.active = true

        // Получить компоненты Label (или другие, если используете текстовые элементы)
        let rating = stringRowTable
          .getChildByName("ratingPrefab")
          .getComponent(Label)
        let score = stringRowTable
          .getChildByName("scorePrefab")
          .getComponent(Label)

        // Заполнение данных
        rating.string = (index + 1).toString()

        score.string = data.toString()

        // Добавить элемент в контейнер
        this.table.addChild(stringRowTable)
      })
    } else {
      console.log(
        "Компонент gameManagerSingle не найден на объекте GameManager."
      )
    }
  }

  private toMenu() {
    director.loadScene("menu")
  }

  start() {}

  update(deltaTime: number) {}
}
