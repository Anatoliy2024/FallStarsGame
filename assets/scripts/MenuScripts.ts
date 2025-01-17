import {
  _decorator,
  Button,
  Component,
  Node,
  director,
  Label,
  Prefab,
} from "cc"
const { ccclass, property } = _decorator

@ccclass("MenuScripts")
export class MenuScripts extends Component {
  @property({ type: Button })
  bestResult: Button
  @property({ type: Button })
  newGame: Button
  // @property({ type: Button })
  // menu: Button

  @property(Label)
  resultLabel: Label

  onLoad() {
    this.newGame.node.on(Button.EventType.CLICK, () => {
      director.loadScene("mainGame")
    })
    this.bestResult.node.on(Button.EventType.CLICK, () => {
      director.loadScene("bestResult")
    })
    // setTimeout(() => this.showResultBest(), 1000)
  }

  start() {}

  update(deltaTime: number) {}
}
