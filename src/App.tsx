import "./App.css";
import { ChangeEvent, useState } from "react";
function App() {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  type Todo = {
    inputValue: string;
    id: number;
    checed: boolean;
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  return (
    <div className="App">
      <div>
        <h2>Todoリスト</h2>
        <form onSubmit={() => {}}>
          <input
            type="text"
            onChange={(e) => handleChange(e)}
            className="inputText"
          />
          <input type="submit" value="作成" className="submitButton" />
        </form>
      </div>
    </div>
  );
}

export default App;
