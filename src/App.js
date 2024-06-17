import "./App.css";
import { BrowserRouter as Router, Route, Routes,} from "react-router-dom";
import BotScreen from "./Component/Bot/BotScreen";
import BotPractice from "./Component/Bot/BotPractice";
function App() {
  return (
    <>

    <div className="App">
      
      <Router>
        <Routes>

        <Route path="/" element={<BotScreen />} />
        <Route path="/bot" element={<BotPractice />} />
          
        </Routes>
      </Router>
      
    </div>
    </>
  );
}

export default App;
