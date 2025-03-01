import "./App.css";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState(false);
  type Todo = {
    inputValue: string;
    id: number;
    checked: boolean;
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    } else if (seconds === 0 && minutes > 0) {
      setMinutes((minutes) => minutes - 1);
      setSeconds(59);
    } else if (seconds === 0 && minutes === 0) {
      setIsActive(false);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, minutes]);

  const handleStart = () => {
    setIsActive(true);
  };

  const incrementMinutes = () => {
    setMinutes(minutes + 1);
  };

  const decrementMinutes = () => {
    if (minutes > 0) setMinutes(minutes - 1);
  };

  const incrementSeconds = () => {
    if (seconds < 59) setSeconds(seconds + 1);
  };

  const decrementSeconds = () => {
    if (seconds > 0) setSeconds(seconds - 1);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.value);
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTodo: Todo = {
      inputValue: inputValue,
      id: todos.length,
      checked: false,
    };
    setTodos([newTodo, ...todos]);
    setInputValue("");
  };

  const handleEdit = (id: number, inputValue: string) => {
    const newTodos = todos.map((todo) => {
      if (todo.id == id) {
        todo.inputValue = inputValue;
      }
      return todo;
    });
    setTodos(newTodos);
  };

  const handleChecked = (id: number, checked: boolean) => {
    const newTodos = todos.map((todo) => {
      if (todo.id == id) {
        todo.checked = !checked;
      }
      return todo;
    });
    setTodos(newTodos);
  };

  const handleImageClick = () => {
    setIsRotating(!isRotating);
  };

  const createSparkle = (
    x: number,
    y: number,
    moveX: number,
    moveY: number
  ) => {
    const sparkle = document.createElement("div");
    sparkle.classList.add("sparkle");
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.setProperty("--move-x", `${moveX}px`);
    sparkle.style.setProperty("--move-y", `${moveY}px`);
    document.body.appendChild(sparkle);

    // アニメーション終了時に要素を削除
    sparkle.addEventListener("animationend", () => {
      sparkle.remove();
    });
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      for (let i = 0; i < 6; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 50;
        const offsetX = Math.cos(angle) * distance;
        const offsetY = Math.sin(angle) * distance;
        createSparkle(e.clientX, e.clientY, offsetX, offsetY);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="App">
      <div>
        <div>
          <div>
            <button onClick={incrementMinutes}>▲</button>
            <button onClick={incrementSeconds}>▲</button>
          </div>
          <div>
            <span>{String(minutes).padStart(2, "0")}</span>
            <span>{String(seconds).padStart(2, "0")}</span>
          </div>
          <div>
            <button onClick={decrementSeconds}>▼</button>
            <button onClick={decrementMinutes}>▼</button>
          </div>
        </div>
        <button onClick={handleStart}>Start Timer</button>
        <div>
          {`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
            2,
            "0"
          )}`}
        </div>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.inputValue}</li>
          ))}
        </ul>
        <h2>Todoリスト</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            onChange={(e) => handleChange(e)}
            className="inputText"
          />
          <input type="submit" value="作成" className="submitButton" />
        </form>

        <ul className="todoList">
          {todos.map((todo) => (
            <li key={todo.id}>
              <input
                type="text"
                onChange={(e) => handleEdit(todo.id, e.target.value)}
                className="inputText"
                value={todo.inputValue}
                disabled={todo.checked}
              />
              <input
                type="checkbox"
                onChange={() => handleChecked(todo.id, todo.checked)}
              />
            </li>
          ))}
        </ul>
      </div>
      <img
        src="src/assets/lace.png"
        className={`top-left ${isRotating ? "left-rotate" : ""}`}
        alt="Top Left Image"
        onClick={handleImageClick}
      />
      <img
        src="src/assets/lace.png"
        className={`bottom-right ${isRotating ? "right-rotate" : ""}`}
        alt="Bottom Right Image"
        onClick={handleImageClick}
      />
    </div>
  );
}

export default App;
