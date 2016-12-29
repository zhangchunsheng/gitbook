const React = require('react');
const ReactSafeHtml = require('react-safe-html');
const { DOMProperty } = require('react-dom/lib/ReactInjection');
const htmlTags = require('html-tags');
const entities = require('entities');

const { InjectedComponent } = require('./InjectedComponent');

DOMProperty.injectDOMPropertyConfig({
    Properties: {
        align: DOMProperty.MUST_USE_ATTRIBUTE
    },
    isCustomAttribute: (attributeName) => {
        return attributeName === 'align';
    }
});

/*
    HTMLContent is a container for the page HTML that parse the content and
    render the right block.
    All html elements can be extended using the injected component.
 */

function inject(injectedProps, Component) {
    return (props) => {
        const cleanProps = {
            ...props,
            className: props['class']
        };
        delete cleanProps['class'];

        return (
            <InjectedComponent {...injectedProps(cleanProps)}>
                <Component {...cleanProps} />
            </InjectedComponent>
        );
    };
}

const COMPONENTS = {
    // Templating blocks are exported as <xblock name="youtube" props="{}" />
    'xblock': inject(
        ({name, props}) => {
            props = entities.decodeHTML(props);
            return {
                matching: { role: `block:${name}` },
                props: JSON.parse(props)
            };
        },
        props => <div {...props} />
    )
};

htmlTags.forEach(tag => {
    COMPONENTS[tag] = inject(
        props => {
            return {
                matching: { role: `html:${tag}` },
                props
            };
        },
        props => React.createElement(tag, props)
    );
});

const HTMLContent = React.createClass({
    propTypes: {
        html: React.PropTypes.string.isRequired
    },

    render() {
        const { html } = this.props;
        return <ReactSafeHtml html={html} components={COMPONENTS} />;
    }
});

module.exports = HTMLContent;
