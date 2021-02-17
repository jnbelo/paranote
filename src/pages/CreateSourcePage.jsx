import path from 'path';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import BrowseButton from '../components/BrowseButton';
import Button from '../components/Button';
import Form from '../components/Form';
import FormField from '../components/FormField';
import Label from '../components/Label';
import TextField from '../components/TextField';
import { createSource } from '../redux/thunks/sources.thunks';
import { ControlWrapper, PageTitle, PageWrapper } from './Page.styles';

const CreateSourcePage = ({ linkClose }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [location, setLocation] = useState('');
    const [locationError, setLocationError] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [close, setClose] = useState(false);

    const resetErrors = () => {
        setError('');
        setLocationError('');
        setNameError('');
    };

    const formatLocation = (location) => {
        const parsed = path.parse(location);
        if (!parsed.ext) {
            return path.format({
                root: parsed.root,
                dir: parsed.dir,
                name: parsed.name,
                ext: '.parax'
            });
        }
        return location;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        resetErrors();

        if (name && location) {
            setLoading(true);
            await dispatch(createSource({ location, password, name }));
            setClose(true);
        } else {
            if (!name) {
                setNameError('A name is required for the new source');
            }

            if (!location) {
                setLocationError('A location is required for the new source');
            }
        }
    };

    const handleChooseConfirm = (result) => {
        setLocation(result);
    };

    const handleNameChange = (value) => {
        setName(value);
    };

    const handlePasswordChange = (value) => {
        setPassword(value);
    };

    if (close) {
        return <Redirect to={linkClose} />;
    }

    return (
        <PageWrapper>
            <PageTitle>Create New Source</PageTitle>
            <Form error={error}>
                <FormField error={nameError}>
                    <Label htmlFor="name">Name</Label>
                    <TextField id="name" type="text" onChange={handleNameChange} />
                </FormField>
                <FormField error={locationError}>
                    <Label htmlFor="location">Location</Label>
                    <BrowseButton
                        id="location"
                        formatResult={formatLocation}
                        onChooseConfirm={handleChooseConfirm}
                    />
                </FormField>
                <FormField>
                    <Label htmlFor="password">Password (optional)</Label>
                    <TextField id="password" type="password" onChange={handlePasswordChange} />
                </FormField>
                <ControlWrapper>
                    <Button onClick={handleSubmit} disabled={loading}>
                        Create
                    </Button>
                    <Button link={linkClose} disabled={loading} type="secondary">
                        Back
                    </Button>
                </ControlWrapper>
            </Form>
        </PageWrapper>
    );
};

CreateSourcePage.propTypes = {
    linkClose: PropTypes.string.isRequired
};

export default CreateSourcePage;
