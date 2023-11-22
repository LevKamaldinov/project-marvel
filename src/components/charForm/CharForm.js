import { Link } from 'react-router-dom';
import { useState } from 'react';
import useMarvelService from '../../services/MarvelService';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './charForm.scss'


const CharForm = (props) => {
    const [foundChar, setFoundChar] = useState(null);
    const [charItem, setCharItem] = useState([]);

    const {getChar} = useMarvelService();
    const findChar = (name) => {
        setFoundChar(null);
        getChar()
            .then(data => {
                // setCharItem(data.filter(item => item.name === name));
                // console.log(charItem);
                const char = data.filter(item => item.name === name);
                return char[0];
            })
            .then(char => {
                if (char) {
                    setCharItem(char);
                    setFoundChar(char.name);
                } else {
                    setFoundChar(0);
                }
            })
    }   
    const positiveAnswer = <div className='form__result__plus'>
            <p>There is! Visit {foundChar} page?</p>
            <div>
                <Link to={`/char/${charItem.id}`}>
                    <button type='button' className='form__result__button'>TO PAGE</button>
                </Link>
            </div>

        </div>;
    const negativeAnswer = <div className='form__result__zero'>
            <p>The character was not found. Check the name and try again</p>
        </div>;
    let answer = foundChar ? positiveAnswer : foundChar === 0 ? negativeAnswer : null;

    return (
        <Formik 
            initialValues={{
                name: ''
            }}
            validationSchema={Yup.object({ 
                name: Yup.string().required('This field is required')
            })}
            onSubmit={values => {
                findChar(values.name);
                console.log(JSON.stringify(values, null, 2));
            }}
        >
            <Form className='form' onChange={e => !e.target.value ? setFoundChar(null) : null}>
                <label htmlFor="name" className='form__label'><b>Or find a character by name:</b></label>
                <Field
                    id="name"
                    name="name"
                    type="text"
                    className="form__input"
                    placeholder='Enter name'
                    // onChange={() => answer = null}
                />
                <button type="submit" className='form__button'>FIND</button>
                <ErrorMessage className="error" name='name' component='div'/>
                {answer}
            </Form>
        </Formik>
    )
}

export default CharForm;
