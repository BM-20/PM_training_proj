// Language switching 
  let lang = "en";
  const translations = {
    en: { title:"📊 Stock Dashboard", overview:"Overview", chat:"AI Assistant" },
    es: { title:"📊 Panel de Acciones", overview:"Visión General", chat:"Asistente IA" }
  };
  function switchLanguage() {
    lang = (lang === "en") ? "es" : "en";
    document.getElementById("title").innerText = translations[lang].title;
    document.getElementById("overviewTitle").innerText = translations[lang].overview;
    document.getElementById("chatTitle").innerText = translations[lang].chat;
    document.getElementById("langBtn").innerText = (lang === "en" ? "ES" : "EN");
    document.getElementById("chatMessages").innerHTML = `<div><b>AI:</b> ${lang==="en" ? "Hello! Ask me about stock insights 📈" : "¡Hola! Pregúntame sobre las acciones 📈"}</div>`;
  }

  // Section toggling
  function showSection(section) {
    // check if the secion has class d-none if it does then its not active
    // if it does it means we are reclicking
    // ccheck if we are recliking overview secition
    // if so reroute to /profile

    const overview = document.querySelector(".container-fluid.py-3");

    if (section === "overview") {
      // check if overview is already visible
      if (!overview.classList.contains("d-none")) {
        // it's already active → reroute
        window.location.href = "/portfolio";
        return;
      }
    } 


    // hide everything
    document.getElementById("chatSection").classList.add("d-none");
    document.querySelector(".container-fluid.py-3").classList.add("d-none");

    if (section === "chat") {
      document.getElementById("chatSection").classList.remove("d-none");
    } else {
      document.querySelector(".container-fluid.py-3").classList.remove("d-none");
    }

    document.querySelectorAll("nav button").forEach(btn => btn.classList.remove("active"));
    document.getElementById("nav"+capitalize(section)).classList.add("active");
  }

  function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

// AI chat simulation
// function sendMessage(){
  
//   const input = document.getElementById("userInput");
//   if(!input.value.trim()) return;
//   const msgContainer = document.getElementById("chatMessages");
//   msgContainer.innerHTML += `<div><b>You:</b> ${input.value}</div>`;
//   setTimeout(()=>{
//     let reply = lang==="en" ? 
//       `Based on market trends, stocks look ${["bullish","bearish","volatile"][Math.floor(Math.random()*3)]} 📊` :
//       `Según las tendencias del mercado, las acciones se ven ${["alcistas","bajistas","volátiles"][Math.floor(Math.random()*3)]} 📊`;
//     msgContainer.innerHTML += `<div><b>AI:</b> ${reply}</div>`;
//     msgContainer.scrollTop = msgContainer.scrollHeight;
//   },1000);
//   input.value="";
// }
async function sendMessage() {
  
  const input = document.getElementById("userInput");
  if (!input.value.trim()) return;

  const msgContainer = document.getElementById("chatMessages");
  msgContainer.innerHTML += `<div><b>You:</b> ${input.value}</div>`;
  msgContainer.scrollTop = msgContainer.scrollHeight;

  // Call backend API
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input.value })
    });
    const data = await res.json();

    const reply = data.reply || "Sorry, no response.";
    msgContainer.innerHTML += `<div><b>AI:</b> ${reply}</div>`;
    msgContainer.scrollTop = msgContainer.scrollHeight;
  } catch (err) {
    console.error(err);
    msgContainer.innerHTML += `<div><b>AI:</b> Error connecting to server.</div>`;
  }

  input.value = "";
}
    
// Add Stock Modal
function openAddStockModalNav() {
  const modalEl = new bootstrap.Modal(document.getElementById('addStockModal'));
  modalEl.show();
}

function closeAddStockModal() {
  const modalEl = bootstrap.Modal.getInstance(document.getElementById('addStockModal'));
  if(modalEl) modalEl.hide();
}

function submitNewStock() {

  const ticker = document.getElementById("newStockTicker").value.toUpperCase();
  const amount = parseInt(document.getElementById("newStockAmount").value);

  if(!ticker || !amount) { alert("Please fill out both fields!"); return; }

  // find the id of the portfolio
  const pathSegments = window.location.pathname.split('/'); 
  const id = pathSegments[pathSegments.length - 1]; 
  if (!id) return alert("ID is missing from the URL!");

  fetch(`/portfolio/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticker, amount })
  })
  .then(res => res.json())
  .then(data => {
    //alert(data.message || "Stock added!");
    closeAddStockModal();
    location.reload(); // update portfolio
  })
  .catch(err => console.error(err));
}





// Open specific portfolio
function openPortfolio(id) {
  window.location.href = `/portfolio/${id}`;
}

// Modal handling
 
function openCreatePortfolioModal() {
  const modalEl = new bootstrap.Modal(document.getElementById('createPortfolioModal'));
  modalEl.show();
}

function submitNewPortfolio() {
  const name = document.getElementById("portfolioName").value.trim();
  if (!name) return alert("Enter a name!");

  fetch("/portfolio/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) location.reload();
    else alert("Error creating portfolio");
  })
  .catch(err => console.error(err));
}
