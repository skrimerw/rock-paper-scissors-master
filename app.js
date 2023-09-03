class App {
  constructor() {
    this.state = {
      player1: "",
      player2: "",
      time: 3,
      result: "",
      score: Number(window.localStorage.getItem("score")) || 0,
    };
    this.options = ["rock", "paper", "scissors"];

    this.$cross = document.querySelector(".cross");
    this.$modal = document.querySelector(".modal");
    this.$modalContent = document.querySelector(".modal-content");
    this.$rulesBtn = document.querySelector(".rules-btn");
    this.$triangle = document.querySelector(".triangle");
    this.$players = document.querySelectorAll(".player");
    this.$main = document.querySelector("main");
    this.$gameFieldSection = document.querySelector(".game-field-section");
    this.$gameField = document.querySelector(".game-field");
    this.$score = document.querySelector(".score");

    this.addEventListenters();
    this.openModal;
    this.closeModal;
    this.makeDecision;
    this.randomDesicion;
    this.chooseWinner;
    this.countScore();
    this.displayScore;
    this.playAgain;
    this.setTimer;
    this.save;
  }

  addEventListenters() {
    window.addEventListener("click", (e) => {
      this.randomDesicion();
      this.makeDecision(e);
      this.playAgain(e);
    });

    this.$cross.addEventListener("click", (e) => {
      this.closeModal(e);
    });

    this.$rulesBtn.addEventListener("click", () => {
      this.openModal();
    });

    this.$modal.addEventListener("click", (e) => {
      if (!e.target.matches(".modal")) return;

      this.closeModal(e);
    });
  }

  openModal() {
    this.$modal.style.display = "flex";
  }

  closeModal() {
    this.$modal.style.display = "none";
  }

  makeDecision(e) {
    const player = e.target.closest(".player");

    if (!player) return;

    if (!this.state.player1) {
      this.randomDesicion();

      this.state.isBegan = true;
      this.state.player1 = player.id;

      this.$gameFieldSection.style.opacity = "0";

      let house;
      setTimeout(() => {
        this.$gameField.innerHTML = `
          <div class="decision" id="you">
            <p class="label">You picked</p>
            <div class="dark-circle">
              <div class="player" id="${player.id}">
                <div class="player-inner-section">
                </div>
              </div>
            </div>
          </div>
          <div class="result-container" hidden>
            <h1 class="result">
            </h1>
            <button class="play-again-btn">Play again</button>
          </div>
          <div class="decision" id="house">
            <p class="label">The house picked</p>
            <div class="dark-circle">
              <p class="timer">
                ${this.state.time}
              </p>
            </div>
          </div>
        `;

        this.setTimer();
        house = document.querySelector("#house");
      }, 200);

      const timeout = setTimeout(() => {
        house.lastElementChild.innerHTML = `
        <div 
          class="player" 
          id="${this.state.player2}" 
          style="animation-name: pop-out; animation-duration: .5s; animation-fill-mode: forwards;"
        >
          <div class="player-inner-section">
          </div>
        </div>
        `;
        this.chooseWinner();
      }, 3000);
    }
  }

  randomDesicion() {
    const randomNumber = Math.floor(Math.random() * 3);

    this.state.player2 = this.options[randomNumber];
  }

  chooseWinner() {
    const result = document.querySelector(".result");
    const resultContainer = result.closest(".result-container");
    resultContainer.style.display = "flex";
    const player1 = this.state.player1;
    const player2 = this.state.player2;

    if (player1 === player2) {
      this.state.result = "draw";
    } else if (
      (player1 === "rock" && player2 === "scissors") ||
      (player1 === "paper" && player2 === "rock") ||
      (player1 === "scissors" && player2 === "paper")
    ) {
      this.state.result = "win";
    } else {
      this.state.result = "lose";
    }
    result.innerText =
      this.state.result === "draw" ? "draw" : `You ${this.state.result}`;

    this.countScore();
    this.save()
  }

  countScore() {
    if (this.state.result === "win") {
      this.state.score += 2;
    } else if (this.state.result === "lose") {
      if (this.state.score > 0) this.state.score -= 1;
      else return;
    }

    this.displayScore();
  }

  displayScore() {
    this.$score.innerText = this.state.score;
  }

  playAgain(e) {
    const button = e.target.closest(".play-again-btn");

    if (!button) return;
    this.$gameField.replaceChildren(this.$gameFieldSection);

    setTimeout(() => {
      this.$gameFieldSection.style.opacity = "1";
    }, 200);

    this.state.player1 = "";
    this.state.player2 = "";
    this.state.time = 3;
  }

  setTimer() {
    const interval = setInterval(() => {
      if (this.state.time > 1) {
        this.state.time -= 1;
        const timer = document.querySelector("#house").querySelector(".timer");

        timer.innerText = this.state.time;
        return;
      }

      clearInterval(interval);
    }, 1000);
  }

  save() {
    window.localStorage.setItem("score", this.state.score)
  }
}

new App();
