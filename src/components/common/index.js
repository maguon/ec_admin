import {TextField} from '@material-ui/core';
export const  FormTextInput = ({ input, label, type, meta: { touched, error, invalid } }) => (
    <TextField
        type={type}
        label={label}
        error={touched && invalid}
        helperText={touched && error}
        variant="outlined"
        margin="normal"
        fullWidth={true}
        {...input}
    />
);