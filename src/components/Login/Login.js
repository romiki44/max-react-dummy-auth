import React, { useReducer, useState, useEffect } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

//ma byt mimo Login(), lebo nema byt ovplyvnovana nicim co je v Login()...teda kde je vlastny useReducer()
const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.includes('@') };
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') };
  }
  return { value: '', isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: '', isValid: false };
};

const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispachEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  });

  const [passwordState, dispachPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null,
  });

  //object destructuring....cize emailSate vyebrieme isValid a priradime emailIsValid...to iste pre passwordState
  //ide o to, ze zase pricasto sa vola useEffect, ak je dependencies=[emailState, passwordState]
  //pretoze to sa meni casto, resp. vzdy ked sa zmeni hodnota email/password
  //ale nas zaujima iba ci su hodnoty validne....preto iba toto pouzijem do dependecies a nie cely State
  //...druha moznost: nemusime robit destructuring objektu, ale mozeme pouzit v dependencies len
  //propertie, cize emailState.isValid a password.isValid...to sa mi paci asi viac
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Checkin validation');
      //setFormIsValid(emailState.isValid && passwordState.isValid);
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    return () => {
      console.log('CLEANUP!');
      clearTimeout(timer);
    };
  }, [emailIsValid, passwordIsValid]);
  //}, [emailState, passwordState]);

  const emailChangeHandler = (event) => {
    dispachEmail({ type: 'USER_INPUT', val: event.target.value });

    //potrebuje aktualny posledny stav passwordState...preto lepsie useEffect
    //setFormIsValid(event.target.value.includes('@') && passwordState.isValid);
  };

  const passwordChangeHandler = (event) => {
    dispachPassword({ type: 'USER_INPUT', val: event.target.value });

    //potrebuje aktualny posledny stav emailState...preto lepsie useEffect
    //setFormIsValid(emailState.isValid && event.target.value.trim().length > 6);
  };

  const validateEmailHandler = () => {
    dispachEmail({ type: 'INPUT_BLUR' });
  };

  const validatePasswordHandler = () => {
    dispachPassword({ type: 'INPUT_BLUR' });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor='email'>E-Mail</label>
          <input
            type='email'
            id='email'
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            value={passwordState.value}
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
