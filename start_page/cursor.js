let frame = 0;

setInterval(function () {
  frame = frame + 1;

  let arrow = frame % 12;
  let hand = frame % 14;

  document.documentElement.style.setProperty("--cursor", `url("images/cursor/${arrow}.png") 8 1, auto`);
  document.documentElement.style.setProperty("--pointer", `url("images/pointer/${hand}.png") 4 0, pointer`);
}, 100);