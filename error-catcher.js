export const style = {
  color       : "#ffffff",
  background  : "#aa0000",
  whiteSpace  : "pre-wrap",
  wordSpacing : "normal",
  wordBreak   : "normal"
};

/**
 * Returns a higher-order component that catches and displays errors.
 *
 * @param {Object} React
 * @param {String} filename
 * @param {displayName} displayName
 * @return {Function}
 * @api public
 */
export default function ErrorCatcher (React, filename, displayName) {
  displayName += 'ErrorCatcher';

  const HOC = (Component) => class extends React.Component {
    static displayName = displayName

    render() {
      let result;

      try {
        result = <Component {...this.props} />;
      } catch (err) {
        result = <div style={style}>{err.toString()}</div>;
      }

      return result;
    }
  }

  return HOC;
}
