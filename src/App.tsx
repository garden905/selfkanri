import "./App.css";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [time, setTime] = useState(60);
  const [isRotating, setIsRotating] = useState(false);
  type Todo = {
    inputValue: string;
    id: number;
    checked: boolean;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
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

  const handleReset = () => {
    setTime(60);
    setTodos([]);
    setInputValue("");
  };
  const handleImageClick = () => {
    setIsRotating(!isRotating);
  };
  return (
    <div className="App">
      <div>
        <h1>タイマー: {time}秒</h1>
        <button onClick={handleReset} className="resetButton">
          リセット
        </button>
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
