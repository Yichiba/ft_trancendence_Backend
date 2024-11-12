const getPong8 = ()=>{
    return `
    <div class="f2 container-tournamernt">
    <h1 class="ele tournament-header">Ping Pong Tournament</h1>

    <div class="player-registration" id="registration">
      <div class="player-input">

        <input type="text" id="player1" placeholder="Player 1" />
      </div>
      <div class="player-input">
        <input type="text" id="player2" placeholder="Player 2" />
      </div>
      <div class="player-input">
        <input type="text" id="player3" placeholder="Player 3" />
      </div>
      <div class="player-input">
        <input type="text" id="player4" placeholder="Player 4" />
      </div>
      <div class="player-input">
        <input type="text" id="player5" placeholder="Player 5" />
      </div>
      <div class="player-input">
        <input type="text" id="player6" placeholder="Player 6" />
      </div>
      <div class="player-input">
        <input type="text" id="player7" placeholder="Player 7" />
      </div>
      <div class="player-input">
        <input type="text" id="player8" placeholder="Player 8" />
      </div>
    </div>

    <button class="register-button" id="registerButton">
      Start Tournament
    </button>
    <button class="start-button hide" id="startButton">
      Start First Match
    </button>

    <div class="tournament-bracket hide">
      <div class="round" id="quarter-finals">
        <h3>Quarter Finals</h3>
        <div class="match" id="match1">
          <div class="player" data-player="1">Player 1</div>
          <div class="player" data-player="2">Player 2</div>
        </div>
        <div class="match" id="match2">
          <div class="player" data-player="3">Player 3</div>
          <div class="player" data-player="4">Player 4</div>
        </div>
        <div class="match" id="match3">
          <div class="player" data-player="5">Player 5</div>
          <div class="player" data-player="6">Player 6</div>
        </div>
        <div class="match" id="match4">
          <div class="player" data-player="7">Player 7</div>
          <div class="player" data-player="8">Player 8</div>
        </div>
      </div>

      <div class="round" id="semi-finals">
        <h3>Semi Finals</h3>
        <div class="match" id="match5">
          <div class="player">TBD</div>
          <div class="player">TBD</div>
        </div>
        <div class="match" id="match6">
          <div class="player">TBD</div>
          <div class="player">TBD</div>
        </div>
      </div>

      <div class="round" id="final">
        <h3>Final</h3>
        <div class="match" id="match7">
          <div class="player">TBD</div>
          <div class="player">TBD</div>
        </div>
      </div>
    </div>

    <div class="current-match hide">
      <h2 class="ele">
        Current Match: <span id="current-players">Player 1 vs Player 2</span>
      </h2>
    </div>

    <div class="score-display-tourna">
      <span id="leftScore">0</span> - <span id="rightScore">0</span>
    </div>
    <div class="ping-pong-court">
      <div class="net"></div>
      <div class="paddle" id="leftPaddle"></div>
      <div class="paddle" id="rightPaddle"></div>
      <div class="ball-tourna"></div>
    </div>
  </div>
    `
}

export default getPong8;