const cellTypes = [

  {
    name: "Rational Cell",
    emoji: "🤓",
    image: "https://i.ibb.co.com/zWPnJjLM/avatar-rationalcell.png"
  },

  {
    name: "Delulu Cell",
    emoji: "😵‍💫",
    image: "https://i.ibb.co.com/qF1YxHTt/avatar-delulucell.png"
  },

  {
    name: "Emotional Cell",
    emoji: "🥹",
    image: "https://i.ibb.co.com/SDNVDwFL/avatar-emotionalcell.png"
  },

  {
    name: "Hunger Cell",
    emoji: "😋",
    image: "https://i.ibb.co.com/ymN8pv0s/avatar-hungercell.png"
  },

  {
    name: "Love Cell",
    emoji: "🥰",
    image: "https://i.ibb.co.com/3YRWPyjt/avatar-lovecell.png"
  },
  
    {
    name: "Naughty Cell",
    emoji: "😏",
    image: "https://i.ibb.co.com/CphpTrQ2/avatar-naughty.png"
  },

  {
    name: "Idol Cell",
    emoji: "😎",
    image: "https://i.ibb.co.com/YTjYzJhd/avatar-idolcell.png"
  }

];

const reasons = [

  "too cute to reject",
  "daydreaming license holder",
  "official sunshine energy",
  "suspiciously adorable",
  "high aesthetic level",
  "friend of the cellmates",
  "approved by cell council",
  "soft vibes detected"

];

const avatarArea = document.getElementById("avatarArea");

document
.getElementById("generateBtn")
.addEventListener("click", generateCard);

function generateCard(){

  const name =
  document
  .getElementById("visitorName")
  .value
  .trim();

  if(!name){
    alert("Please enter your name.");
    return;
  }

  let count = 0;

  const shuffle = setInterval(() => {

    const randomCell =
    cellTypes[
      Math.floor(
        Math.random() * cellTypes.length
      )
    ];

    avatarArea.innerHTML =
      randomCell.image
      ? `<img src="${randomCell.image}">`
      : randomCell.emoji;

    document.getElementById("cellOutput").textContent =
      randomCell.name;

    count++;

  }, 120);

setTimeout(() => {

  clearInterval(shuffle);

  const finalCell =
    cellTypes[
      Math.floor(
        Math.random() * cellTypes.length
      )
    ];

  const finalReason =
    reasons[
      Math.floor(
        Math.random() * reasons.length
      )
    ];

  avatarArea.innerHTML =
    finalCell.image
      ? `<img src="${finalCell.image}">`
      : finalCell.emoji;

  document.getElementById("nameOutput").textContent =
    name;

  document.getElementById("cellOutput").textContent =
    finalCell.name;

  document.getElementById("reasonOutput").textContent =
    finalReason;

  // POPUP MUNCUL DI SINI
  document
    .getElementById("approvalModal")
    .classList.remove("hidden");

}, 2500);

}

document
.getElementById("downloadBtn")
.addEventListener("click", () => {

html2canvas(
  document.getElementById("card"),
  {
    useCORS: true,
    scale: 3
  }
).then(canvas => {

  const link =
  document.createElement("a");

  link.download =
  "cellmate-visitor-pass.png";

  link.href =
  canvas.toDataURL("image/png", 1.0);

  link.click();

});

});


document
.getElementById("goBulletinBtn")
.addEventListener("click", () => {

  document
  .getElementById("approvalModal")
  .classList.add("hidden");

  document
  .querySelector(".bulletin-section")
  .scrollIntoView({
    behavior:"smooth"
  });

});

// ===== Google Analytics Tracking =====

function trackButtonClick(id, category, label) {

  const btn = document.getElementById(id);

  if (btn) {

    btn.addEventListener("click", () => {

      gtag("event", "button_click", {
        event_category: category,
        event_label: label
      });

      console.log("Tracked:", label);

    });

  }

}

// Generate Visitor Pass
trackButtonClick(
  "generateBtn",
  "visitor_pass",
  "generate_pass"
);

// Download Visitor Pass
trackButtonClick(
  "downloadBtn",
  "visitor_pass",
  "download_pass"
);

// Go To Bulletin
trackButtonClick(
  "goBulletinBtn",
  "bulletin",
  "go_to_bulletin"
);
