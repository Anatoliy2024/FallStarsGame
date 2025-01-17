import {
  _decorator,
  Component,
  Node,
  Prefab,
  director,
  instantiate,
  RigidBody2D,
  Vec2,
  Label,
  AudioSource,
  input,
  Input,
  EventKeyboard,
  KeyCode,
  Animation,
} from "cc"

const { ccclass, property } = _decorator
import { GameManagerSingleton } from "./GameManagerSingleton"

@ccclass("createStars")
export class createStars extends Component {
  @property(Prefab)
  stars: Prefab
  @property(Node)
  failureWindow: Node
  @property(Node)
  pauseWindow: Node

  @property(Label)
  scoreLabel: Label
  @property(Label)
  scoreLabelGameOver: Label

  @property(Label)
  timerLabel: Label

  @property(AudioSource)
  public _audioSource: AudioSource = null!

  time = 60
  score = 0
  isGameOver = false

  isGamePause = false
  private starsArray: { node: Node; speed: Vec2 }[] = []

  protected onLoad(): void {
    this.schedule(this.countdown, 1)
    input.on(Input.EventType.KEY_DOWN, this.gamePause, this)

    // Get the AudioSource component
    const audioSource = this.node.getComponent(AudioSource)
    // Check if it contains AudioSource, if not, output an error message
    // assert(audioSource)
    if (!audioSource) {
      console.error("AudioSource component not found on the node.")
      return
    }
    // Assign the component to the global variable _audioSource
    this._audioSource = audioSource
  }

  // start() {
  //   this.schedule(() => this.generateStars(), 0.5)

  // }
  start() {
    this.schedule(() => {
      if (!this.isGamePause) {
        this.generateStars()
        console.log("Stars")
      }
    }, 0.5)
  }

  private endGame() {
    const gameManagerSingle = GameManagerSingleton.instance
    if (gameManagerSingle) {
      // console.log("Счёт сохранился")
      let newBestResult = gameManagerSingle.getBestResult()
      // console.log("newBestResult", newBestResult)
      newBestResult.push(this.score)
      newBestResult = newBestResult
        .sort((a: number, b: number) => a - b)
        .reverse()
        .slice(0, 5)
      // console.log("newBestResult", newBestResult)
      gameManagerSingle.setBestResult(newBestResult) // Пример данных
    }

    this.isGameOver = true
    this.failureWindow.active = true
    this.scoreLabelGameOver.string = `Score: ${this.score}`
    this.unscheduleAllCallbacks()

    director
      .getScene()
      .getChildByName("Canvas")
      .children.forEach((value) => {
        if (value.name === "star100") {
          value.destroy()
        }
      })
  }
  private countdown() {
    if (!this.isGamePause) {
      if (this.time > 0) {
        this.time -= 1 // Отнимаем прошедшее время от оставшегося

        this.timerLabel.string = `Time: ${this.time}`
        // console.log("Оставшееся время: " + this.time.toFixed() + " сек")
      } else {
        this.endGame()
      }
    }
  }

  private generateStars() {
    let canvas = director.getScene().getChildByName("Canvas")

    let stars: Node = instantiate(this.stars)

    let randomPosition = Math.floor(Math.random() * (600 - -600 + 1)) - 600

    let randomSpeed = Math.floor(Math.random() * (10 - 22 + 1)) + 22
    let randomSpeedRotate = Math.random() * (0.6 - 0.1) + 0.1

    const initialSpeed = new Vec2(0, -randomSpeed)
    stars.setParent(canvas)

    stars.setPosition(randomPosition, 400)
    stars.setSiblingIndex(3)
    stars.setRotationFromEuler(0, 0, 0)
    stars.getComponent(RigidBody2D).linearVelocity = new Vec2(0, -randomSpeed)

    // Управляем анимацией
    const animation = stars.getComponent(Animation)
    if (animation) {
      const state = animation.getState("rotateStars")
      if (state) {
        state.speed = randomSpeedRotate
      }
    }

    this.starsArray.push({ node: stars, speed: initialSpeed })

    stars.on(Node.EventType.TOUCH_START, () => {
      if (!this.isGamePause) {
        stars.destroy()
        //audio
        this._audioSource.play()

        this.score += 10
        this.scoreLabel.string = `Score: ${this.score}`
      }
    })
  }

  private reset() {
    this.score = 0
    this.isGameOver = false
    this.time = 10
    this.failureWindow.active = false
    this.scoreLabel.string = `Score: ${this.score}`
    this.timerLabel.string = `Time: ${this.time}`
    this.scoreLabelGameOver.string = `Score: ${this.score}`
  }

  private restartGame() {
    console.log("Restart")
    this.reset()

    this.unscheduleAllCallbacks() // Останавливаем все события (если были запланированы)
    this.schedule(this.countdown, 1) // Перезапускаем таймер

    // Перезапуск генерирования звезд
    this.schedule(() => this.generateStars(), 0.5)
  }

  private stopAllStars() {
    for (let item of this.starsArray) {
      if (item.node.isValid) {
        // Останавливаем движение звезды
        const animation = item.node.getComponent(Animation)
        if (animation) {
          animation.pause() // Останавливаем анимацию
        }

        item.node.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 0) //работает и без этого

        const rigidBody = item.node.getComponent(RigidBody2D)
        if (rigidBody) {
          rigidBody.enabled = false // Отключаем компонент физики
        }
      }
    }
  }
  private resumeAllStars() {
    for (let item of this.starsArray) {
      if (item.node.isValid) {
        // Возвращаем звезде её скорость
        const animation = item.node.getComponent(Animation)
        if (animation) {
          animation.resume() // Останавливаем анимацию
        }

        item.node.getComponent(RigidBody2D).linearVelocity = item.speed //работает и без этого

        const rigidBody = item.node.getComponent(RigidBody2D)
        if (rigidBody) {
          rigidBody.enabled = true // Отключаем компонент физики
        }
      }
    }
  }
  //random commit
  private gamePause(event: EventKeyboard) {
    if (this.isGamePause) {
      switch (event.keyCode) {
        case KeyCode.ESCAPE:
          this.resumeAllStars()
          this.pauseWindow.active = false

          this.isGamePause = false

          console.log("Pressed Escape not PAuse")
          break
      }
    } else {
      switch (event.keyCode) {
        case KeyCode.ESCAPE:
          this.stopAllStars()
          this.pauseWindow.active = true

          this.isGamePause = true
          // this.unscheduleAllCallbacks()

          console.log("Pressed Escape Pause")
          break
      }
    }
  }

  private toMenu() {
    this.reset()
    director.loadScene("menu")
  }

  update(deltaTime: number) {
    if (!this.isGamePause) {
      for (let i = this.starsArray.length - 1; i >= 0; i--) {
        const star = this.starsArray[i].node

        if (star.isValid) {
          const position = star.getPosition()

          // Проверка выхода звезды за нижнюю границу
          if (position.y < -400) {
            star.destroy() // Удаляем звезду
            this.starsArray.splice(i, 1) // Удаляем её из массива
          }
        }
      }
    }
  }
}
