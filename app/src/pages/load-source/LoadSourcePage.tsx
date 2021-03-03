import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FormBrowserField from '../../components/FormBrowserField/FormBrowserField';
import FormTextField from '../../components/FormTextField/FormTextField';
import { showOpenFileDialog } from '../../providers/dialog.context';
import { loadSource } from '../../redux/thunks/sources.thunks';
import { LoadSourceForm } from './LoadSourceForm';

export default function LoadSourcePage(): JSX.Element {
    const history = useHistory();
    const dispatch = useDispatch();

    const initialValues: LoadSourceForm = {
        location: '',
        password: ''
    };

    async function handleSubmit(
        { location, password }: LoadSourceForm,
        helpers: FormikHelpers<LoadSourceForm>
    ) {
        await dispatch(loadSource({ location, password }));
        helpers.setSubmitting(false);
    }

    function handleCancel() {
        history.push('/');
    }

    function validate({ location }: LoadSourceForm) {
        const errors = { location: '' };

        if (!location) {
            errors.location = 'Location is Required';
        }

        return errors;
    }

    return (
        <div className="container is-fluid mt-5">
            <h1 className="is-size-4 is-uppercase">Load Existing Source</h1>
            <Formik
                validateOnBlur={false}
                validateOnChange={false}
                initialValues={initialValues}
                validate={validate}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors }) => (
                    <Form className="mt-4">
                        <FormBrowserField
                            id="location"
                            label="Location"
                            onBrowse={showOpenFileDialog}
                            error={errors.location}
                        />
                        <FormTextField id="password" label="Password (optional)" type="password" />
                        <div className="field is-grouped is-grouped-right">
                            <p className="control">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="button is-primary"
                                >
                                    Load
                                </button>
                            </p>
                            <p className="control">
                                <button
                                    className="button is-light"
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </p>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
