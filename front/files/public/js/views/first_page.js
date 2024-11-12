
import getPong4 from "./renderPong4.js";
import initPong4 from "./pong_4.js";
import getPong8 from "./renderPong8.js";
import initPong8 from "./pong_8.js";


export function rendertournois(appContainer) {

  const mainContentHTML = ` <div class=" welcome-container f1">
    <h1>Ping Pong Tournament</h1>
    <p class="description ">
      Welcome to the ultimate ping pong tournament experience! Choose your game mode below to begin.
    </p>
    
    <div class="options ">
      <div class="option-card" id="openPong4">
        <div class="option-icon floating-icon ">🏓</div>
        <div class="option-title ">Regular Tournament</div>
        <div class="option-desc ">4 players compete in semi-finals and finals</div>
        <button class="start-button ">Start 4-Player</button>
      </div>
      
      <div class="option-card " id="openPong8">
        <div class="option-icon floating-icon ">🏓</div>
        <div class="option-title ">Extended Tournament</div>
        <div class="option-desc ">8 players compete in quarter-finals onwards</div>
        <button class="start-button ">Start 8-Player</button>
      </div>
    </div>
  </div>`;

  
  
  
  document.getElementById('mainContent').innerHTML = mainContentHTML;
  
  document.getElementById("openPong4").addEventListener("click", ()=>{
    document.getElementById("mainContent").innerHTML = getPong4();
    initPong4();
  })
  document.getElementById("openPong8").addEventListener("click", ()=>{
    document.getElementById("mainContent").innerHTML = getPong8();
    initPong8();   
  })
}

document.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Prevent click if clicking the button
      if (e.target.classList.contains('start-button')) {
        return;
      }
      
      const mode = card.querySelector('.option-title').textContent.includes('Regular') 
        ? 'regular' 
        : 'extended';
        
      // window.location.href = `ping-pong.html?mode=${mode}`;
    });
  });