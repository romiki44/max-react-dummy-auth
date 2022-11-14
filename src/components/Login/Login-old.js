import React, { useEffect, useState } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

const Login = (props) => {
  // Privela UseState(), pricom niektore state zavisia od druhych state
  //PRETO LEPSIE POUZIT useReducer()!!!!!!
  const [enteredEmail, setEnteredEmail] = useState('');
  const [emailIsValid, setEmailIsValid] = useState();
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  //ak bez dependencies, bezi vzdy ked sa component vyrenderuje
  //ak dependencies=[], potom iba raz po prvom vyrenderovani...pri zmenach uz nereaguje
  useEffect(() => {
    console.log('UseEffect running!');
  }, []);

  // v podstate nahradi dva tie iste kody v emailChangeHandler a passwordChangeHandler
  // vzdy ked sa zmeni enterdEmail, enteredPassword zbehne setFormIsValid()
  // cize reaguje na klavesnicu...nie je to typicky side-efekt (napr. httpClient a pod)...ale je tiez side-efekt!
  useEffect(() => {
    // normalne to funguje bez Timeoutu uplne v pohode, akurat ze sa to spusta pre kazdy tuk klavesnice
    // co nevadi, ale niekedy to vraj nemusi byt ok....tak preto ten tiemout
    //vola validaciu kazdych 500ms....vtip je vsak v tom, ze skor nez staci timer dobehnut
    //spusti sa clenaup a timer vynuluje....cize validacia sa nespusti....spusti sa az vtedy,
    //ked sa medzi tukanim urobi pauza min. 500ms!!!!
    const timer = setTimeout(() => {
      console.log('Checkin validation');
      setFormIsValid(
        enteredEmail.includes('@') && enteredPassword.trim().length > 6
      );
    }, 500);

    //vraciam funkciu...ktora sa samozrejme hned aj spusti...toto je ten cleanup
    //proste cisto javascriptova ficura!!!!
    //ide tu aj o to, ze setTimeout() je async funkcia, ktora bezi akoby v samostantom vlakne
    //ale kod normalne pokracuje synchronne dalej, cize preto cleanup...
    return () => {
      console.log('CLEANUP!');
      clearTimeout(timer);
    };
  }, [enteredEmail, enteredPassword]);

  const emailChangeHandler = (event) => {
    setEnteredEmail(event.target.value);

    // setFormIsValid(
    //   event.target.value.includes('@') && enteredPassword.trim().length > 6
    // );
  };

  const passwordChangeHandler = (event) => {
    setEnteredPassword(event.target.value);

    // setFormIsValid(
    //   event.target.value.trim().length > 6 && enteredEmail.includes('@')
    // );
  };

  const validateEmailHandler = () => {
    //ZAVISI OD STATE enteredEmail....cize vyzaduje aktualny stav enteredEmail, co moze byt problem
    setEmailIsValid(enteredEmail.includes('@'));
  };

  const validatePasswordHandler = () => {
    //DETTO...ZAVISI OD STATE enteredPassword....cize vyzaduje aktualny stav enterdPassword, co moze byt problem
    setPasswordIsValid(enteredPassword.trim().length > 6);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(enteredEmail, enteredPassword);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailIsValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor='email'>E-Mail</label>
          <input
            type='email'
            id='email'
            value={enteredEmail}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordIsValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            value={enteredPassword}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type='submit' className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
