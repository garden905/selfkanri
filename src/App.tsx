import "./App.css";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useLocalStorage } from "@reactuses/core";
const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [totalSeconds, setTotalSeconds] = useLocalStorage<number>(
    "totalSeconds",
    0
  ); // useLocalStorageを使用
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isRotating, setIsRotating] = useState(false);
  const [selectedTodoText, setSelectedTodoText] = useState<string>("");

  type Todo = {
    inputValue: string;
    id: number;
    checked: boolean;
    title: string;
    totalplaytime: number;
  };

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    item: Todo | null;
  }>({ visible: false, x: 0, y: 0, item: null });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTotalSeconds((prevSeconds) => {
          if ((prevSeconds ?? 0) > 0) {
            // タイマーを1秒減らす
            const newSeconds = (prevSeconds ?? 0) - 1;

            // 選択されたTodoのtotalplaytimeを増やす
            setTodos((prevTodos) =>
              prevTodos.map((todo) =>
                todo.title === selectedTodoText
                  ? { ...todo, totalplaytime: todo.totalplaytime + 1 }
                  : todo
              )
            );

            return newSeconds;
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
  }, [isActive, selectedTodoText, setTotalSeconds]);

  const handleStart = () => {
    setIsActive(true);
  };
  const handleStop = () => {
    setIsActive(false);
  };

  const incrementHours = () => {
    setTotalSeconds((totalSeconds ?? 0) + 3600);
  };

  const decrementHours = () => {
    if ((totalSeconds ?? 0) >= 3600)
      setTotalSeconds((totalSeconds ?? 0) - 3600);
  };

  const incrementMinutes = () => {
    setTotalSeconds((totalSeconds ?? 0) + 60);
  };

  const decrementMinutes = () => {
    if ((totalSeconds ?? 0) >= 60) {
      setTotalSeconds((totalSeconds ?? 0) - 60);
    }
  };

  const incrementSeconds = () => {
    setTotalSeconds((totalSeconds ?? 0) + 1);
  };

  const decrementSeconds = () => {
    if ((totalSeconds ?? 0) > 0) {
      setTotalSeconds((totalSeconds ?? 0) - 1);
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
      title: inputValue,
      totalplaytime: 0,
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

  const handleRightClick = (event: React.MouseEvent, item: Todo) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      item,
    });
  };
  // // 音声再生関数
  // const playSound = () => {
  //   const audio = new Audio("Sounds/4fa.mp3"); // 音声ファイルのパスを指定
  //   audio.play();
  // };

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

  const hours = Math.floor((totalSeconds ?? 0) / 3600);
  const minutes = Math.floor(((totalSeconds ?? 0) % 3600) / 60);
  const seconds = (totalSeconds ?? 0) % 60;

  return (
    <div className="App">
      {/* タイマーの上に選択されたTodoを表示 */}

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
                onContextMenu={(e) => handleRightClick(e, todo)} // 右クリックイベント
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
          {contextMenu.visible && contextMenu.item && (
            <div
              style={{
                position: "absolute",
                top: contextMenu.y,
                left: contextMenu.x,
                backgroundColor: "white",
                border: "1px solid #ccc",
                padding: "10px",
                zIndex: 1000,
              }}
            >
              <p>
                <strong>タイトル:</strong> {contextMenu.item.title}
              </p>
              <p>
                <strong>プレイ時間:</strong> {contextMenu.item.totalplaytime}
              </p>
            </div>
          )}
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
};

export default App;
