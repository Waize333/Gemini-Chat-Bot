import React, { useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const surpriseOptions = [
    'who won the latest noble prize',
    'where does pizza come from',
    'how do you make donuts',
    'what is the capital of Iceland',
    'how many bones are there in the human body',
    'who is the author of "The Great Gatsby"',
    'what is the boiling point of water in Fahrenheit',
    'how many planets are there in the solar system',
    'who painted the Mona Lisa',
    'what is the largest mammal in the world'
];


  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  }

  const getResponse = async () => {
    if (!value) {
      setError("Error! Please ask a Question");
      return;
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch('http://localhost:8000/gemini', options);
      const data = await response.text();
      console.log(data);
  
      setChatHistory(oldChatHistory => [
        ...oldChatHistory,
        { role: "user: ", parts: [value] },  // Ensure to include `parts`
        { role: "model: ", parts: [data] }   // Ensure to include `parts`
      ]);
      setValue("");
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again later.");
    }
  }
  

  const clear = () => {
    setValue(""); // Correctly call setValue to update state
    setError("");
    setChatHistory([]);
  }

  return (
    <div className="app">
      <p>What do you want to know?</p>
      <button className="surprise" onClick={surprise} disabled={chatHistory.length > 0}>
        Surprise me
      </button>
      <div className="input-container">
        <input
          value={value}
          placeholder="Enter your question"
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      {!error && <button onClick={getResponse}>Ask me</button>}
      {error && <button onClick={clear}>Clear</button>}
      {error && <p>{error}</p>}
      <div className="search-result">
        {chatHistory.map((chatItem, index) => (
          <div key={index}>
            <p className="Answer">{chatItem.role}{chatItem.parts}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
