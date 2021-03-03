import React from 'react';
import { Link } from 'react-router-dom';

export const EntryPage: React.FC = () => {
    return (
        <section className="hero is-fullheight">
            <div className="hero-body">
                <div className="container has-text-centered">
                    <h1 className="is-size-2 mb-6">Welcome to Paranote</h1>
                    <div className="columns has-text-centered is-centered">
                        <div className="column is-one-quarter">
                            <Link
                                to="/create-source"
                                className="button is-primary is-normal is-fullwidth mb-4"
                            >
                                Create New Source
                            </Link>
                            <Link
                                to="/load-source"
                                className="button is-primary is-normal is-fullwidth"
                            >
                                Load Existing Source
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
