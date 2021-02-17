import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import BrowseButton, { OPEN_TYPE } from '../components/BrowseButton';
import Button from '../components/Button';
import Form from '../components/Form';
import FormField from '../components/FormField';
import Label from '../components/Label';
import TextField from '../components/TextField';
import { loadSource } from '../redux/thunks/sources.thunks';
import { ControlWrapper, PageTitle, PageWrapper } from './Page.styles';

const LoadSourcePage = ({ linkClose }) => {
    const dispatch = useDispatch();
    const [location, setLocation] = useState('');
    const [locationError, setLocationError] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [close, setClose] = useState(false);

    const resetErrors = () => {
        setError('');
        setLocationError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        resetErrors();

        if (location) {
            setLoading(true);
            await dispatch(loadSource({ location, password }));
            setClose(true);
        } else {
            if (!location) {
                setLocationError('A location is required for the new source');
            }
        }
    };

    const handleChooseConfirm = (result) => {
        setLocation(result);
    };

    const handlePasswordChange = (value) => {
        setPassword(value);
    };

    if (close) {
        return <Redirect to={linkClose} />;
    }

    return (
        <PageWrapper>
            <PageTitle>Load Existing Source</PageTitle>
            <Form error={error}>
                <FormField error={locationError}>
                    <Label htmlFor="location">Location</Label>
                    <BrowseButton
                        id="location"
                        onChooseConfirm={handleChooseConfirm}
                        type={OPEN_TYPE}
                    />
                </FormField>
                <FormField>
                    <Label htmlFor="password">Password (optional)</Label>
                    <TextField id="password" type="password" onChange={handlePasswordChange} />
                </FormField>
                <ControlWrapper>
                    <Button onClick={handleSubmit} disabled={loading}>
                        Load
                    </Button>
                    <Button link={linkClose} disabled={loading} type="secondary">
                        Back
                    </Button>
                </ControlWrapper>
            </Form>
        </PageWrapper>
    );
};

LoadSourcePage.propTypes = {
    linkClose: PropTypes.string.isRequired
};

export default LoadSourcePage;
