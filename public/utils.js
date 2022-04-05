function toggle(name, elementID, buttonID) {
  const element = document.getElementById(elementID);
  const button = document.getElementById(buttonID);
  if (element.style.display === "none") {
    element.style.display = "block";
    button.textContent = `Hide ${name}`;
  } else {
    element.style.display = "none";
    button.textContent = `View ${name}`;
  }
}
