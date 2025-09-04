import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';

/**
 * Definition of all types of inputs the form will need
 */
type InputData = {
    id: string;
    label: string;
    inputType: string;
    validation: Function;
};
const INPUT_LIST: { [key: string]: InputData } = {
    USERNAME: {
        id: "username",
        label: "Username",
        inputType: "text",
        validation: (value: string) => {
            if (value === '') return 'Username is required';
            return '';
        }
    },
    EMAIL: {
        id: "email",
        label: "Email",
        inputType: "email",
        validation: (value: string) => {
            let emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,63}$/;
            if (value === '') return 'Email is required';
            if (!emailRegex.test(value)) return 'Email is invalid';
            return '';
        }
    },
    PASSWORD: {
        id: "password",
        label: "Password",
        inputType: "password",
        validation: (value: string) => {
            let pwdRegex = /^.{6,}$/;
            if (value === '') return 'Password is required';
            if (!pwdRegex.test(value)) return 'Password should have a minimun length of 6 characters';
            return '';
        }
    },
    CONFIRM_PASSWORD: {
        id: "confirm_password",
        label: "Confirm Password",
        inputType: "password",
        validation: (value: string, linkedInputValue: string) => {
            if (value !== linkedInputValue) return 'Passwords does not match';
            return '';
        }
    }
};

//InputElement definition
interface InputElementProps {
    inputData: InputData;
    linkedInputRef?: React.RefObject<InputElementHandle | null>;
}

// InputElement public functions definition
interface InputElementHandle {
    isValid: () => boolean;
    getValue: () => string;
}

/**
 * Styles for the input component
 * (As I said in TodoList component, I would have done it in CSS, but will leave it as an object to mantain the actual structure)
 */
const InputStyles = {
    inputContainer: {
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        gap: 4,
        fontSize: 18,
        width: '100%'
    },
    input: {
        padding: 8,
        borderRadius: 4,
        border: 'unset'
    },
    errorMessage: {
        backgroundColor: '#cc1d1d',
        padding: '2px 6px',
        borderRadius: 6,
        fontSize: 14,
        margin: '4px 0 0'
    }
};

const InputElement = forwardRef<InputElementHandle, InputElementProps>((props, ref) => {
    const inputData = props?.inputData;
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    // Internal validation function, used inside useImperativeHandle and input change handler
    const validate = (val: string) => {
        const linkedInputValue = props?.linkedInputRef?.current?.getValue() || null;
        return inputData.validation(val, linkedInputValue);
    };

    //Since I need to check if the input is valid in the form context, I need to expose some functions
    useImperativeHandle(ref, () => ({
        isValid: () => {
            const errorMessage = validate(value);
            setError(errorMessage);
            return errorMessage === '';
        },
        getValue: () => value
    }));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = e.target.value;
        setValue(inputValue);

        //Validate input and set errors if needed
        const errorMessage = validate(inputValue);
        setError(errorMessage);
    };

    return (
        <div style={InputStyles.inputContainer}>
            <label htmlFor={inputData.id}>{inputData.label}:</label>
            <input
                id={inputData.id}
                name={inputData.id}
                type={inputData.inputType}
                value={value}
                onChange={handleInputChange}
                style={InputStyles.input}
            />
            {error !== '' && <div style={InputStyles.errorMessage}>{error}</div>}
        </div>
    );
});

/**
 * Form definition
 */
const RegistrationForm: React.FC = () => {
    // Since I want to avoid having multiple places to define each input, here I loop all the list and save the ref
    const inputKeys = Object.keys(INPUT_LIST);
    const refList = inputKeys.map(() => useRef<InputElementHandle>(null));

    const formInputList = inputKeys.map((key, index) => (
        <InputElement
            key={INPUT_LIST[key].id}
            ref={refList[index]}
            inputData={INPUT_LIST[key]}
            // Send linkedInputRef for CONFIRM_PASSWORD
            // Not 100% happy with this solution. We can discuss this in the interview!
            {...(key === "CONFIRM_PASSWORD" ? { linkedInputRef: refList[inputKeys.indexOf("PASSWORD")] } : {})}
        />
    ));

    const isValid = () => {
        let valid = true;

        // Loop input list and check isValid
        refList.forEach(ref => {
            if (!ref.current?.isValid()) valid = false;
        });

        return valid;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formValid = isValid();
        if (formValid) {
            console.log('Registration successful!');
            // Registration logic
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 320 }}>
            {formInputList}
            <button type="submit">Register</button>
        </form>
    );
};

export { RegistrationForm };
