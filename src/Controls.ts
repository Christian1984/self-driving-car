export const Controls = () => {
  const directions = {
    forward: false,
    left: false,
    right: false,
    reverse: false,
  };

  const addKeyboardListeners = () => {
    document.onkeydown = (e: KeyboardEvent) => {
      console.log("keydown -> e.key:", e.key);

      switch (e.key) {
        case "ArrowUp":
          directions.forward = true;
          break;
        case "ArrowLeft":
          directions.left = true;
          break;
        case "ArrowRight":
          directions.right = true;
          break;
        case "ArrowDown":
          directions.reverse = true;
          break;
      }

      console.table(directions);
    };

    document.onkeyup = (e: KeyboardEvent) => {
      console.log("keyup -> e.key:", e.key);

      switch (e.key) {
        case "ArrowUp":
          directions.forward = false;
          break;
        case "ArrowLeft":
          directions.left = false;
          break;
        case "ArrowRight":
          directions.right = false;
          break;
        case "ArrowDown":
          directions.reverse = false;
          break;
      }

      console.table(directions);
    };
  };

  addKeyboardListeners();

  return { directions };
};
