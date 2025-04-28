import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [health, setHealth] = useState("");
  const [healthError, setHealthError] = useState(false);
  const [greet, setGreet] = useState("");
  const [greetError, setGreetError] = useState(false);
  const [postResp, setPostResp] = useState(null);
  const [postError, setPostError] = useState(false);

  useEffect(() => {
    setHealthError(false);
    fetch("/api/health")
      .then((r) => {
        if (!r.ok) throw new Error(`API error: ${r.status}`);
        return r.json();
      })
      .then((d) => setHealth(d.status))
      .catch((err) => {
        console.error("Health check failed:", err);
        setHealth("Error connecting to API");
        setHealthError(true);
      });
  }, []);

  const doGreet = async () => {
    setGreet("");
    setGreetError(false);
    try {
      const res = await fetch("/api/greet?name=Codespace");
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setGreet(data.message);
    } catch (err) {
      console.error("Greet request failed:", err);
      setGreet("Error: Couldn't connect to API");
      setGreetError(true);
    }
  };

  const doPost = async () => {
    setPostResp(null);
    setPostError(false);
    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Hi", content: "This is a POST." }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      setPostResp(await res.json());
    } catch (err) {
      console.error("Post request failed:", err);
      setPostResp({ error: "Failed to connect to API" });
      setPostError(true);
    }
  };

  return (
    <div className="App">
      <h1>Nginx Tutorial</h1>
      <div className="card">
        <p>
          Health:{" "}
          <span className={healthError ? "error-message" : ""}>{health}</span>
        </p>
      </div>
      <div className="card">
        <button onClick={doGreet}>GET /api/greet</button>
        {greet && (
          <div className={`greet-block ${greetError ? "error-message" : ""}`}>
            {greet}
          </div>
        )}
      </div>
      <div className="card">
        <button onClick={doPost}>POST /api/post</button>
        {postResp && (
          <pre className={postError ? "error-message" : ""}>
            {JSON.stringify(postResp, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

export default App;
