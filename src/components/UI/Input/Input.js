import React, { useImperativeHandle, useRef } from 'react';
import classes from './Input.module.css';

//paramter ref umozni napojit sa zvonku na ref componentu a podla toho co je nastavene useImperativeHandle
//pouzit to zvonka...plus to nie je vsetko, treba este pouzit Raect.forwardRef()...
//az potom sa da volat activate() zvonka!!!!
const Input = React.forwardRef((props, ref) => {
  const inputRef = useRef();

  //napr. ak chceme fokusovat na chybny element...potom staci zavolat zvonka napr. cez useRef()
  //ako vzdy, nei je to take jednoduche, treba volat este in Hook, tzv. useImperativeHandle()
  const activate = () => {
    inputRef.current.focus();
  };

  //aby bolo mozne pouzit ref napr. na funkciu activate(), treba nastavit tento useImperativeHandle
  //takze podle tototo navonok activate() bude ako focus()
  //treb tiez pridat parameter ref pre Input(_)
  useImperativeHandle(ref, () => {
    return {
      focus: activate,
    };
  });

  return (
    <div
      className={`${classes.control} ${
        props.isValid === false ? classes.invalid : ''
      }`}
    >
      <label htmlFor='props.id'>{props.label}</label>
      <input
        ref={inputRef}
        type={props.type}
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
    </div>
  );
});

export default Input;
