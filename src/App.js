import logo from './logo.svg';
import './App.css';
import SubtitleCleaner from './components/SubtitleCleaner';
import Logo from './components/Logo';


function App() {
  return (
    <div className="App">
      <Logo/>
      <h1>.SRT to .TXT File</h1>

      <SubtitleCleaner />

    </div>
  );
}

export default App;
