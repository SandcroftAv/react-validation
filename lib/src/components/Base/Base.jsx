import { Component, PropTypes } from 'react';
import noop from './../../utils/noop';

class Base extends Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({
                value: nextProps.value,
                isChanged: true
            }, () => {
                this.context.validateState(this.props.name);
            });
        } else if (nextProps.validations !== this.props.validations) {
            this.context.validateState(this.props.name);
        }
    }

    componentWillUnmount() {
        this.context.unregister(this);
    }

    onChange = (event) => {
        // TODO: Refactor conditions
        const isChecked = this.state.isCheckbox ? !this.state.isChecked : true;
        const checkboxValue = isChecked ? event.target.value : '';
        const value = this.state.isCheckbox ? checkboxValue : event.target.value;

        event.persist();

        this.setState({
            value,
            isChanged: true,
            isChecked
        }, () => {
            this.context.validateState(this.props.name);

            (this.props.onChange || noop)(event);
        });
    };

    onBlur = (event) => {
        this.setState({
            isUsed: true
        }, () => {
            this.context.validateState(this.props.name);

            event.persist();

            (this.props.onBlur || noop)(event);
        });
    };
}

Base.propTypes = {
    value: PropTypes.string.isRequired,
    validations: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onBlur: PropTypes.func
};

Base.contextTypes = {
    register: PropTypes.func.isRequired,
    unregister: PropTypes.func.isRequired,
    validateState: PropTypes.func.isRequired,
    components: PropTypes.objectOf(PropTypes.any),
    errors: PropTypes.objectOf(PropTypes.any)
};

export default Base;
