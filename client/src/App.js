import "./index.css";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://jjcsqjjvzatkopidmaha.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqY3Nxamp2emF0a29waWRtYWhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg1NTk2OTcsImV4cCI6MjAyNDEzNTY5N30.9sby3xIuzizJGRTmBawKI6ra3_0CucTB8AvrU1TX0VA");

function App() {

  const [countries, setCountries] = useState([]);

    useEffect(() => {
      getCountries();
    }, []);

    async function getCountries() {
      const { data } = await supabase.from("countries").select();
      setCountries(data);
    }

  return (

    <div className="App">
      <ul>
        {countries.map((country) => (
          <li key={country.name}>{country.name}</li>
        ))}
    </ul>
      <nav className=" bg-slate-900 h-[8vh]">
        <div className="container mx-auto flex px-4 justify-between items-center">
          <div id="logo" className="h-[6vh]">
            <img src="./assets/logo.png" alt="logo" className="h-full w-auto"></img>
          </div>
          <div id="search" className="w-auto flex space-x-4 items-center justify-center">
            <input
              className="rounded-xl h-[4vh] w-[400px] text-center"
              placeholder="123-45-678">
            </input>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-[3vh] h-[3vh] stroke-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </span>
          </div>
          <div id="account"></div>
        </div>

      </nav>
      <main className="container m-auto">
        <section id="toolbar" className="flex shadow bg-neutral-100 rounded-xl w-full justify-between p-4 items-center my-4">
          <div id="filters" className="flex space-x-4 text-xl justify-center items-center">
            <ToolbarButton primary={true} value={"Automobiles"} />
            <ToolbarButton primary={false} value={"Textbooks"} />
            <ToolbarButton primary={false} value={"Recently Added"} />
            <ToolbarButton primary={false} value={"Electronics"} />
            <ToolbarButton primary={false} value={"Supplies"} />
          </div>
          <div id="controls">
            <ToolbarButton primary={false} value={"X"} />
          </div>
        </section>
        <section id="sidebar" className="w-[20%] h-[80vh] bg-slate-300 rounded-lg shadow-lg"></section>

        <section id="content"></section>
      </main>
    </div>
  );
}

function ToolbarButton(props) {
  let colourStyle = props.primary ? 'ring-yellow-500 hover:bg-yellow-400 ' : 'ring-blue-500 hover:bg-blue-500 hover:text-white '
  let style = colourStyle + 'ring-2 rounded-2xl px-4 py-1';
  return (
    <button className={style}>{props.value}</button>
  )
}

export default App;