import React from 'react';
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from 'axios';



function LoginForm({ values, errors, touched, isSubmitting }) {
    return (
        <Form>
            <div>
                {touched.name && errors.name && <p className="error">{errors.name}</p>}
                <Field type="name" name="name" placeholder="Name" />
            </div>
            <div>
                {touched.email && errors.email && <p className="error">{errors.email}</p>}
                <Field type="email" name="email" placeholder="Email" />
            </div>
            <div>
                {touched.password && errors.password && <p className="error">{errors.password}</p>}
                <Field type="password" name="password" placeholder="Password" />
            </div>
            <div>
                <Field component="select" name="pronouns">
                    <option value="they">They/Them</option>
                    <option value="she">She/Her</option>
                    <option value="he">He/Him</option>
                    <option value="none">None of these</option>
                </Field>
            </div>
            <div>
                <label className="checkbox-container">
                {touched.tos && errors.tos && <p className="error">{errors.tos}</p>}
                    <Field type="checkbox" name="tos" checked={values.tos} />
                    Accept TOS
        </label>
            </div>
            <button type="submit" disabled={isSubmitting}>Submit</button>
        </Form>
    );
}

const FormikLoginForm = withFormik({
    mapPropsToValues({ name, email, password, pronouns, tos }) {
        return {
            name: name || "",
            email: email || "",
            password: password || "",
            pronouns: pronouns || "they",
            tos: tos || false
        };
    },
    validationSchema: Yup.object().shape({
        name: Yup.string()
            .required("Name is required"),
        email: Yup.string()
            .email("Email not valid")
            .required("Email is required"),
        password: Yup.string()
            .min(16, "Password must be 16 characters or longer")
            .required("Password is required"),
        pronouns: Yup.string(),
        tos: Yup.bool().oneOf([true], 'You must accept the terms of service')
    }),

    handleSubmit(values, { resetForm, setErrors, setSubmitting }) {
        if (values.email === "alreadytaken@atb.dev") {
            setErrors({ email: "That email is already taken" });
        if (values.tos === false) {
            setErrors({tos: "You must CHECKTHEBOX"})
        }
        } else {
            axios
                .post("https://reqres.in/api/users", values)
                .then(res => {
                    console.log(res); 
                    resetForm();
                    setSubmitting(false);
                })
                .catch(err => {
                    console.log("Oh shoot: ", err); 
                    setSubmitting(false);
                });
        }
    }
})(LoginForm);

export default FormikLoginForm;