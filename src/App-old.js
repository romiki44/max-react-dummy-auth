import React, { useEffect, useState } from 'react';

import Login from './components/Login/Login';
import Home from './components/Home/Home';
import MainHeader from './components/MainHeader/MainHeader';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem('isLoggedIn');
    if (isUserLoggedIn === '1') {
      //ak by sme to dali len tak do apky, tak vynikne nekonecna slucka, pretoze
      //najprv nacitame localStorage a potom zavolame setIsLogged(true)
      //ale vzdy ked zavolame useState(), component sa re-renderuje
      //...cize zasa sa nacita localstorage a zase sa zavola useState()...a tak donekonecna
      //PRETO TO MUSI BYT TU!! (cize UseEffect)...
      //pretoze zbehne az po tom, co sa cely komponenent vyrenderuje...ale iba ked sa zmenia uvedene dependency!!!
      //kedze pole dependency je prazdne []...zbehne iba raz, na uplnom zaciatku (preco?)
      setIsLoggedIn(true);
    }
  }, []);

  const loginHandler = (email, password) => {
    // We should of course check email and password
    // But it's just a dummy/ demo anyways
    localStorage.setItem('isLoggedIn', '1');
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <React.Fragment>
      <MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} />
      <main>
        {!isLoggedIn && <Login onLogin={loginHandler} />}
        {isLoggedIn && <Home onLogout={logoutHandler} />}
      </main>
    </React.Fragment>
  );
}

export default App;
