export const DEFAULT_STYLE = {
  display     : 'inline-block',
  color       : '#ffffff',
  background  : '#aa0000',
  whiteSpace  : 'pre-wrap',
  wordSpacing : 'normal',
  wordBreak   : 'normal'
};

const COPY_STYLES = [
  'display',
  'position',
  'top',
  'bottom',
  'left',
  'right',
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight'
];

const SAFE_RESULTS = {
  getInitialState: {},
  shouldComponentUpdate: true
};

const COUNTS = {};
function count (displayName) {
  if (!COUNTS[displayName]) {
    COUNTS[displayName] = 0;
  }

  return COUNTS[displayName]++;
}

/**
 * Returns a higher-order component that catches and displays errors.
 *
 * @param {Object} React
 * @param {String} filename
 * @param {String} displayName
 * @param {Object} defaultStyle Optional
 * @return {Function}
 * @api public
 */
export default function ErrorCatcher (
  React,
  filename,
  displayName,
  defaultStyle = DEFAULT_STYLE
) {
  return (Component) => class extends React.Component {
    static displayName = displayName+'ErrorCatcher'+count(displayName);

    componentDidMount() {
      this.rememberStyle();
    }

    componentDidUpdate() {
      this.rememberStyle();
    }

    rememberStyle() {
      const element = React.findDOMNode(this);
      const elementStyle = element && element.style;
      const elementClass = element && element.getAttribute('class');
      const style = {};

      if (this.state.err) {
        return;
      }

      for (let key in defaultStyle) {
        style[key] = defaultStyle[key];
      }

      for (let index of COPY_STYLES) {
        let key = COPY_STYLES[index];

        if (elementStyle[key]) {
          style[key] = elementStyle[key];
        }
      }

      if (style.display === 'none') {
        style.display = 'inline-block';
      }

      style.width  = element.offsetWidth;
      style.height = element.offsetHeight;

      // don't re-render, just remember for next error
      this.state.style     = style;
      this.state.className = elementClass;
    }

    patch() {
      const self  = this;
      const proto = Component.prototype;
      const keys  = Object.getOwnPropertyNames(proto);

      for (let key of keys) {
        let value = proto[key];

        if (typeof value === 'function') {
          proto[key] = function () {
            let result;

            if (self.state.err && key === 'render') {
              result = (
                <div
                  {...self.state.lastProps}   // attempt to maintain events
                  className={self.state.className}
                  style={self.state.style}
                >
                  {self.state.err.toString()}
                </div>
              );

              delete self.state.err;
            } else {
              try {
                result = value.apply(this, arguments);

                if (key === 'render') {
                  self.state.lastProps = result && result.props;
                }
              } catch (err) {
                if (SAFE_RESULTS[key]) {
                  result = SAFE_RESULTS[key];
                } else if (key === 'render') {
                  result = <div>{displayName}</div>;
                }

                setTimeout(() => {
                  self.setState({err: err});
                });
              }
            }

            return result;
          };
        }
      }
    }

    render() {
      // for some reason `constructor` isn't getting called after hot reload
      // despite this HOC being completely new every time, so let's use this
      // hack until we can figure out why -_-
      if (!Component._patchedToCatch) {
        Component._patchedToCatch = true;
        this.state = {style: defaultStyle};
        this.patch();
      }

      return <Component {...this.props} />;
    }
  }
}
