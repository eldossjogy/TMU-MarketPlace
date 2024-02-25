import "./index.css";
import React, {useContext} from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage";
import MyProfile from "./pages/MyProfile";
import AdminDashboard from "./pages/AdminDashboard";
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

  // protected routes such as login required routes and admin dashboard route will be protected later. 
  // not a high priority right now
  return (

    <Routes>
       <Route path = "/">
          <Route index element={<HomePage />}/>
          <Route path = "my-market" element={<MyProfile />}/>
          <Route path = "admin-dashboard" element={<AdminDashboard />}/>
        </Route>
    </Routes>
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