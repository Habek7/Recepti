import { Router, Route } from "@solidjs/router";
import { AuthProvider } from "./AuthProvider";


import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import Recepti from "./Recepti";
import Pretrazivanje from "./Pretrazivanje";


function App() {

  return (
    <AuthProvider>
      <Router>
        <Route path="/Register" component={Register} />
        <Route path="/Login" component={Login} />
        <Route path="/Home" component={Home} />
        <Route path="/Recepti" component={Recepti} />
        <Route path="/Pretrazivanje" component={Pretrazivanje} />
      </Router>
    </AuthProvider>

  );
}

export default App;
