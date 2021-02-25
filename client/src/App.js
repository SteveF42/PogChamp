import Home from './components/Home/Home'
import Host from './components/Host/Host'
import Join from './components/Join/Join'
import Header from './components/Header'
import Footer from './components/Footer'
import Room from './components/Room/Room'
import AuthCallback from './components/AuthCallback'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'


function App() {
  return (

    <div className='App main-container'>
      <Router>
        <Header />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/join' exact component={Join} />
          <Route path='/host' component={Host} />
          <Route path='/authCallback' component={AuthCallback} />
          <Route path='/room/:id' component={Room} />
          <Route path='/' render={()=>{
            return(
              <p>Not Found 404</p>
            )
          }} />
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
