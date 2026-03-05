import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, RotateCcw } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const API = "https://wa-segregator-backend.onrender.com/api";

const COLORS = {
CRITICAL: "#ff4d4f",
IMPORTANT: "#f59e0b",
CASUAL: "#3b82f6",
NON_IMPORTANT: "#9ca3af",
SPAM: "#a855f7",
FAKE: "#14b8a6",
};

export default function App() {

const saved = JSON.parse(localStorage.getItem("priion_user"));

const [step, setStep] = useState(saved ? "dashboard" : "intro");
const [role, setRole] = useState(saved?.role || "");
const [user, setUser] = useState(saved || null);

const [name, setName] = useState("");
const [phone, setPhone] = useState("");

const [messages, setMessages] = useState([]);
const [sender, setSender] = useState("");
const [text, setText] = useState("");
const [stats, setStats] = useState({});

const anim = {
initial: { opacity: 0, y: 40 },
animate: { opacity: 1, y: 0 },
exit: { opacity: 0, y: -40 },
transition: { duration: 0.35 }
};

useEffect(() => {
if (step === "dashboard") loadStats();
}, [step]);

const loadStats = async () => {
try {
const res = await fetch(`${API}/stats`);
const data = await res.json();
setStats(data);
} catch (err) {
console.log(err);
}
};

const classify = async () => {

```
if (!text) return;

const res = await fetch(`${API}/classify`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ sender, text })
});

const data = await res.json();

setMessages([data, ...messages]);
loadStats();

setText("");
setSender("");
```

};

const saveProfile = () => {

```
const data = { name, phone, role };

localStorage.setItem("priion_user", JSON.stringify(data));

setUser(data);

setStep("dashboard");
```

};

const resetProfile = () => {

```
localStorage.removeItem("priion_user");

window.location.reload();
```

};

const chartData = Object.keys(stats || {}).map((k) => ({
name: k,
value: stats[k]
}));

return ( <div style={styles.app}>

```
  <AnimatePresence mode="wait">

    {step === "intro" && (
      <motion.div key="intro" {...anim} style={styles.center}>
        <h1 style={styles.title}>PRIION</h1>
        <p style={styles.subtitle}>Prioritise What Matters</p>
        <button style={styles.btn} onClick={() => setStep("role")}>
          Enter
        </button>
      </motion.div>
    )}

    {step === "role" && (
      <motion.div key="role" {...anim} style={styles.center}>
        <h2 style={styles.sectionTitle}>Select Your Role</h2>

        {["Student","Teacher","Business","Corporate"].map((r)=>(
          <button
            key={r}
            style={styles.roleBtn}
            onClick={()=>{
              setRole(r)
              setStep("profile")
            }}
          >
            {r}
          </button>
        ))}
      </motion.div>
    )}

    {step === "profile" && (
      <motion.div key="profile" {...anim} style={styles.center}>

        <h2 style={styles.sectionTitle}>Your Details</h2>

        <input
          style={styles.input}
          placeholder="Your Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Mobile Number"
          value={phone}
          onChange={(e)=>setPhone(e.target.value)}
        />

        <button style={styles.btn} onClick={saveProfile}>
          Continue
        </button>

      </motion.div>
    )}

    {step === "dashboard" && (
      <motion.div key="dashboard" {...anim} style={styles.dashboard}>

        <div style={styles.header}>

          <div>
            <h1 style={{margin:0}}>PRIION</h1>
            <p style={{opacity:0.7}}>{user?.name}</p>
          </div>

          <div style={styles.headerBtns}>

            <button onClick={loadStats} style={styles.iconBtn}>
              <RefreshCw size={18}/>
            </button>

            <button onClick={resetProfile} style={styles.iconBtn}>
              <RotateCcw size={18}/>
            </button>

          </div>

        </div>

        <div style={styles.cards}>

          {["CRITICAL","IMPORTANT","SPAM"].map((c)=>(
            <div key={c} style={styles.card}>
              <h3>{c}</h3>
              <h2>{stats[c]||0}</h2>
            </div>
          ))}

        </div>

        <div style={styles.box}>

          <h3>Classify WhatsApp Message</h3>

          <input
            style={styles.input}
            placeholder="Sender"
            value={sender}
            onChange={(e)=>setSender(e.target.value)}
          />

          <textarea
            style={styles.textarea}
            placeholder="Paste message here..."
            value={text}
            onChange={(e)=>setText(e.target.value)}
          />

          <button style={styles.btn} onClick={classify}>
            Classify Message
          </button>

        </div>

        <div style={styles.chart}>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData} dataKey="value">
                {chartData.map((entry,index)=>(
                  <Cell key={index} fill={COLORS[entry.name]||"#888"} />
                ))}
              </Pie>
              <Tooltip/>
            </PieChart>
          </ResponsiveContainer>

        </div>

        <div style={styles.messages}>

          <h3>Message History</h3>

          {messages.length===0 && <p>No messages yet</p>}

          {messages.map((m,i)=>(
            <div key={i} style={styles.msg}>
              <b>{m.category}</b>
              <p>{m.text}</p>
            </div>
          ))}

        </div>

      </motion.div>
    )}

  </AnimatePresence>

</div>
```

);
}

const styles = {

app:{
minHeight:"100vh",
background:"linear-gradient(135deg,#020617,#0f172a)",
color:"white",
fontFamily:"Inter, sans-serif"
},

center:{
height:"100vh",
display:"flex",
flexDirection:"column",
alignItems:"center",
justifyContent:"center",
gap:20,
textAlign:"center"
},

title:{
fontSize:72,
letterSpacing:2,
fontWeight:800
},

subtitle:{
fontSize:20,
opacity:0.75
},

sectionTitle:{
fontSize:28
},

btn:{
padding:"12px 24px",
borderRadius:12,
border:"none",
background:"#2563eb",
color:"white",
cursor:"pointer",
fontSize:16
},

roleBtn:{
width:240,
padding:14,
borderRadius:12,
border:"1px solid #1e293b",
background:"#020617",
color:"white",
cursor:"pointer"
},

input:{
padding:12,
borderRadius:10,
border:"1px solid #1e293b",
width:280,
background:"#020617",
color:"white"
},

textarea:{
padding:12,
borderRadius:10,
border:"1px solid #1e293b",
width:"100%",
height:120,
background:"#020617",
color:"white"
},

dashboard:{
padding:30,
maxWidth:1000,
margin:"auto"
},

header:{
display:"flex",
justifyContent:"space-between",
alignItems:"center"
},

headerBtns:{
display:"flex",
gap:10
},

iconBtn:{
padding:10,
borderRadius:10,
border:"none",
background:"#1e293b",
color:"white",
cursor:"pointer"
},

cards:{
display:"flex",
gap:20,
marginTop:25,
flexWrap:"wrap"
},

card:{
width:180,
padding:20,
borderRadius:14,
background:"#020617",
border:"1px solid #1e293b"
},

box:{
marginTop:35,
display:"flex",
flexDirection:"column",
gap:10
},

chart:{
marginTop:40
},

messages:{
marginTop:40
},

msg:{
padding:12,
borderBottom:"1px solid #1e293b"
}

};
