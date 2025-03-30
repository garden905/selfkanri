import "./App.css";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useLocalStorage } from "@reactuses/core";
function App() {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState(false);
  const [selectedTodoText, setSelectedTodoText] = useState<string>("");

  type Todo = {
    inputValue: string;
    id: number;
    checked: boolean;
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTotalSeconds((prevSeconds) => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          } else {
            setIsActive(false);
            return 0;
          }
        });
      }, 1000);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
  };
  const handleStop = () => {
    setIsActive(false);
  };

  const incrementHours = () => {
    setTotalSeconds(totalSeconds + 3600);
  };

  const decrementHours = () => {
    if (totalSeconds >= 3600) setTotalSeconds(totalSeconds - 3600);
  };

  const incrementMinutes = () => {
    setTotalSeconds(totalSeconds + 60);
  };

  const decrementMinutes = () => {
    if (totalSeconds >= 60) {
      setTotalSeconds(totalSeconds - 60);
    }
  };

  const incrementSeconds = () => {
    setTotalSeconds(totalSeconds + 1);
  };

  const decrementSeconds = () => {
    if (totalSeconds > 0) {
      setTotalSeconds(totalSeconds - 1);
    }
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

  const handleTodoClick = (text: string) => {
    setSelectedTodoText(text);
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

  function Demo() {
    // bind string
    const [value, setValue] = useLocalStorage("my-key", "key");
    return (
      <div>
        <div>Value: {value}</div>
        <button onClick={() => setValue("bar")}>bar</button>
        <button onClick={() => setValue("baz")}>baz</button>
        {/* delete data from storage */}
        <button onClick={() => setValue(null)}>Remove</button>
      </div>
    );
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="App">
      {/* タイマーの上に選択されたTodoを表示 */}
      <Demo />
      <div className="selected-todo">
        {selectedTodoText && <h1> {selectedTodoText}</h1>}

        <div>
          <div>
            {!isActive && (
              <div className="timer-controls">
                <button onClick={incrementHours}>▲</button>
                <button onClick={incrementMinutes}>▲</button>
                <button onClick={incrementSeconds}>▲</button>
              </div>
            )}

            <div className="timer-display">
              <span>{String(hours).padStart(2, "0")}</span>:
              <span>{String(minutes).padStart(2, "0")}</span>:
              <span>{String(seconds).padStart(2, "0")}</span>
            </div>
            {!isActive && (
              <div className="timer-controls">
                <button onClick={decrementHours}>▼</button>
                <button onClick={decrementMinutes}>▼</button>
                <button onClick={decrementSeconds}>▼</button>
              </div>
            )}
          </div>
          {!isActive && (
            <button className="start-button" onClick={handleStart}>
              Start Timer
            </button>
          )}
          {isActive && (
            <button className="stop-button" onClick={handleStop}>
              Stop
            </button>
          )}

          <h2>Todoリスト</h2>
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              type="text"
              value={inputValue} // 状態と同期
              onChange={(e) => handleChange(e)}
              className="inputText"
            />
            <input type="submit" value="作成" className="submitButton" />
          </form>

          <div className="todo-list">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="todo-item"
                onClick={() => handleTodoClick(todo.inputValue)} // タップ時に選択
              >
                <input
                  type="text"
                  onChange={(e) => handleEdit(todo.id, e.target.value)}
                  className="inputText"
                  value={todo.inputValue}
                  disabled={todo.checked}
                />
                <input
                  type="checkbox"
                  checked={todo.checked}
                  onChange={() => handleChecked(todo.id, todo.checked)}
                />
              </div>
            ))}
          </div>
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
    </div>
  );
}

export default App;
