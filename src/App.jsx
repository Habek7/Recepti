import { Router, Route } from "@solidjs/router";
import { AuthProvider } from "./AuthProvider";


import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import Recepti from "./Recepti";
import Pretrazivanje from "./Pretrazivanje";
import Omiljeni from "./Omiljeni";


function App() {

  return (
    <AuthProvider>
      <Router>
        <Route path="/" component={Register} />
        <Route path="/Login" component={Login} />
        <Route path="/Home" component={Home} />
        <Route path="/Recepti" component={Recepti} />
        <Route path="/Pretrazivanje" component={Pretrazivanje} />
        <Route path="/Omiljeni" component={Omiljeni} />

      </Router>
    </AuthProvider>

  );
}

export default App;
