import Home from './components/Home/Home'
import Host from './components/Host/Host'
import Join from './components/Join/Join'
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'


function App() {
  return (

    <div className='App main-container'>
      <Router>
        <Header />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/host' exact component={Host} />
          <Route path='/room/:id' render={() => {
            return (
              <p>test</p>
            )
          }}
          />
          <Route path='/join' exact component={Join} />
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
