import { Form, Formik, FormikErrors, FormikHelpers } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FormBrowserField from '../../components/FormBrowserField/FormBrowserField';
import FormTextField from '../../components/FormTextField/FormTextField';
import { showSaveFileDialog } from '../../providers/dialog.context';
import { createSource } from '../../redux/thunks/sources.thunks';
import { CreateSourceForm } from './CreateSourceForm';

export default function CreateSourcePage(): JSX.Element {
    const history = useHistory();
    const dispatch = useDispatch();

    const initialValues: CreateSourceForm = {
        name: '',
        location: ''
    };

    async function handleSubmit(
        { name, location, password }: CreateSourceForm,
        helpers: FormikHelpers<CreateSourceForm>
    ) {
        await dispatch(createSource({ name, location, password }));
        helpers.setSubmitting(false);
        goBack();
    }

    function goBack() {
        history.push('/');
    }

    function validate({ name, location }: CreateSourceForm) {
        const errors: FormikErrors<CreateSourceForm> = {};

        if (!name) {
            errors.name = 'Name is Required';
        }

        if (!location) {
            errors.location = 'Location is Required';
        }

        return errors;
    }

    return (
        <div className="container is-fluid mt-5">
            <h1 className="is-size-4 is-uppercase">Create New Source</h1>
            <Formik
                validateOnBlur={false}
                validateOnChange={false}
                initialValues={initialValues}
                validate={validate}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors }) => (
                    <Form className="mt-4">
                        <FormTextField id="name" label="Name" error={errors.name} />
                        <FormBrowserField
                            id="location"
                            label="Location"
                            onBrowse={showSaveFileDialog}
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
                                    Create
                                </button>
                            </p>
                            <p className="control">
                                <button
                                    className="button is-light"
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={goBack}
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
