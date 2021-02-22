import Home from './components/Home/Home'
import Join from './components/Join/Join'
import Create from './components/Create/Create'
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css'


function App() {
  return (

    <div className='App main-container'>
      <Header />
      <Router>
        <Route path='/' exact component={Home} />
        <Route location='/join' component={Join}/>
        <Route location='/create' component={Create}/>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
