import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import Upload from "./components/Upload/Upload"
import Output from "./Output.jsx"

export default function App(props) {
  return (
    <Router>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/output/:imageHash" component={Output} />
        <Route path="/" component={Upload} />
      </Switch>
    </Router>
  )
}